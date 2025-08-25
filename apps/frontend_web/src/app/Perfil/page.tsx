"use client"

import React, { useState } from "react"
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { FiEdit2 } from "react-icons/fi";

export default function perfil(){
    const [nombre, setNombre] = useState("Mayela");
    const [apellidos, setApellidos] = useState("Díaz");
    const [correo, setCorreo] = useState("Mayela@gmail.com")
    const [celular, setCelular] = useState("6183316693");

    const [editando, setEditando] = useState(false);
    const [nuevoNombre, setTempNombre]= useState(nombre);
    const [nuevoApellidos, setTempApellidos]= useState(apellidos);
    const [nuevoCorreo, setTempCorreo]= useState(correo);
    const [nuevoCelular, setTempCelular]= useState(celular);

    // Foto de perfil
    const [foto, setFoto] = useState("https://vivolabs.es/wp-content/uploads/2022/03/perfil-mujer-vivo.png");
    const [nuevaFoto, setNuevaFoto] = useState<string | null>(null);

    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    };

    const handleEditar = () => {
        setTempNombre(nombre)
        setTempApellidos(apellidos);
        setTempCorreo(correo);
        setTempCelular(celular);
        setNuevaFoto(null); // Limpiar selección previa
        setEditando(true);
    };

    const handleCancelar = () => {
        setEditando(false);
        setNuevaFoto(null); // Descartar cambio de foto
    }

    const handleGuardar = () => {
        setNombre(nuevoNombre);
        setApellidos(nuevoApellidos);
        setCorreo(nuevoCorreo);
        setCelular(nuevoCelular);
        if (nuevaFoto) setFoto(nuevaFoto); // Guardar nueva foto si hay
        setNuevaFoto(null);
        setEditando(false);
    };

    // Foto de perfil: input y drag&drop solo en modo edición
    const handleEditarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]){
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (ev.target && typeof ev.target.result === "string") {
                    setNuevaFoto(ev.target.result);
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
                const reader = new FileReader();
                reader.onload = function(ev) {
                    if (ev.target && typeof ev.target.result === "string") {
                        setNuevaFoto(ev.target.result);
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

    return (
        <Plantilla>
            <div className="max-w-4xxl min-w-full mx-auto p-8 px-8 py-8">
                <div className="flex items-center mb-8">
                    <div className={`relative ${dragActive ? "ring-4 ring-blue-400" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragLeave={handleDragLeave}
                    >
                        <img
                            src={nuevaFoto || foto}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full mr-4"
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
                                <span className="text-blue-700 font-semibold">Suelta la imagen aquí</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-medium">{nombre} {apellidos}</h2> 
                            <p className="text-gray-600">Victoria Durango</p>
                        </div>
                    </div>
                </div>

                <div className="w-full border-t-2 border-b-2 border-gray-200 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Datos personales</h3>
                        {editando ? (
                            <div className="flex items-center gap-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                                    onClick={handleCancelar}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                                    onClick={handleGuardar}
                                >
                                    Guardar
                                </button>
                            </div>
                        ) : (
                            <button
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-1 py-1 rounded-lg border border-gray-300 transition text-md font-inter flex items-center gap-2"
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
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Apellidos</label>
                            <input
                                type="text"
                                value={editando ? nuevoApellidos : apellidos}
                                onChange={(e) => setTempApellidos(e.target.value)}
                                readOnly = {!editando}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Correo Electrónico</label>
                            <input
                                type="email"
                                value={editando ? nuevoCorreo : correo}
                                onChange={(e) => setTempCorreo(e.target.value)}
                                readOnly = {!editando}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Celular</label>
                            <input
                                type="text"
                                value={editando ? nuevoCelular : celular}
                                onChange={(e) => setTempCelular(e.target.value)}
                                readOnly = {!editando}
                                className="w-full border rounded p-2"
                            />
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12">
                    <button className="bg-white text-gray-700 py-2 w-200 rounded border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                        onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </Plantilla>
    ) 
}

