'use client'

import { useState } from "react";
import { useHistorialStore } from "@/stores/historialStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function CrearHistorialAsignacionPage() {
  const { registrarLlegadaDestino, registrarRetornoOrigen } = useHistorialStore();
  const router = useRouter();

  // Estados para los formularios
  const [formLlegada, setFormLlegada] = useState({ curp: "", placas: "", oficinaActual: "" });
  const [formRetorno, setFormRetorno] = useState({ curp: "", placas: "" });
  const [error, setError] = useState("");

  // Handlers
  const handleChangeLlegada = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormLlegada({ ...formLlegada, [e.target.name]: e.target.value });
  };
  const handleChangeRetorno = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormRetorno({ ...formRetorno, [e.target.name]: e.target.value });
  };

  const handleSubmitLlegada = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await registrarLlegadaDestino(formLlegada.curp, formLlegada.placas, formLlegada.oficinaActual);
      alert("Llegada a destino registrada");
      setFormLlegada({ curp: "", placas: "", oficinaActual: "" });
    } catch (err) {
      setError("Error al registrar llegada a destino");
    }
    router.push("/Administrador/app/Resumen");
  };

  const handleSubmitRetorno = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await registrarRetornoOrigen(formRetorno.curp, formRetorno.placas);
      alert("Retorno a origen registrado");
      setFormRetorno({ curp: "", placas: "" });
    } catch (err) {
      setError("Error al registrar retorno a origen");
      
    }
    router.push("/Administrador/app/Resumen");
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-6">Registrar en historial de asignaciones</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario llegada-destino */}
        <form className="bg-white rounded-xl shadow p-6 space-y-4" onSubmit={handleSubmitLlegada}>
          <h3 className="font-semibold text-lg mb-2">Llegada a destino</h3>
          <input name="curp" value={formLlegada.curp} onChange={handleChangeLlegada} placeholder="CURP" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <input name="placas" value={formLlegada.placas} onChange={handleChangeLlegada} placeholder="Placas" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <input name="oficinaActual" value={formLlegada.oficinaActual} onChange={handleChangeLlegada} placeholder="Oficina actual" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-sm font-medium">Registrar llegada</Button>
        </form>
        {/* Formulario retorno-origen */}
        <form className="bg-white rounded-xl shadow p-6 space-y-4" onSubmit={handleSubmitRetorno}>
          <h3 className="font-semibold text-lg mb-2">Retorno a origen</h3>
          <input name="curp" value={formRetorno.curp} onChange={handleChangeRetorno} placeholder="CURP" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <input name="placas" value={formRetorno.placas} onChange={handleChangeRetorno} placeholder="Placas" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" />
          <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 text-sm font-medium">Registrar retorno</Button>
        </form>
      </div>
    </div>
  );
}