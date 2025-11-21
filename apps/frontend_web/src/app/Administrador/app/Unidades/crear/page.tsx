'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline, IoAddOutline } from "react-icons/io5";
import { useUnidadStore } from "@/stores/unidadStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UnidadesPage from "../page";

export default function RegistrarUnidadPage() {

  const [curpConductor, setCurpConductor] = useState("");
  const [asignado, setAsignado] = useState(false);
  const Unidades = useUnidadStore((state) => state.unidades);
  const asignarConductor = useUnidadStore((state) => state.asignarConductor);
  const fetchUnidades = useUnidadStore((state) => state.fetchUnidades);
  const actualizarZonaAsignada = useUnidadStore((state) => state.actualizarZonaAsignada);
  

  const handleAsignarConductor = async () => {
  if (form.placas.trim() !== "" && form.curpConductor.trim() !== "") {
    try {
      await asignarConductor(form.placas, form.curpConductor);
      await fetchUnidades();
      setAsignado(true);
      alert("Conductor asignado correctamente");
    } catch (err) {
      alert("Error asignando conductor");
    }
  } else {
    alert("Ingresa placas y un CURP válido");
  }
  router.push("/Administrador/app/Unidades"); // Redirige después de asignar
};

  const {agregarUnidad} = useUnidadStore();
  const router = useRouter();

  const [form, setForm] = useState({
      tipoVehiculo: "",
      placas: "",
      volumenCarga: "",
      numEjes: "",
      numLlantas: "",
      claveOficina: "",
      tarjetaCirculacion: "",
      conductor:"",
      curpConductor: "",
      zonaAsignada:"",
    });

    useEffect(() => {
      console.log("asi estan las unidades", Unidades);
    }, [Unidades]);

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await agregarUnidad(form);
    if (form.curpConductor.trim() !== ""){
      await asignarConductor(form.placas, form.curpConductor);
    }
    router.push("/Administrador/app/Unidades"); // Redirige después de crear
    };
    
    const handleActualizarZona = async () => {
      if (form.placas.trim() === "" || form.zonaAsignada.trim() === "") {
        alert("Debes ingresar placas y zona asignada.");
        return;
      }
      try {
        await actualizarZonaAsignada(form.placas, form.zonaAsignada);
        alert("Zona asignada actualizada correctamente");
        await fetchUnidades();
      } catch (err) {
        alert("Error actualizando zona asignada");
      }
      router.push("/Administrador/app/Unidades"); // Redirige después de actualizar
    }

    

  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Registrar Nueva Unidad</h1>
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-200"></div>

          {/* Formulario */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Tipo de Vehículo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Vehículo
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    name="tipoVehiculo"
                    value={form.tipoVehiculo}
                    onChange={handleChange}
                    >
                      <option value="">Tipos</option>
                      <option value="Camión de 10 ton">Camión de 10 ton</option>
                      <option value="Automóvil 400 kg">Automóvil 400 kg</option>
                      <option value="Camión de 5 ton">Camión de 5 ton</option>
                    </select>
                    <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                {/* Placas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placas
                  </label>
                  <input
                    name="placas"
                    value={form.placas}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>

                {/* Volumen de Carga, Número de Ejes y Número de Llantas en una fila */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volumen de Carga
                    </label>
                    <input
                      name="volumenCarga"
                      value={form.volumenCarga}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Ejes
                    </label>
                    <input
                      name="numEjes"
                      value={form.numEjes}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Llantas
                    </label>
                    <input
                      name="numLlantas"
                      value={form.numLlantas}
                      onChange={handleChange}
                      type="text"
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Clave de Oficina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clave de Oficina
                  </label>
                  <input
                    name="claveOficina"
                    value={form.claveOficina}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>

                {/* Tarjeta de Circulación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarjeta de Circulación
                  </label>
                  <input
                    name="tarjetaCirculacion"
                    value={form.tarjetaCirculacion}
                    onChange={handleChange}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder=""
                  />
                </div>

                {/* Sección de Asignar conductor */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Título con fondo gris */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Asignar conductor</h3>
                  </div>
                  
                  {/* Campos con fondo blanco */}
                  <div className="p-4 bg-white space-y-4">
                    {/* Placas de la Unidad */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placas de la Unidad
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder=""
                        onChange={handleChange}
                      />
                    </div>

                    {/* Zona Asignada */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona asignada (clave CUO destino)
                      </label>
                      <input
                        name="zonaAsignada"
                        value={form.zonaAsignada}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Ejemplo: 02888"
                      />
                    </div>

                    {/* CURP del Conductor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CURP del Conductor
                      </label>
                      <input
                        name="curpConductor"
                        value={form.curpConductor}
                        onChange={handleChange}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                {/* Botón Asignar conductor */}
                <div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-sm font-medium"
                    onClick={handleActualizarZona}
                  >
                    <IoAddOutline className="h-4 w-4" />
                    Actualizar Zona
                  </Button>
                </div>

                {/* Botón Asignar conductor */}
                <div>
                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                    onClick={handleAsignarConductor}
                  >
                    <IoAddOutline className="h-4 w-4" />
                    Asignar conductor
                  </Button>
                </div>

                {/* Botón principal */}
                <div className="pt-3">
                  <Button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-sm font-medium"
                  >
                    Crear Unidad
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
