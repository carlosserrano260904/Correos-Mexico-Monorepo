'use client'
import { useEffect, useState } from 'react'

type DocType = 0 | 1 | 2 // 0: Términos, 1: Aviso, 2: ARCO

export default function Page() {
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [doc, setDoc] = useState<DocType>(0)

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

    const urls: string[] = [
      `${API.replace(/\/$/, '')}/api/terminos-web-html`,
      `${API.replace(/\/$/, '')}/api/aviso-web-html`,
      `${API.replace(/\/$/, '')}/api/arco-web-html`,
    ]

    ;(async () => {
      try {
        setError(null)
        setHtml(null)

        const res = await fetch(urls[doc], { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const text = await res.text()
        setHtml(text)
      } catch (e) {
        const err = e as Error
        setError(err.message ?? 'Error desconocido')
      }
    })()
  }, [doc])

  const labels: string[] = [
    'Términos y condiciones',
    'Aviso de privacidad',
    'Derechos ARCO',
  ]

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Botones / tabs */}
      <div className="flex gap-2 mb-6">
        {labels.map((label, idx) => {
          const value = idx as DocType
          return (
            <button
              key={label}
              onClick={() => setDoc(value)}
              className={`px-4 py-2 rounded-full border border-gray-300 cursor-pointer transition-colors ${
                doc === value
                  ? 'bg-gray-200 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
              aria-pressed={doc === value}
            >
              {label}
            </button>
          )
        })}
      </div>

      <h1 className="text-xl font-semibold mb-4">{labels[doc]}</h1>

      {error && <p className="text-red-600">Error cargando: {error}</p>}
      {!error && !html && <p>Cargando…</p>}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </main>
  )
}
