import React, { useState } from "react"
import { Heart } from "lucide-react"
import { Btn } from "./primitivos"

interface ProductoDetalleProps {
  images: string[]
  nombre: string
  precio: number
  colores: string[]
  tallas: string[]
  descripcionCompleta: {
    titulo: string
    texto: string
    imagenGrande: string
  }
}

export const ProductoDetalle = ({ 
  images, 
  nombre, 
  precio, 
  colores, 
  tallas, 
  descripcionCompleta 
}: ProductoDetalleProps) => {
  const [imagenPrincipal, setImagenPrincipal] = useState(images[0])
  const [colorSeleccionado, setColorSeleccionado] = useState(colores[0])
  const [tallaSeleccionada, setTallaSeleccionada] = useState("")
  const [cantidad, setCantidad] = useState(1)

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Sección principal del producto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Lado izquierdo - Imágenes */}
        <div className="bg-gray-100 p-6 rounded-lg flex gap-4">
          {/* Miniaturas */}
          <div className="flex flex-col gap-3">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setImagenPrincipal(img)}
                className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                  imagenPrincipal === img ? 'border-pink-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={img}
                  alt={`Vista ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          
          {/* Imagen principal */}
          <div className="flex-1">
            <img
              src={imagenPrincipal}
              alt={nombre}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Lado derecho - Información del producto */}
        <div className="space-y-6">
          {/* Nombre del producto */}
          <h1 className="text-2xl font-semibold text-gray-900">{nombre}</h1>
          
          {/* Precio */}
          <p className="text-2xl font-bold text-gray-900">
            MXN {precio.toLocaleString()}.00
          </p>
          
          {/* Colores */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Color:</p>
            <div className="flex gap-2">
              {colores.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setColorSeleccionado(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    colorSeleccionado === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          {/* Tallas */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Talla:</p>
            <div className="flex gap-2 flex-wrap">
              {tallas.map((talla) => (
                <Btn
                  key={talla}
                  className={`transition-colors ${
                    tallaSeleccionada === talla
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span 
                    onClick={() => setTallaSeleccionada(talla)}
                    className="cursor-pointer text-sm font-medium"
                  >
                    {talla}
                  </span>
                </Btn>
              ))}
            </div>
            <button className="text-sm text-pink-500 hover:text-pink-600 mt-6">
              Encontrar mi talla
            </button>
          </div>
          
          {/* Botón agregar al carrito */}
          <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Agregar al carrito
          </button>
          
          {/* Contador de cantidad e icono de corazón */}
          <div className="flex justify-between items-center">
            {/* Contador de cantidad */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-gray-900 font-medium border-x border-gray-300">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Icono de corazón a la derecha */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Sección de descripción completa */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Lado izquierdo - Texto centrado verticalmente */}
        <div className="space-y-4 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {descripcionCompleta.titulo}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {descripcionCompleta.texto}
          </p>
        </div>
        
        {/* Lado derecho - Imagen grande */}
        <div>
          <img
            src={descripcionCompleta.imagenGrande}
            alt={descripcionCompleta.titulo}
            className="w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
