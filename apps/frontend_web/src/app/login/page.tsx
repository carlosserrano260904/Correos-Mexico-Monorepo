"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Switch } from "@radix-ui/react-switch";
import CarruselLogin from "@/components/CarruselLogin";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const Login = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const handleSwitchChange = () => setIsChecked(!isChecked);


  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); //ruta para iniciar sesion
    }
  }, [isAuthenticated, router]);
  
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError("");
    setSuccessMessage("");


    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      setSuccessMessage(""); 
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, ingresa un correo válido.");
      setSuccessMessage(""); // Reseteamos el mensaje de éxito
      return;
    }

    
    try {
      // usar el MISMO login que en la navbar
      await login({ email, password});

      setSuccessMessage("Inicio de sesión correcto.");
      // Redirige a la homepage
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Error al iniciar sesión. Inténtalo de nuevo.");
      setSuccessMessage("");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/signin";
  };

  const handleFacebookLogin = () => {
    window.location.href = "https://www.facebook.com/login";
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white flex items-center justify-center p-2">
      <div className="flex h-full max-h-full w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        {/* Formulario */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/logoCorreos.png"
              alt="Logo Correos"
              width={150}
              height={150}
              priority
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Iniciar sesión
          </h2>

          {/* inputs */}
          <form onSubmit={handleSubmit}>
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* error */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* Success message */}
          {successMessage && (
            <p className="text-green-500 text-sm text-center mb-4">{successMessage}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <label className="flex items-center space-x-3">
              <Switch
                checked={isChecked}
                onCheckedChange={handleSwitchChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  isChecked ? "bg-pink-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isChecked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </Switch>
              <span className="text-gray-800 text-xs">Recordar cuenta</span>
            </label>

            <Link href="/recuperar-contrasena" className="text-black hover:underline text-xs">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={authLoading}//no permite doble click
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
          >
            {authLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

          {/* diSvisor más compacto */}
          <div className="w-full flex items-center my-2 sm:my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* botttones sociales más compactos */}
          <div className="space-y-2 mb-3">
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-blue-50 transition duration-200"
            >
              <Image src="/facebook-icon.png" alt="Facebook" width={24} height={24} />
              <span className="ml-3 text-base text-gray-800 font-medium">
                Ingresar con Facebook
              </span>
            </button>
            
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-red-50 transition duration-200"
            >
              <Image src="/google-icon.png" alt="Google" width={24} height={24} />
              <span className="ml-3 text-base text-gray-800 font-medium">
                Ingresar con Google
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-pink-600 hover:underline">
              Registrate
            </Link>
          </p>
        </div>

        {/* Carrusel */}
        <CarruselLogin />
      </div>
    </div>
  );
};

export default Login;
