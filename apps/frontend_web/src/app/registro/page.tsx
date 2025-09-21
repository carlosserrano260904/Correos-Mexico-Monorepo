"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaEnvelope, FaLock, FaUser, FaArrowLeft } from "react-icons/fa";
import { Switch } from "@radix-ui/react-switch";
import CarruselLogin from "@/components/CarruselLogin";

const Registro = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleSwitchChange = () => setIsChecked(!isChecked);

  const handleGoogleLogin = () => {
    window.location.href = "https://accounts.google.com/signin";
  };

  const handleFacebookLogin = () => {
    window.location.href = "https://www.facebook.com/login";
  };

  const validarFormulario = () => {
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setError("Todos los campos son obligatorios.");
      setSuccessMessage(""); 
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("El correo electrónico no es válido.");
      setSuccessMessage(""); 
    }

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      setSuccessMessage(""); 
      return false;
    }

    setError(""); 
    return true;
  };

  const handleRegistro = () => {
    if (validarFormulario()) {
      console.log("Cuenta creada exitosamente:", { nombre, correo, contrasena });

      setSuccessMessage("¡Cuenta creada exitosamente!"); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        {/* formulario */}
        <div className="w-full md:w-1/2 px-3 sm:px-6 py-3 flex flex-col justify-center min-h-0">
          {/* Logo  */}
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

          {/* Campo de Nombre */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full outline-none bg-transparent"
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
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Campo de Confirmar Contraseña */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

          {/* Mensaje de éxito */}
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
              <span className="text-gray-800 text-xs">Recordar cuenta</span>
            </label>
          </div>

          {/* boton de registro */}
          <button
            onClick={handleRegistro}
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
          >
            Crear cuenta
          </button>

          {/* divisor */}
          <div className="w-full flex items-center my-2 sm:my-3">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-400 text-xs">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* ingreso con redes  con redes */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleFacebookLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-blue-50 transition duration-200"
            >
              <Image src="/facebook-icon.png" alt="Facebook" width={16} height={16} className="sm:w-5 sm:h-5" />
              <span className="ml-2 text-xs sm:text-sm text-gray-800 font-medium">
                Registrarse con Facebook
              </span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-1.5 sm:py-2 px-3 hover:bg-red-50 transition duration-200"
            >
              <Image src="/google-icon.png" alt="Google" width={16} height={16} className="sm:w-5 sm:h-5" />
              <span className="ml-2 text-xs sm:text-sm text-gray-800 font-medium">
                Registrarse con Google
              </span>
            </button>
          </div>

          {/* Link inferior */}
          <p className="text-center text-xs text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-pink-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* Carrusel */}
        <CarruselLogin />
      </div>
    </div>
  );
};

export default Registro;
