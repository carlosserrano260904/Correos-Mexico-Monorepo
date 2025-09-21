import React from "react"
import { Star } from "lucide-react"

interface ComentarioProps {
  imagen: string
  nombre: string
  calificacion: number
  puntaje: number
  fecha: string
  comentario: string
}

export const Comentario = ({ imagen, nombre, calificacion, puntaje, fecha, comentario }: ComentarioProps) => {
  // Función para renderizar las estrellas
  const renderEstrellas = (rating: number) => {
    const estrellas = []
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      )
    }
    return estrellas
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mt-2git mt-3">

      {/* Header del comentario */}
      <div className="flex items-start gap-4 mb-4">
        {/* Imagen del usuario */}
        <img
          src={imagen}
          alt={nombre}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        {/* Información del usuario */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900">{nombre}</h4>
            <span className="text-sm text-gray-500">{fecha}</span>
          </div>
          
          {/* Calificación */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderEstrellas(calificacion)}
            </div>
            <span className="text-sm font-medium text-gray-700">{puntaje.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      {/* Comentario */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {comentario}
      </p>
    </div>
  )
}
