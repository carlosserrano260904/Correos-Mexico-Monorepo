"use client"

import React, { useState, useEffect } from "react"
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { usuarioPorId, actualizarUsuarioPorId, uploadAvatar } from "@/services/profileService";

export default function Perfil() {
    const { user, logout, isAuthenticated } = useAuth();
    const { updateProfile, updateAvatar } = useProfile();
    const router = useRouter();

    // Estados para los datos del perfil
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");
    const [foto, setFoto] = useState("https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg");

    // Estados para edición
    const [editando, setEditando] = useState(false);
    const [nuevoNombre, setTempNombre] = useState("");
    const [nuevoApellidos, setTempApellidos] = useState("");
    const [nuevoCorreo, setTempCorreo] = useState("");
    const [nuevoCelular, setTempCelular] = useState("");
    const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // Cargar datos del perfil al montar el componente
    useEffect(() => {
        if (user?.id) {
            cargarPerfil();
        }
    }, [user]);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!isAuthenticated && !user) {
            router.push("/login");
        }
    }, [isAuthenticated, user, router]);

    const cargarPerfil = async () => {
        if (!user?.id) return;
        
        try {
            setCargando(true);
            const perfilData = await usuarioPorId(user.id);
            
            // Mapear datos del backend a los estados
            setNombre(perfilData.nombre || "");
            setApellidos(perfilData.apellido || "");
            setCorreo(perfilData.email || perfilData.correo || user.email || "");
            setCelular(perfilData.numero || perfilData.celular || "");
            setFoto(perfilData.imagen || perfilData.avatar || "https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg");

            // Inicializar estados de edición
            setTempNombre(perfilData.nombre || "");
            setTempApellidos(perfilData.apellido || "");
            setTempCorreo(perfilData.email || perfilData.correo || user.email || "");
            setTempCelular(perfilData.numero || perfilData.celular || "");

        } catch (err) {
            console.error("Error cargando perfil:", err);
            setError("Error al cargar el perfil");
        } finally {
            setCargando(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleEditar = () => {
        setTempNombre(nombre);
        setTempApellidos(apellidos);
        setTempCorreo(correo);
        setTempCelular(celular);
        setNuevaFoto(null);
        setFotoPreview(null);
        setEditando(true);
        setError("");
    };

    const handleCancelar = () => {
        setEditando(false);
        setNuevaFoto(null);
        setFotoPreview(null);
        setError("");
    };

    const handleGuardar = async () => {
        if (!user?.id) return;

        try {
            setGuardando(true);
            setError("");

            // Actualizar datos del perfil
            const datosActualizados = {
                nombre: nuevoNombre,
                apellido: nuevoApellidos,
                email: nuevoCorreo,
                numero: nuevoCelular,
                // Mantener otros campos requeridos por tu backend
                estado: "",
                ciudad: "",
                fraccionamiento: "",
                calle: "",
                codigoPostal: "",
            };

            await actualizarUsuarioPorId(datosActualizados, user.id);

            // Subir nueva foto si hay
            if (nuevaFoto) {
                const nuevaFotoUrl = await uploadAvatar(nuevaFoto, user.id);
                setFoto(nuevaFotoUrl);
            }

            // Actualizar estados locales
            setNombre(nuevoNombre);
            setApellidos(nuevoApellidos);
            setCorreo(nuevoCorreo);
            setCelular(nuevoCelular);
            
            if (fotoPreview) {
                setFoto(fotoPreview);
            }

            setEditando(false);
            setNuevaFoto(null);
            setFotoPreview(null);

            // Recargar datos del usuario en el contexto de autenticación
            if (user.id) {
                await cargarPerfil();
            }

        } catch (err) {
            console.error("Error guardando perfil:", err);
            setError(err instanceof Error ? err.message : "Error al guardar los cambios");
        } finally {
            setGuardando(false);
        }
    };

    // Manejo de foto de perfil
    const handleEditarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNuevaFoto(file);
            
            // Crear preview
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (ev.target && typeof ev.target.result === "string") {
                    setFotoPreview(ev.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const [dragActive, setDragActive] = useState(false);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (editando && e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                setNuevaFoto(file);
                const reader = new FileReader();
                reader.onload = function(ev) {
                    if (ev.target && typeof ev.target.result === "string") {
                        setFotoPreview(ev.target.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (editando) {
            e.preventDefault();
            setDragActive(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (editando) {
            e.preventDefault();
            setDragActive(false);
        }
    };

    if (cargando) {
        return (
            <Plantilla>
                <div className="max-w-4xl mx-auto p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE1484] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando perfil...</p>
                        </div>
                    </div>
                </div>
            </Plantilla>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Plantilla>
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <p className="text-red-500">No estás autenticado</p>
                        <button 
                            onClick={() => router.push("/login")}
                            className="mt-4 bg-[#DE1484] text-white px-4 py-2 rounded"
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </Plantilla>
        );
    }

    return (
        <Plantilla>
            <div className="max-w-4xl mx-auto p-8 px-8 py-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex items-center mb-8">
                    <div 
                        className={`relative ${dragActive ? "ring-4 ring-blue-400" : ""} ${editando ? "cursor-pointer" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                    >
                        <img
                            src={fotoPreview || foto}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full mr-4 object-cover"
                        />
                        {editando && (
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleEditarFoto}
                                onClick={e => (e.currentTarget.value = "")}
                            />
                        )}
                        {dragActive && editando && (
                            <div className="absolute inset-0 bg-blue-200 bg-opacity-40 flex items-center justify-center rounded-full pointer-events-none">
                                <span className="text-blue-700 font-semibold text-sm text-center px-2">
                                    Suelta la imagen aquí
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-medium">
                                {nombre || user.name} {apellidos}
                            </h2> 
                            <p className="text-gray-600">{correo || user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full border-t-2 border-b-2 border-gray-200 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Datos personales</h3>
                        {editando ? (
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
                                    onClick={handleCancelar}
                                    disabled={guardando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
                                    onClick={handleGuardar}
                                    disabled={guardando}
                                >
                                    {guardando ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition text-md font-inter flex items-center gap-2"
                                onClick={handleEditar}
                            >
                                Editar
                                <FiEdit2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="text-sm text-gray-600">Nombre</label>
                            <input
                                type="text"
                                value={editando ? nuevoNombre : nombre}
                                onChange={(e) => setTempNombre(e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? "bg-gray-50" : "bg-white"}`}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Apellidos</label>
                            <input
                                type="text"
                                value={editando ? nuevoApellidos : apellidos}
                                onChange={(e) => setTempApellidos(e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? "bg-gray-50" : "bg-white"}`}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Correo Electrónico</label>
                            <input
                                type="email"
                                value={editando ? nuevoCorreo : correo}
                                onChange={(e) => setTempCorreo(e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? "bg-gray-50" : "bg-white"}`}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Celular</label>
                            <input
                                type="text"
                                value={editando ? nuevoCelular : celular}
                                onChange={(e) => setTempCelular(e.target.value)}
                                readOnly={!editando}
                                className={`w-full border rounded p-2 ${!editando ? "bg-gray-50" : "bg-white"}`}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <button 
                        className="bg-white text-gray-700 py-2 px-8 rounded border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </Plantilla>
    );
}