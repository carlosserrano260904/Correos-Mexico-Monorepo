"use client";

import React, { useState, useEffect } from "react";
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import BotonRegresar from "@/components/BotonRegresar";


interface PerfilForm {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  foto: string;
}

interface DatosAdicionales {
  tarjetas: string;
}

// Estilos de la foto/icono para el diseño
const getInitials = (nombre: string, apellidos: string) => {
  const firstInitial = nombre ? nombre.charAt(0) : "";
  const lastInitial = apellidos ? apellidos.charAt(0) : "";
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default function Perfil() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const [form, setForm] = useState<PerfilForm>({
    nombre: "",
    apellidos: "",
    correo: "",
    celular: "",
    foto: "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg",
  });

  const [datosAdicionales] = useState<DatosAdicionales>({
    tarjetas: "----",
  });

  const [perfilOriginal, setPerfilOriginal] = useState<PerfilForm | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Redirección
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !user) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Carga de datos
  useEffect(() => {
    if (!isLoaded || !user) return;

    // NOTA: Usamos user.imageUrl directamente si existe, si no, el default.
    const fotoUrl = user.imageUrl || "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg";

    const nombre = user.firstName || user.fullName?.split(" ")[0] || "";
    const apellidos = user.lastName || user.fullName?.split(" ").slice(1).join(" ") || "";
    const correo = user.primaryEmailAddress?.emailAddress || "";
    const celular = user.primaryPhoneNumber?.phoneNumber || "";

    const datos: PerfilForm = {
      nombre,
      apellidos,
      correo,
      celular,
      foto: fotoUrl,
    };

    setForm(datos);
    setPerfilOriginal(datos);
    setCargando(false);
  }, [isLoaded, user]); 

  const handleBack = () => {
    router.back();
  };

  const handleEditar = () => {
    setIsEditing(true);
    setMensaje("");
    setError("");
  };

  const handleCancel = () => {
    if (perfilOriginal) setForm(perfilOriginal);
    setIsEditing(false);
    setMensaje("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Si manejas la edición de tarjetas, necesitarías una lógica para ellas
    // if (name === 'tarjetas') { setDatosAdicionales... } else { setForm... }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      console.log("Datos a guardar:", { ...form, ...datosAdicionales });
      // TODO: Implementar lógica de guardado real

      setPerfilOriginal(form);
      // No restauramos el estado de edición de tarjetas, ya que es simulado
      setIsEditing(false);
      setMensaje("Datos actualizados (en pantalla).");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError("Ocurrió un error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  if (!isLoaded || cargando) {
    return (
      <Plantilla sinHeader>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DE1484] mx-auto" />
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </Plantilla>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <Plantilla sinHeader>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </Plantilla>
    );
  }

  const nombreCompleto = `${form.nombre} ${form.apellidos}`.trim();

  return (
    <Plantilla> 
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <section className="bg-white rounded-xl shadow-none p-0 w-full">

            <BotonRegresar />
            
            {/* Header */}
            <div className="flex items-start gap-6 pb-6 border-b border-gray-100">
              <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                {form.foto && form.foto !== "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg" ? (
                  <img src={form.foto} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl font-bold">
                    <span>{getInitials(form.nombre, form.apellidos)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center h-28">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                  {nombreCompleto || "Usuario Desconocido"}
                </h1>
              </div>
            </div>

            {/* Datos Personales */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold text-gray-900">Datos personales</div>
                {isEditing ? (
                  <div className="flex gap-3">
                    <button onClick={handleCancel} className="px-5 py-2 rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                    <button onClick={handleSave} disabled={guardando} className="px-6 py-2 rounded-md bg-[#DE1484] text-white text-sm font-medium shadow-sm hover:bg-[#c41373] disabled:opacity-70 disabled:cursor-not-allowed transition">
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                ) : (
                  <button onClick={handleEditar} className="px-8 py-3 rounded-md bg-[#DE1484] text-white text-base font-medium shadow-lg hover:bg-[#c41373] transition">
                    Editar <span className="ml-1 text-lg">✎</span>
                  </button>
                )}
              </div>

              {(error || mensaje) && (
                <div className={`mb-4 rounded-md border px-4 py-2 text-sm ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                  {error || mensaje}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-6 mt-8">
                <CampoPerfil label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} isEditing={isEditing} />
                <CampoPerfil label="Apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} isEditing={isEditing} />
                <CampoPerfil label="Correo" name="correo" type="email" value={form.correo} onChange={handleChange} isEditing={isEditing} />
                <CampoPerfil label="Tarjeta" name="tarjetas" value={datosAdicionales.tarjetas} onChange={handleChange} isEditing={false} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </Plantilla>
  );
}

/* ——— COMPONENTE AUXILIAR ——— */

type CampoPerfilProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  type?: string;
};

const CampoPerfil: React.FC<CampoPerfilProps> = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
}) => {
  // Formato para teléfono
  const formattedValue = name === 'celular' && value && !isEditing 
    ? value.replace(/(\+\d{2})(\d{4})(\d{6})/, "$1 XXXX XX XX XX")
    : value;
  
  // Lógica simplificada: siempre mostramos 'value' para tarjetas a menos que quieras enmascararlo
  let displayValue = value;
  if (name === 'celular') {
      displayValue = formattedValue;
  }

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500 mb-1">{label}</span>
      {!isEditing ? (
        <span className="text-lg font-semibold text-gray-900 h-10 flex items-center">
          {displayValue.trim() || "—"} 
        </span>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-lg text-gray-900 focus:ring-1 focus:ring-offset-0 focus:ring-[#DE1484] focus:border-[#DE1484] outline-none transition h-10"
          placeholder={`Ingresa tu ${label.toLowerCase()}`}
          disabled={name === 'tarjetas'} 
        />
      )}
    </div>
  );
};