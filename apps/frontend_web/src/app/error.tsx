'use client'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-8">
          Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}