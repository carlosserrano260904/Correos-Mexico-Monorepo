"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";

// UsuariosPage - versión standalone que replica el diseño proporcionado.
// Usa TailwindCSS. Pega este archivo en una página de Next.js (por ejemplo: app/usuarios/page.jsx)

const MOCK_USERS = Array.from({ length: 10 }).map((_, i) => ({
  id: String(288 + i).padStart(3, "0"),
  nombre: "Juan Pérez",
  email: `email.juan.perez${i}@gmail.com`,
  rol: i % 4 === 0 ? "Comprador" : i % 4 === 1 ? "Vendedor" : i % 4 === 2 ? "Administrador" : "Comprador",
  estado: i % 3 === 0 ? "Activa" : "Cerrada",
  fechaUnion: "21/10/2025",
}));

export default function UsuariosPage() {
  const [q, setQ] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const usuariosFiltrados = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchesQ =
        !q ||
        u.nombre.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        u.id.includes(q);
      const matchesRol = !filterRol || u.rol === filterRol;
      const matchesEstado = !filterEstado || u.estado === filterEstado;
      return matchesQ && matchesRol && matchesEstado;
    });
  }, [q, filterRol, filterEstado]);

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Header minimalista */}
      <header className="w-full bg-[#f8f9fb] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src={'/mnt/data/d438d76a-556e-425e-8f87-34b08da37ac4.png'}
                alt="logo"
                width={34}
                height={34}
                className="rounded-full"
              />
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <a className="text-pink-600 px-3 py-1 rounded-full bg-pink-100">Inicio</a>
              <a className="text-pink-600 px-3 py-1 rounded-full bg-pink-100">Usuarios</a>
              <a className="text-gray-500">Cupones</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400">🔔</button>
            <Image
              src={'/mnt/data/d438d76a-556e-425e-8f87-34b08da37ac4.png'}
              alt="avatar"
              width={38}
              height={38}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-2">Usuarios de la aplicación</h1>
        <p className="text-sm text-gray-500 mb-6">Administra aquí a los usuarios que forman parte del sistema.</p>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between mb-4">
          <div className="flex items-center gap-3 w-full md:w-2/3">
            <div className="relative w-full">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nombre, email o ID"
                className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-200 bg-white text-sm"
              />
            </div>

            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Filtrar por rol</option>
              <option>Comprador</option>
              <option>Vendedor</option>
              <option>Administrador</option>
            </select>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Filtrar por estado de la cuenta</option>
              <option>Activa</option>
              <option>Cerrada</option>
            </select>
          </div>

          <div className="w-full md:w-auto flex justify-end">
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm">Crear un administrador</button>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500">ID del usuario</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500">Nombre completo</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500">Rol</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500">Estado de la cuenta</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500">Fecha de unión</th>
                <th className="px-4 py-3 text-right text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.id}</td>
                  <td className="px-4 py-3">{u.nombre}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <RolBadge rol={u.rol} />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={u.estado} />
                  </td>
                  <td className="px-4 py-3">{u.fechaUnion}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button className="px-3 py-1 border border-gray-200 rounded-full text-sm">Suspender</button>
                      <button className="px-3 py-1 border border-gray-200 rounded-full text-sm">Ver detalles</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function RolBadge({ rol }: { rol: string }) {
  const map: any = {
    Comprador: "bg-blue-100 text-blue-700",
    Vendedor: "bg-pink-100 text-pink-700",
    Administrador: "bg-yellow-100 text-yellow-700",
  };
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[rol] || "bg-gray-100 text-gray-700"}`}>{rol}</span>;
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${estado === "Activa" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {estado}
    </span>
  );
}
