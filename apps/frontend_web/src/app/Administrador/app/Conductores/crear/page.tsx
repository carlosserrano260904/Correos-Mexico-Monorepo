'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline } from "react-icons/io5";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useConductorStore } from "@/stores/conductorStore";


export default function CrearConductorPage() {
  const {agregarConductor} = useConductorStore()
  const router = useRouter()

  const [form, setForm] = useState({
    idConductor: "",
    nombre: "",
    curp: "",
    rfc: "",
    licencia: "",
    telefono: "",
    email: "",
    claveOficina:"",
    licenciaVigente: ""
  })

  
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    agregarConductor(form)
    router.push("/Administrador/app/Conductores")
  }

  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Crear Nuevo Conductor</h1>
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-200"></div>

          {/* Formulario */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  name="nombre"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder=""
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              {/* CURP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CURP
                </label>
                <input
                  name="curp"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder=""
                  value={form.curp}
                  onChange={handleChange}
                />
              </div>

              {/* RFC y Licencia en una fila */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC
                  </label>
                  <input
                    name="rfc"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.rfc}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Licencia
                  </label>
                  <input
                    name="licencia"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.licencia}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Teléfono */}
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

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder=""
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {/* Clave Oficina */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clave Oficina
                </label>
                <input
                  name="claveOficina"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder=""
                  value={form.claveOficina}
                  onChange={handleChange}
                />
              </div>

              {/* Licencia Vigente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Licencia Vigente
                </label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="licenciaVigente"
                  value={form.licenciaVigente}
                  onChange={handleChange}
                  >
                    <option value="">Estado</option>
                    <option value="vigente">Vigente</option>
                    <option value="vencida">Vencida</option>
                    <option value="suspendida">Suspendida</option>
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
                  Crear conductor
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
