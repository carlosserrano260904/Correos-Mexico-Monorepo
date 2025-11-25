'use client'

import { useEffect, useState } from "react";
import { useHistorialStore } from "@/stores/historialStore";
import { Plantilla } from "@/app/Administrador/components/plantilla";

export default function HistorialAsignacionesPage() {
  const { historial, loading, fetchHistorial } = useHistorialStore();

  const [totales, setTotales] = useState({
    conductores: 0,
    oficinas: 0,
    unidades: 0,
  });

  useEffect(() => {
    fetchHistorial();

    // Consumir las APIs y contar
    Promise.all([
      fetch("http://localhost:3000/api/conductores").then(res => res.json()),
      fetch("http://localhost:3000/api/oficinas").then(res => res.json()),
      fetch("http://localhost:3000/api/unidades").then(res => res.json()),
    ]).then(([conductores, oficinas, unidades]) => {
      setTotales({
        conductores: conductores.length,
        oficinas: oficinas.length,
        unidades: unidades.length,
      });
    });
  }, [fetchHistorial]);

  return (
    <Plantilla title="">

      {/*Total en general */}
      <div className="flex gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6 flex-1">
          <div className="text-gray-600 text-sm mb-2">Total de conductores</div>
          <div className="text-3xl font-bold">{totales.conductores}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex-1">
          <div className="text-gray-600 text-sm mb-2">Total de sucursales</div>
          <div className="text-3xl font-bold">{totales.oficinas}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex-1">
          <div className="text-gray-600 text-sm mb-2">Total de unidades</div>
          <div className="text-3xl font-bold">{totales.unidades}</div>
        </div>
      </div>

      {/*Historial de asignacion */}
    <div className="bg-gray-100 rounded-xl p-2">
      <h2 className="text-gray-700 text-sm font-medium px-3 py-2">Historial de asignaciones</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-medium text-gray-700">Conductor</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">CURP</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Placas unidad</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Oficina salida</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Oficina destino</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Oficina actual</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Fecha asignación</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Fecha llegada destino</th>
              <th className="text-left py-2 px-4 font-medium text-gray-700">Fecha finalización</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">Cargando...</td>
              </tr>
            ) : historial.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">Sin registros</td>
              </tr>
            ) : (
              historial.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-semibold">{item.nombreConductor}</td>
                  <td className="py-2 px-4">{item.curp}</td>
                  <td className="py-2 px-4">{item.placasUnidad}</td>
                  <td className="py-2 px-4">{item.oficinaSalida}</td>
                  <td className="py-2 px-4">{item.claveCuoDestino}</td>
                  <td className="py-2 px-4">{item.claveOficinaActual}</td>
                  <td className="py-2 px-4">{item.fechaAsignacion ? new Date(item.fechaAsignacion).toLocaleString() : "-"}</td>
                  <td className="py-2 px-4">{item.fechaLlegadaDestino ? new Date(item.fechaLlegadaDestino).toLocaleString() : "-"}</td>
                  <td className="py-2 px-4">{item.fechaFinalizacion ? new Date(item.fechaFinalizacion).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </Plantilla>
  );
}