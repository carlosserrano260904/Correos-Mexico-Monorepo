// app/registro/page.tsx - COMPLETO CORREGIDO
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaArrowLeft, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle, FaSignOutAlt } from "react-icons/fa";
import { Switch } from "@radix-ui/react-switch";
import CarruselLogin from "@/components/CarruselLogin";
import { useSignUp, useSignIn, useUser, useClerk } from "@clerk/nextjs"; // ✅ useUser en lugar de useAuth
import { useRouter } from "next/navigation";

const Registro = () => {
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { user, isLoaded: userLoaded } = useUser(); // ✅ useUser para verificar sesión
  const { signOut } = useClerk(); // ✅ Para cerrar sesión
  const router = useRouter();
  
  const [isChecked, setIsChecked] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [codigoVerificacion, setCodigoVerificacion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    console.log('🔍 Auth State:', { 
      user: user?.id, 
      userLoaded, 
      signUpLoaded, 
      signInLoaded 
    });

    if (user && userLoaded) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      router.push('/');
    }
  }, [user, userLoaded, router]);

  // Validaciones
  const isPasswordStrong = (password: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSwitchChange = () => setIsChecked(!isChecked);

  const validarFormulario = () => {
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setError("Todos los campos son obligatorios.");
      setSuccessMessage(""); 
      return false;
    }

    if (!isValidEmail(correo)) {
      setError("El correo electrónico no es válido.");
      setSuccessMessage(""); 
      return false;
    }

    if (!isPasswordStrong(contrasena)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      setSuccessMessage("");
      return false;
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      setSuccessMessage(""); 
      return false;
    }

    setError(""); 
    return true;
  };

  // ✅ REGISTRO con Clerk (email/password)
  const handleRegistroConClerk = async () => {
    if (!signUpLoaded || !validarFormulario()) return;

    // Verificar si ya está autenticado
    if (user) {
      setError("Ya tienes una sesión activa. Serás redirigido...");
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Crear usuario en Clerk
      const result = await signUp.create({
        firstName: nombre.split(' ')[0],
        lastName: nombre.split(' ').slice(1).join(' ') || ".",
        emailAddress: correo,
        password: contrasena,
      });

      console.log('🔍 Estado del registro Clerk:', result.status);

      if (result.status === 'complete') {
        // Registro completo - redirigir al dashboard
        setSuccessMessage("¡Cuenta creada exitosamente!");
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else if (result.status === 'missing_requirements') {
        // Clerk requiere verificación de email
        setPendingVerification(true);
        setSuccessMessage("Te hemos enviado un código de verificación a tu email.");
      }
    } catch (err: any) {
      console.error('❌ Error en registro Clerk:', err);
      
      // Manejo específico de errores
      if (err.errors?.[0]?.code === 'session_exists' || err.errors?.[0]?.message?.includes('already signed in')) {
        setError("Ya tienes una sesión activa. Redirigiendo...");
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(err.errors?.[0]?.message || "Error al crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verificación de código con Clerk
  const handleVerificacionClerk = async () => {
    if (!signUpLoaded) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: codigoVerificacion,
      });

      if (result.status === 'complete') {
        setSuccessMessage("¡Cuenta verificada exitosamente!");
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError("Código de verificación incorrecto");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error al verificar el código");
    } finally {
      setLoading(false);
    }
  };

  // ✅ OAuth con Clerk (Google/Facebook) - CORREGIDO
  const handleOAuthPress = async (strategy: 'oauth_google' | 'oauth_facebook') => {
    if (!signUpLoaded) {
      setError("Sistema de autenticación no disponible.");
      return;
    }

    // Verificar si ya está autenticado
    if (user) {
      setError("Ya tienes una sesión activa. Serás redirigido...");
      setTimeout(() => router.push('/dashboard'), 2000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signUp.authenticateWithRedirect({
        strategy: strategy as any,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error(`❌ OAuth ${strategy} error:`, err);
      
      // Manejo específico de errores
      if (err.errors?.[0]?.code === 'session_exists' || err.errors?.[0]?.message?.includes('already signed in')) {
        setError("Ya tienes una sesión activa. Redirigiendo...");
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        setError(err.errors?.[0]?.message || `Error al registrar con ${strategy === 'oauth_google' ? 'Google' : 'Facebook'}`);
      }
      setLoading(false);
    }
  };

  // ✅ Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleAceptarTerminos = () => {
    setShowTermsModal(false);
    handleRegistroConClerk();
  };

  // Si ya está autenticado, mostrar mensaje de redirección
  if (user && userLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ya tienes una sesión activa. Redirigiendo...</p>
          <button 
            onClick={handleLogout}
            className="mt-4 text-pink-600 hover:text-pink-700 underline"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // Si está en modo verificación, mostrar pantalla de verificación de Clerk
  if (pendingVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logoCorreos.png"
              alt="Logo Correos"
              width={80}
              height={80}
              className="w-16 h-16"
              priority
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
            Verifica tu cuenta
          </h2>
          
          <p className="text-gray-600 text-center mb-1">Código enviado a:</p>
          <p className="text-pink-600 font-semibold text-center mb-6">{correo}</p>

          {loading && (
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            </div>
          )}

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-3 mb-4">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Ingresa tu código de verificación"
              value={codigoVerificacion}
              onChange={(e) => setCodigoVerificacion(e.target.value)}
              className="w-full outline-none bg-transparent"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleVerificacionClerk}
            disabled={loading || !signUpLoaded}
            className="w-full bg-pink-600 text-white rounded-full py-3 font-semibold hover:bg-pink-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-3 text-center">{successMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Banner de sesión activa */}
      {user && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded z-50">
          <p>✅ Sesión activa</p>
          <button 
            onClick={handleLogout}
            className="text-sm underline flex items-center gap-1"
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
          {/* formulario */}
          <div className="w-full md:w-1/2 px-3 sm:px-6 py-3 flex flex-col justify-center min-h-0">
            {/* Logo */}
            <div className="flex justify-center mb-2 sm:mb-3">
              <Image
                src="/logoCorreos.png"
                alt="Logo Correos"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20"
                priority
              />
            </div>

            <div className="flex items-center justify-center mb-3 sm:mb-4 relative">
              <Link href="/login" className="absolute left-0 text-gray-600 hover:text-pink-600 transition">
                <FaArrowLeft size={20} className="sm:w-6 sm:h-6" />
              </Link>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">Registrarse</h2>
              <div className="absolute right-0 min-w-[20px] h-[20px] sm:min-w-[24px] sm:h-[24px] invisible" />
            </div>

            {loading && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
              </div>
            )}

            {/* Campo de Nombre */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
            </div>

            {/* Campo de Correo */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
              {correo.length > 0 && (
                isValidEmail(correo) ? 
                  <FaCheckCircle className="text-green-500 ml-2" /> : 
                  <FaExclamationCircle className="text-red-500 ml-2" />
              )}
            </div>

            {/* Campo de Contraseña */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            {contrasena.length > 0 && (
              <p className={`text-sm mb-4 ${
                isPasswordStrong(contrasena) ? 'text-green-600' : 'text-orange-600'
              }`}>
                {isPasswordStrong(contrasena)
                  ? '✔️ Contraseña segura'
                  : '⚠️ Al menos 8 caracteres, una mayúscula y un número'}
              </p>
            )}

            {/* Campo de Confirmar Contraseña */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
              <button 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {confirmarContrasena.length > 0 && (
                confirmarContrasena === contrasena ? 
                  <FaCheckCircle className="text-green-500 ml-2" /> : 
                  <FaExclamationCircle className="text-red-500 ml-2" />
              )}
            </div>

            {/* Mensajes de error y éxito */}
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-2 text-center">{successMessage}</p>}

            {/* Switch de recordar cuenta */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <label className="flex items-center space-x-3">
                <Switch
                  checked={isChecked}
                  onCheckedChange={handleSwitchChange}
                  className={`relative inline-flex h-4 w-7 sm:h-5 sm:w-9 items-center rounded-full transition-colors duration-300 ${
                    isChecked ? "bg-pink-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 transform rounded-full bg-white transition-transform duration-300 ${
                      isChecked ? "translate-x-3.5 sm:translate-x-5" : "translate-x-0.5 sm:translate-x-1"
                    }`}
                  />
                </Switch>
                <span className="text-gray-800 text-xs">Acepto términos y condiciones</span>
              </label>
            </div>

            {/* boton de registro */}
            <button
              onClick={() => setShowTermsModal(true)}
              disabled={loading || !signUpLoaded}
              className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4 disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            {/* divisor */}
            <div className="w-full flex items-center my-2 sm:my-3">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-400 text-xs">o</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* ingreso con redes sociales */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleOAuthPress('oauth_google')}
                disabled={loading || !signUpLoaded || !!user}
                className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 px-3 hover:bg-red-50 transition duration-200 disabled:opacity-50"
              >
                <Image src="/google-icon.png" alt="Google" width={20} height={20} className="w-5 h-5" />
                <span className="ml-2 text-sm text-gray-800 font-medium">
                  {loading ? "Conectando..." : "Registrarse con Google"}
                </span>
              </button>

              <button
                onClick={() => handleOAuthPress('oauth_facebook')}
                disabled={loading || !signUpLoaded || !!user}
                className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 px-3 hover:bg-blue-50 transition duration-200 disabled:opacity-50"
              >
                <Image src="/facebook-icon.png" alt="Facebook" width={20} height={20} className="w-5 h-5" />
                <span className="ml-2 text-sm text-gray-800 font-medium">
                  {loading ? "Conectando..." : "Registrarse con Facebook"}
                </span>
              </button>
            </div>

            {/* Link inferior 

            <p className="text-center text-xs text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-pink-600 hover:underline">
                Iniciar sesión
              </Link>
            </p>*/}
          </div>

          {/* Carrusel */}
          <CarruselLogin />
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Términos y Condiciones</h3>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <h4 className="text-pink-600 font-bold text-lg mb-4">TÉRMINOS Y CONDICIONES DE USO – CORREOS CLIC</h4>
                <p>Al hacer clic en "Aceptar", estás de acuerdo con nuestros términos y condiciones...</p>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-200"
              >
                Rechazar
              </button>
              <button
                onClick={handleAceptarTerminos}
                className="flex-1 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-200"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Registro;