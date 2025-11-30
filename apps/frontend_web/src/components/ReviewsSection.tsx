// components/ReviewsSection.tsx
import React, { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Comentario } from "./Comentario"

interface ReviewData {
  imagen: string
  nombre: string
  calificacion: number
  puntaje: number
  fecha: string
  comentario: string
}

interface ReviewsResponse {
  promedio: number
  totalReseñas: number
  distribution: Array<{
    label: string
    value: number
    color: string
  }>
  comentarios: ReviewData[]
}

interface ReviewsSectionProps {
  productId: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const [openModal, setOpenModal] = useState(false)
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Datos de placeholder por si falla la petición
  const placeholderData: ReviewsResponse = {
    promedio: 4.0,
    totalReseñas: 140,
    distribution: [
      { label: "Excelente", value: 80, color: "bg-green-500" },
      { label: "Buena", value: 40, color: "bg-green-300" },
      { label: "Regular", value: 30, color: "bg-yellow-400" },
      { label: "Malo", value: 20, color: "bg-orange-500" },
      { label: "Muy malo", value: 10, color: "bg-red-500" },
    ],
    comentarios: [
      {
        imagen: "/example.jpg",
        nombre: "Adriana García",
        calificacion: 5,
        puntaje: 5.0,
        fecha: "1 mes atrás",
        comentario: "Una joya hecha a mano. Estoy completamente enamorada de esta blusa. El bordado es impresionante; cada puntada parece hecha con muchísimo cuidado...",
      },
      {
        imagen: "/example.jpg",
        nombre: "Carlos Rodríguez",
        calificacion: 4,
        puntaje: 4.5,
        fecha: "2 semanas atrás",
        comentario: "Lo que más me sorprendió fue la calidad de la tela, es fresca, liviana y súper cómoda...",
      },
    ]
  }

  // Función para obtener las reseñas del backend
  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Usar la URL de tu API desde .env
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Hacer la petición a tu endpoint de reviews
      const response = await fetch(`${apiUrl}/api/products/${productId}/reviews`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar las reseñas')
      }

      const data: ReviewsResponse = await response.json()
      setReviewsData(data)
      
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('No se pudieron cargar las reseñas')
      // Si hay error, usamos los datos de placeholder
      setReviewsData(placeholderData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchReviews()
    }
  }, [productId])

  // Si está cargando, mostrar skeleton
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row w-full gap-8">
            <div className="w-full md:w-1/3 space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Usar datos del backend o placeholders
  const data = reviewsData || placeholderData

  // Render estrellas grandes
  const renderEstrellasGrandes = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={28}
          className={`${
            i <= data.promedio ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      )
    }
    return stars
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">

      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reseñas</h2>

      <div className="flex flex-col md:flex-row w-full gap-8">
        
        {/* IZQUIERDA: Promedio */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <h1 className="text-6xl font-semibold text-gray-900">{data.promedio.toFixed(1)}</h1>
          
          {/* Estrellas */}
          <div className="flex items-center gap-1 my-2">
            {renderEstrellasGrandes()}
          </div>

          <p className="text-gray-500 text-sm mt-1">
            Basado en {data.totalReseñas} reseñas
          </p>
        </div>

        {/* DERECHA: Barras */}
        <div className="w-full md:w-2/3 flex flex-col gap-3">
          {data.distribution.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-sm w-24 text-gray-700">{item.label}</span>

              {/* Barra */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Comentarios */}
      <div className="mt-10">
        {data.comentarios.map((comentario, idx) => (
          <Comentario key={idx} {...comentario} />
        ))}
      </div>

      {/* Ver más */}
      {data.comentarios.length > 0 && (
        <div className="w-full flex justify-end mt-6">
          <button
            onClick={() => setOpenModal(true)}
            className="text-pink-600 font-semibold hover:underline"
          >
            Ver más reseñas
          </button>
        </div>
      )}

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl bg-white rounded-lg p-6 overflow-y-auto max-h-[80vh]">

            <h3 className="text-xl font-bold mb-4">Más reseñas</h3>

            {data.comentarios.map((comentario, idx) => (
              <Comentario key={idx} {...comentario} />
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}