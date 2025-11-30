// apps/frontend_web/src/app/Perfil/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

interface PerfilForm {
  nombre: string;
  apellidos: string;
  correo: string;
  celular: string;
  rfc: string;
  foto: string;
}

// Servicios mock - reemplaza con tus servicios reales
const usuarioPorId = async (userId: string): Promise<any> => {
  try {
    // Reemplaza con tu endpoint real
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error("Error al cargar usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en usuarioPorId:", error);
    // Datos de ejemplo como fallback
    return {
      nombre: "",
      apellido: "",
      apellido_paterno: "",
      email: "",
      correo: "",
      numero: "",
      celular: "",
      rfc: "",
      imagen: "",
      avatar: ""
    };
  }
};

const actualizarUsuarioPorId = async (userId: string, datos: any): Promise<any> => {
  try {
    // Reemplaza con tu endpoint real
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (!response.ok) throw new Error("Error al actualizar usuario");
    return await response.json();
  } catch (error) {
    console.error("Error en actualizarUsuarioPorId:", error);
    throw error;
  }
};

export default function Perfil() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const { openSignIn } = useClerk();

  const [form, setForm] = useState<PerfilForm>({
    nombre: "",
    apellidos: "",
    correo: "",
    celular: "",
    rfc: "",
    foto: "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg",
  });

  const [perfilOriginal, setPerfilOriginal] = useState<PerfilForm | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (userLoaded && !user) {
      openSignIn();
      router.push("/");
    }
  }, [userLoaded, user, openSignIn, router]);

  // Cargar perfil cuando el usuario esté disponible
  useEffect(() => {
    if (user?.id) {
      cargarPerfil();
    }
  }, [user]);

  const cargarPerfil = async () => {
    if (!user?.id) return;
    
    try {
      setCargando(true);
      setError("");
      
      const perfilData = await usuarioPorId(user.id);

      // Mapear datos del backend al formulario
      const datos: PerfilForm = {
        nombre: perfilData.nombre || user.firstName || "",
        apellidos: perfilData.apellido || perfilData.apellido_paterno || user.lastName || "",
        correo: perfilData.email || perfilData.correo || user.primaryEmailAddress?.emailAddress || "",
        celular: perfilData.numero || perfilData.celular || user.primaryPhoneNumber?.phoneNumber || "",
        rfc: perfilData.rfc || "",
        foto: perfilData.imagen || perfilData.avatar || user.imageUrl || form.foto,
      };

      setForm(datos);
      setPerfilOriginal(datos);
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setError("Error al cargar el perfil. Mostrando datos básicos.");
      
      // Datos de fallback desde Clerk
      const fallbackData: PerfilForm = {
        nombre: user.firstName || "",
        apellidos: user.lastName || "",
        correo: user.primaryEmailAddress?.emailAddress || "",
        celular: user.primaryPhoneNumber?.phoneNumber || "",
        rfc: "",
        foto: user.imageUrl || form.foto,
      };
      
      setForm(fallbackData);
      setPerfilOriginal(fallbackData);
    } finally {
      setCargando(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleEditar = () => {
    setIsEditing(true);
    setMensaje("");
    setError("");
  };

  const handleCancel = () => {
    if (perfilOriginal) {
      setForm(perfilOriginal);
    }
    setIsEditing(false);
    setMensaje("");
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await actualizarUsuarioPorId(user.id, {
        nombre: form.nombre,
        apellidos: form.apellidos,
        correo: form.correo,
        numero: form.celular,
        rfc: form.rfc,
        imagen: form.foto,
      });

      setPerfilOriginal(form);
      setIsEditing(false);
      setMensaje("Datos actualizados correctamente.");
    } catch (err) {
      console.error("Error guardando perfil:", err);
      setError("Ocurrió un error al guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (!userLoaded || cargando) {
    return (
      <Plantilla>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DE1484] mx-auto" />
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </Plantilla>
    );
  }

  // Si no hay usuario después de cargar, mostrar mensaje
  if (!user) {
    return (
      <Plantilla>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Redirigiendo al login...</p>
          </div>
        </div>
      </Plantilla>
    );
  }

  return (
    <Plantilla>
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Botón regresar */}
          <button
            onClick={handleBack}
            className="inline-flex items-center px-5 py-2 mb-6 rounded-full bg-[#DE1484] text-white text-sm font-medium shadow-sm hover:bg-[#c41373] transition"
          >
            ← Regresar
          </button>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 px-10 py-8">

            {/* Header: foto + nombre + subtítulo + botón EDITAR*/}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={form.foto}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex justify-between items-center">
                <div className="flex flex-col">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {form.nombre} {form.apellidos}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user.primaryEmailAddress?.emailAddress || "Usuario"}
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={handleEditar}
                    className="px-6 py-2 rounded-md bg-[#DE1484] text-white text-sm font-medium shadow-sm hover:bg-[#c41373] transition"
                  >
                    ✎ Editar
                  </button>
                )}
              </div>
            </div>

            {/* errores/mensaje */}
            {error && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {mensaje && (
              <div className="mt-4 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                {mensaje}
              </div>
            )}

            {/* SECCIÓN de datos personales */}
            <div className="mt-6">
              <div className="mb-6 text-base font-semibold text-gray-900">
                Datos personales
              </div>

              {/* Si está editando mostramos Cancelar / Guardar */}
              {isEditing && (
                <div className="flex gap-3 mb-6 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={guardando}
                    className="px-6 py-2 rounded-md bg-[#DE1484] text-white text-sm font-medium shadow-sm hover:bg-[#c41373] disabled:opacity-70 disabled:cursor-not-allowed transition"
                  >
                    {guardando ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              )}

              {/* Grid de campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <CampoPerfil
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  isEditing={isEditing}
                />

                <CampoPerfil
                  label="Apellidos"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  isEditing={isEditing}
                />

                <CampoPerfil
                  label="Correo"
                  name="correo"
                  type="email"
                  value={form.correo}
                  onChange={handleChange}
                  isEditing={isEditing}
                />

                <CampoPerfil
                  label="Número de teléfono"
                  name="celular"
                  type="tel"
                  value={form.celular}
                  onChange={handleChange}
                  isEditing={isEditing}
                />

                <CampoPerfil
                  label="RFC"
                  name="rfc"
                  value={form.rfc}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </Plantilla>
  );
}

/* ——— COMPONENTES AUXILIARES ——— */

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
}) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500 mb-1">{label}</span>

    {!isEditing ? (
      <span className="text-sm text-gray-900">{value || "—"}</span>
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#DE1484] focus:border-[#DE1484] outline-none transition"
      />
    )}
  </div>
);