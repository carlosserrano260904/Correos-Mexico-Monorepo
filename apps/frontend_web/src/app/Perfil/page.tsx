"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { usuarioPorId, actualizarUsuarioPorId, uploadAvatar } from "@/services/profileService";
import { Plantilla } from "@/components/plantilla";

export default function Perfil() {
    // LÓGICA DE BACKEND Y AUTENTICACIÓN
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    // --- ESTADOS DE DATOS REALES (Inicializados a vacíos, se llenan en cargarPerfil) ---
    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");
    const [foto, setFoto] = useState("https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg");
    // Campo de solo lectura, simulamos que viene del backend
    const [metodoPago] = useState("Tarjeta Visa terminada en 3421"); 

    // --- ESTADOS DE EDICIÓN Y CARGA ---
    const [editando, setEditando] = useState(false);
    const [nuevoNombre, setTempNombre] = useState("");
    const [nuevoApellidos, setTempApellidos] = useState("");
    const [nuevoCorreo, setTempCorreo] = useState("");
    const [nuevoCelular, setTempCelular] = useState("");
    
    // Para la subida de archivos
    const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    // --- EFECTOS Y CARGA INICIAL ---
    useEffect(() => {
        if (user?.id) {
            cargarPerfil();
        }
    }, [user]);

    // Redirección si no está autenticado (ajustado para Next.js)
    useEffect(() => {
        if (isAuthenticated === false && user === null) {
            router.push("/login");
        }
    }, [isAuthenticated, user, router]);

    const cargarPerfil = async () => {
        if (!user?.id) return;
        
        try {
            setCargando(true);
            // Simulación: Llamada al servicio real de backend
            const perfilData = await usuarioPorId(user.id);
            
            // Mapear datos del backend a los estados
            const userNombre = perfilData.nombre || "";
            const userApellido = perfilData.apellido || "";
            const userCorreo = perfilData.email || perfilData.correo || user.email || "";
            const userCelular = perfilData.numero || perfilData.celular || "";
            const userFoto = perfilData.imagen || perfilData.avatar || foto;

            setNombre(userNombre);
            setApellidos(userApellido);
            setCorreo(userCorreo);
            setCelular(userCelular);
            setFoto(userFoto);

            // Inicializar estados de edición
            setTempNombre(userNombre);
            setTempApellidos(userApellido);
            setTempCorreo(userCorreo);
            setTempCelular(userCelular);

        } catch (err) {
            console.error("Error cargando perfil:", err);
            setError("Error al cargar el perfil");
        } finally {
            setCargando(false);
        }
    };

    // --- MANEJADORES DE NAVEGACIÓN ---
    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handlePedidos = () => { router.push("/pedidos"); };
    const handleCupones = () => { router.push("/cupones"); };
    const handlePago = () => { router.push("/pago"); };

    // --- MANEJADORES DE EDICIÓN ---
    const handleEditar = () => {
        // Cargar datos actuales a los temporales
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

            // 1. Actualizar datos del perfil
            const datosActualizados = {
                nombre: nuevoNombre,
                apellido: nuevoApellidos,
                email: nuevoCorreo,
                numero: nuevoCelular,
                // Puedes agregar más campos si tu backend los requiere
            };

            await actualizarUsuarioPorId(datosActualizados, user.id);

            // 2. Subir nueva foto si hay
            if (nuevaFoto) {
                const nuevaFotoUrl = await uploadAvatar(nuevaFoto, user.id);
                setFoto(nuevaFotoUrl);
            }

            // 3. Actualizar estados locales y terminar edición
            setNombre(nuevoNombre);
            setApellidos(nuevoApellidos);
            setCorreo(nuevoCorreo);
            setCelular(nuevoCelular);
            
            if (fotoPreview) {
                setFoto(fotoPreview); // Actualiza la foto con la preview si se subió
            }

            setEditando(false);
            setNuevaFoto(null);
            setFotoPreview(null);
            
            // Recargar datos para asegurar consistencia
            await cargarPerfil();

        } catch (err) {
            console.error("Error guardando perfil:", err);
            // Intenta extraer el mensaje de error si es posible
            setError(err instanceof Error ? err.message : "Error al guardar los cambios");
        } finally {
            setGuardando(false);
        }
    };

    // --- MANEJO DE FOTO (DRAG & DROP) ---
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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (editando && e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
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

    // --- RENDERIZADO CONDICIONAL DE CARGA/AUTENTICACIÓN ---
    if (cargando) {
        return (
            <Plantilla>
                <div className="max-w-4xl mx-auto p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            {/* Ícono de carga estilizado */}
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE1484] mx-auto"></div>
                            <p className="mt-4 text-gray-600">Cargando perfil...</p>
                        </div>
                    </div>
                </div>
            </Plantilla>
        );
    }

    if (!isAuthenticated) {
        return (
            <Plantilla>
                <div className="max-w-4xl mx-auto p-8">
                    <div className="text-center">
                        <p className="text-red-500">Acceso denegado. Redirigiendo...</p>
                    </div>
                </div>
            </Plantilla>
        );
    }
    
    // --- RENDERIZADO DEL PERFIL CON DISEÑO AVANZADO ---
    return (
        <Plantilla>
            <div className="min-h-screen flex flex-col items-center justify-start px-8 py-12">
                
                <div className="max-w-4xl w-full mx-auto p-8 px-8 py-8 bg-white rounded-xl shadow-lg">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    {/* BLOQUE SUPERIOR: Foto, Nombre, Correo y BOTÓN EDITAR */}
                    <div className="flex items-center mb-12 border-b pb-8"> 
                        <div 
                            className={`relative mr-6 ${dragActive ? "ring-4 ring-pink-400" : ""} ${editando ? "cursor-pointer" : ""}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragLeave={handleDragLeave}
                        >
                            <img
                                src={fotoPreview || foto}
                                alt="Foto de perfil"
                                className="w-24 h-24 rounded-full object-cover shadow-md"
                            />
                            {editando && (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleEditarFoto}
                                        onClick={e => (e.currentTarget.value = "")}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition duration-300">
                                        <FiEdit2 className="w-6 h-6 text-white" />
                                    </div>
                                </>
                            )}
                            {dragActive && editando && (
                                <div className="absolute inset-0 bg-pink-200 bg-opacity-70 flex items-center justify-center rounded-full pointer-events-none">
                                    <span className="text-pink-700 font-semibold text-sm text-center px-2">
                                        Suelta aquí
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Contenedor de Nombre, Correo y Botón Editar/Guardar */}
                        <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                {/* Nombre y Apellido */}
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    {nombre} {apellidos}
                                </h2> 
                                {/* Correo Electrónico como texto de contacto */}
                                <p className="text-gray-600">{correo}</p> 
                            </div>

                            {/* Botón Editar (Visible en modo NO edición) */}
                            {!editando && (
                                <button
                                    className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition text-md font-semibold flex items-center gap-2 shadow-md"
                                    onClick={handleEditar}
                                >
                                    Editar
                                    <FiEdit2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* BLOQUE DE DATOS PERSONALES */}
                    <div className="w-full py-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-700">Datos personales</h3>
                            
                            {/* BOTONES GUARDAR/CANCELAR (Solo visibles en modo Edición) */}
                            {editando && ( 
                                <div className="flex items-center gap-2">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
                                        onClick={handleCancelar}
                                        disabled={guardando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-50"
                                        onClick={handleGuardar}
                                        disabled={guardando}
                                    >
                                        {guardando ? "Guardando..." : "Guardar"}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Grid de 2 columnas para campos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            
                            {/* Nombre */}
                            <CampoPerfil
                                label="Nombre"
                                value={editando ? nuevoNombre : nombre}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempNombre(e.target.value)}
                                readOnly={!editando}
                                type="text"
                            />
                            {/* Apellidos */}
                            <CampoPerfil
                                label="Apellidos"
                                value={editando ? nuevoApellidos : apellidos}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempApellidos(e.target.value)}
                                readOnly={!editando}
                                type="text"
                            />
                            {/* Correo Electrónico */}
                            <CampoPerfil
                                label="Correo Electrónico"
                                value={editando ? nuevoCorreo : correo}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempCorreo(e.target.value)}
                                readOnly={!editando}
                                type="email"
                            />
                            {/* Celular */}
                            <CampoPerfil
                                label="Celular"
                                value={editando ? nuevoCelular : celular}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempCelular(e.target.value)}
                                readOnly={!editando}
                                type="tel"
                            />
                            
                            {/* Método de Pago (Solo lectura) */}
                            <CampoPerfil
                                label="Método de pago"
                                value={metodoPago}
                                readOnly={true}
                                type="text"
                                isReadOnlyStyle={true} onChange={undefined}                            />
                            
                            {/* Espacio para Dirección/Otros campos si los tienes */}
                        </div>
                    </div>
                    
                    {/* TÍTULO DE ADMINISTRACIÓN */}
                    <h1 className="text-xl font-bold mt-12 mb-6 text-center text-gray-800">Administrar</h1>

                    {/* BLOQUE DE BOTONES DE NAVEGACIÓN */}
                    <div className="w-full flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                            {/* Botón Pedidos */}
                            <BotonNavegacion onClick={handlePedidos}>Pedidos</BotonNavegacion>
                            {/* Botón Cupones */}
                            <BotonNavegacion onClick={handleCupones}>Cupones</BotonNavegacion>
                            {/* Botón Pago */}
                            <BotonNavegacion onClick={handlePago}>Pago</BotonNavegacion>
                        </div>
                    </div>

                    {/* Botón Cerrar sesión */}
                    <div className="text-center mt-12">
                        <button 
                            className="bg-white text-gray-700 py-2 px-8 rounded border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    </div>

                </div> {/* Fin max-w-4xl */}
            </div>
        </Plantilla>
    );
}

// Componente helper para simplificar el JSX de los campos de input
type CampoPerfilProps = {
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    type?: string;
    isReadOnlyStyle?: boolean;
};

const CampoPerfil: React.FC<CampoPerfilProps> = ({ label, value, onChange, readOnly, type = "text", isReadOnlyStyle = false }) => (
    <div className="space-y-1">
        <label className="text-sm text-gray-600">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className={`w-full border rounded-lg p-3 transition ${readOnly || isReadOnlyStyle ? "bg-gray-50 text-gray-700 border-gray-200 cursor-default" : "bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500"}`}
        />
    </div>
);

// Componente helper para simplificar el JSX de los botones de navegación
type BotonNavegacionProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

const BotonNavegacion: React.FC<BotonNavegacionProps> = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="bg-pink-600 hover:bg-pink-700 text-white py-12 px-6 rounded-xl text-lg font-semibold transition transform hover:scale-[1.03] shadow-lg"
    >
        {children}
    </button>
);