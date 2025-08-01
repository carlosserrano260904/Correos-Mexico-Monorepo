'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSucursalStore } from "@/stores/sucursalStore";
import { useState } from "react";


export default function CrearSucursalPage() {


  const {agregarSucursal} = useSucursalStore();
  const router = useRouter();
  const [form, setForm] = useState({
    nombreEntidad: "",
    domicilio: "",
    municipio: "",
    claveOficinaPostal: "",
    claveCOU: "",
    claveInmueble: "",
    claveInegi: "",
    codigoPostal: "",
    telefono: "",
    latitud: "",
    longitud: "",
    nombreCUO: "",
    tipoCUO: "",
    activo: ""
  });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    agregarSucursal(form);
    router.push("/Administrador/app/Sucursales"); // Redirige después de crear
  };


  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Crear Nueva Sucursal</h1>
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-200"></div>

          {/* Formulario */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Nombre Entidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Entidad
                  </label>
                  <input
                    name="nombreEntidad"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.nombreEntidad}
                    onChange={handleChange}
                  />
                </div>

                {/* Domicilio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domicilio
                  </label>
                  <textarea
                    name="domicilio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    placeholder=""
                    value={form.domicilio}
                    onChange={handleChange}
                  />
                </div>

                {/* Municipio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Municipio
                  </label>
                  <input
                    name="municipio"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.municipio}
                    onChange={handleChange}
                  />
                </div>

                {/* Clave Oficina Postal y Clave COU en una fila */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave Oficina Postal
                    </label>
                    <input
                      name="claveOficinaPostal"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.claveOficinaPostal}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave COU
                    </label>
                    <input
                      name="claveCOU"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.claveCOU}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Clave Inmueble y Clave Inegi en una fila */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave Inmueble
                    </label>
                    <input
                      name="claveInmueble"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.claveInmueble}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave Inegi
                    </label>
                    <input
                      name="claveInegi"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.claveInegi}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Código Postal y Teléfono en una fila */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      name="codigoPostal"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.codigoPostal}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      name="telefono"
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.telefono}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Latitud y Longitud en una fila */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitud
                    </label>
                    <input
                      name="latitud"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.latitud}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud
                    </label>
                    <input
                      name="longitud"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.longitud}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Nombre CUO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre CUO
                  </label>
                  <input
                    name="nombreCUO"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.nombreCUO}
                    onChange={handleChange}
                  />
                </div>

                {/* Tipo CUO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo CUO
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     name="tipoCUO"
                     value={form.tipoCUO}
                     onChange={handleChange}
                    >
                      <option value="">Tipo</option>
                      <option value="Administrativa">Administrativa</option>
                      <option value="Ventanilla">Ventanilla</option>
                      <option value="Coordinacion">Coordinación</option>
                    </select>
                    <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Activo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activo
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="activo"
                    value={form.activo}
                    onChange={handleChange}
                    >
                      <option value="">Active</option>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                    <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Botón */}
                <div className="pt-3 pb-26">
                  <Button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-sm font-medium"
                  >
                    Crear Sucursal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Plantilla>
    </div>
  )
}
