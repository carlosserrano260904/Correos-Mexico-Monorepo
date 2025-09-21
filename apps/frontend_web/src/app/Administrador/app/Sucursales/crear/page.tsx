'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSucursalStore } from "@/stores/sucursalStore";
import { useState } from "react";
import type  { Sucursal } from "@/stores/sucursalStore";


export default function CrearSucursalPage() {


  const {agregarSucursal} = useSucursalStore();
  const router = useRouter();
  const fetchSucursales = useSucursalStore((state) => state.sucursales);

  //tipado del estado inicial del formulario
  const [form, setForm] = useState<{
  clave_oficina_postal: string;
  clave_cuo: string;
  clave_inmueble: string;
  clave_inegi: string;
  clave_entidad: string;
  nombre_entidad: string;
  municipio: string;
  tipo_cuo: 
  ""
    | 'Centro Operativo Mexpost'
    | 'Centro de Distribución'
    | 'Administración Postal'
    | 'Gerencia Postal Estatal'
    | 'Oficina de Servicios Directos'
    | 'Sucursal'
    | 'Módulo de Depósitos Masivos'
    | 'Centro Operativo de Reparto'
    | 'Gerencia'
    | 'Centro de Atención al Público'
    | 'Oficina de Transbordo'
    | 'Coordinación Operativa'
    | 'Oficina Operativa'
    | 'Consol. de Ingresos y Egresos'
    | 'Coordinación Mexpost'
    | 'Puerto Maritimo'
    | 'Agencia Municipal'
    | 'Centro de Atención Integral'
    | 'Aeropuerto'
    | 'Subdirección'
    | 'Dirección'
    | 'Otros'
    | 'Módulo de Servicios'
    | 'Coordinación Administrativa'
    | 'Almacen'
    | 'Dirección General'
    | 'Tienda Filatélica'
    | 'Oficina de Cambio'
    | 'Of. Sindicato'
    | 'Centro de Depósitos Masivos';
  nombre_cuo: string;
  domicilio: string;
  codigo_postal: string;
  telefono: string;
  pais: string;
  latitud: number;
  longitud: number;
  horario_atencion: string;
  activo: string;
}>({
  clave_oficina_postal: "",
  clave_cuo: "",
  clave_inmueble: "",
  clave_inegi: "",
  clave_entidad: "",
  nombre_entidad: "",
  municipio: "",
  tipo_cuo: "",
  nombre_cuo: "",
  domicilio: "",
  codigo_postal: "",
  telefono: "",
  pais: "México",
  latitud: 0,
  longitud: 0,
  horario_atencion: "",
  activo: "true",
});

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit  = async (e: React.FormEvent) => {
    e.preventDefault();

    //validacion
    if(!form.nombre_entidad || !form.clave_oficina_postal) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  try {
    await agregarSucursal({
      clave_oficina_postal: form.clave_oficina_postal,
      clave_cuo: form.clave_cuo,
      clave_inmueble: form.clave_inmueble,
      clave_inegi: form.clave_inegi,
      clave_entidad: form.clave_entidad,
      nombre_entidad: form.nombre_entidad,
      nombre_municipio: form.municipio,
      tipo_cuo: form.tipo_cuo as Sucursal["tipo_cuo"],
      nombre_cuo: form.nombre_cuo,
      domicilio: form.domicilio,
      codigo_postal: form.codigo_postal,
      telefono: form.telefono,
      pais: form.pais,
      latitud: form.latitud ? Number(form.latitud) : 0,
      longitud: form.longitud ? Number(form.longitud) : 0,
      horario_atencion: form.horario_atencion.trim() === "" ? null : form.horario_atencion,
      activo: form.activo === "true",
    });
    router.push("/Administrador/app/Sucursales"); // Redirige después de crear
    } catch (error) {
      alert("Error al crear la sucursal. intenta de nuevo.")
    }
  };


  console.log({
  clave_oficina_postal: form.clave_oficina_postal,
  clave_cuo: form.clave_cuo,
  clave_inmueble: form.clave_inmueble,
  clave_inegi: form.clave_inegi,
  clave_entidad: form.clave_entidad,
  nombre_entidad: form.nombre_entidad,
  nombre_municipio: form.municipio,
  tipo_cuo: form.tipo_cuo,
  nombre_cuo: form.nombre_cuo,
  domicilio: form.domicilio,
  codigo_postal: form.codigo_postal,
  telefono: form.telefono,
  pais: form.pais,
  latitud: form.latitud ? String(form.latitud) : "0",
  longitud: form.longitud ? String(form.longitud) : "0",
  horario_atencion: form.horario_atencion,
  activo: form.activo === "true",
});

  
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
                    name="nombre_entidad"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.nombre_entidad}
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
                      name="clave_oficina_postal"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.clave_oficina_postal}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave COU
                    </label>
                    <input
                      name="clave_cuo"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.clave_cuo}
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
                      name="clave_inmueble"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.clave_inmueble}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clave Inegi
                    </label>
                    <input
                      name="clave_inegi"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.clave_inegi}
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
                      name="codigo_postal"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                      value={form.codigo_postal}
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

                {/* Clave Entidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clave Entidad
                  </label>
                  <input
                    type="text"
                    name="clave_entidad"
                    maxLength={2}
                    minLength={2}
                    required
                    value={form.clave_entidad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Ej: 09"
                  />
                </div>

                {/* Nombre CUO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre CUO
                  </label>
                  <input
                    name="nombre_cuo"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                    value={form.nombre_cuo}
                    onChange={handleChange}
                  />
                </div>

                {/* Horario de atención */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario de atención
                </label>
                <input
                  name="horario_atencion"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Ej: Lun. a Vie. 8:00-16:30 / Sáb. 8:00-12:00"
                  value={form.horario_atencion}
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
                     name="tipo_cuo"
                     value={form.tipo_cuo}
                     onChange={handleChange}
                    >
                      <option value="">Selecciona tipo</option>
                      <option value="Centro Operativo Mexpost">Centro Operativo Mexpost</option>
                      <option value="Administración Postal">Administración Postal</option>
                      <option value="Gerencia Postal Estatal">Gerencia Postal Estatal</option>
                      <option value="Of. Sindicato">Of. Sindicato</option>
                      <option value="Oficina de Servicios Directos">Oficina de Servicios Directos</option>
                      <option value="Sucursal">Sucursal</option>
                      <option value="Módulo de Depósitos Masivos">Módulo de Depósitos Masivos</option>
                      <option value="Centro de Distribución">Centro de Distribución</option>
                      <option value="Centro de Atención al Público">Centro de Atención al Público</option>
                      <option value="Centro Operativo de Reparto">Centro Operativo de Reparto</option>
                      <option value="Gerencia">Gerencia</option>
                      <option value="Centro de Depósitos Masivos">Centro de Depósitos Masivos</option>
                      <option value="Oficina de Transbordo">Oficina de Transbordo</option>
                      <option value="Coordinación Operativa">Coordinación Operativa</option>
                      <option value="Oficina Operativa">Oficina Operativa</option>
                      <option value="Consol. de Ingresos y Egresos">Consol. de Ingresos y Egresos</option>
                      <option value="Coordinación Mexpost">Coordinación Mexpost</option>
                      <option value="Puerto Maritimo">Puerto Maritimo</option>
                      <option value="Agencia Municipal">Agencia Municipal</option>
                      <option value="Centro de Atención Integral">Centro de Atención Integral</option>
                      <option value="Aeropuerto">Aeropuerto</option>
                      <option value="Subdirección">Subdirección</option>
                      <option value="Dirección">Dirección</option>
                      <option value="Otros">Otros</option>
                      <option value="Módulo de Servicios">Módulo de Servicios</option>
                      <option value="Coordinación Administrativa">Coordinación Administrativa</option>
                      <option value="Almacen">Almacen</option>
                      <option value="Dirección General">Dirección General</option>
                      <option value="Tienda Filatélica">Tienda Filatélica</option>
                      <option value="Oficina de Cambio">Oficina de Cambio</option>
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
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
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
