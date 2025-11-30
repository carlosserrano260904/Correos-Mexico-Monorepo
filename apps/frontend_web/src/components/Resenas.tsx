import React from "react"
import { Star } from "lucide-react"
import { Progress } from "./ui/progress"

interface ResenaStats {
  excelente: number
  buena: number
  regular: number
  malo: number
  muyMalo: number
}

interface ResenasProps {
  calificacionGeneral: number
  totalResenas: number
  stats: ResenaStats
}

export const Resenas = ({ calificacionGeneral, totalResenas, stats }: ResenasProps) => {
  // Calcular porcentajes para las barras de progreso
  const calcularPorcentaje = (valor: number) => (valor / totalResenas) * 100

  // Generar estrellas
  const renderEstrellas = (calificacion: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-8 h-8 ${
          index < Math.floor(calificacion)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ))
  }

  const categorias = [
    { nombre: "Excelente", valor: stats.excelente, color: "bg-green-500" },
    { nombre: "Buena", valor: stats.buena, color: "bg-lime-400" },
    { nombre: "Regular", valor: stats.regular, color: "bg-yellow-400" },
    { nombre: "Malo", valor: stats.malo, color: "bg-orange-500" },
    { nombre: "Muy malo", valor: stats.muyMalo, color: "bg-red-500" }
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Reseñas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-4">
          {/* Lado izquierdo - Calificación general */}
          <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-gray-900 mb-3">
              {calificacionGeneral.toFixed(1)}
            </div>
            
            {/* Estrellas */}
            <div className="flex gap-1 mb-4">
              {renderEstrellas(calificacionGeneral)}
            </div>
            
            {/* Texto basado en */}
            <p className="text-base text-gray-600">
              Basado en {totalResenas} reseñas
            </p>
          </div>

          {/* Lado derecho - Barras de progreso */}
          <div className="space-y-5 flex flex-col justify-center pl-0 md:pl-6">
            {categorias.map((categoria, index) => (
              <div key={index} className="flex items-center gap-3">
                {/* Nombre de la categoría */}
                <div className="w-20 text-sm text-gray-700 text-right">
                  {categoria.nombre}
                </div>
                
                {/* Barra de progreso personalizada */}
                <div className="flex-1 relative max-w-xs">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${categoria.color}`}
                      style={{ width: `${calcularPorcentaje(categoria.valor)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
