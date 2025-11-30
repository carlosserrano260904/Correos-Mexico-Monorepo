'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plantilla } from '@/components/plantilla';

type DocType = 0 | 1 | 2; // 0: Términos, 1: Aviso, 2: ARCO

const LABELS = [
  'Términos y condiciones',
  'Aviso de privacidad',
  'Derechos ARCO',
] as const;

export default function TerminosPage() {
  const router = useRouter();

  const [doc, setDoc] = useState<DocType>(0);
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const urls = [
      `${API.replace(/\/$/, '')}/api/terminos-web-html`,
      `${API.replace(/\/$/, '')}/api/aviso-web-html`,
      `${API.replace(/\/$/, '')}/api/arco-web-html`,
    ];

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setHtml(null);

        // 🚀 Aquí ya se consume la API (cuando backend exponga los endpoints)
        const res = await fetch(urls[doc], { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const content = await res.text();
        if (!cancelled) setHtml(content);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Error desconocido');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [doc]);

  return (
    <Plantilla>
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Botón Regresar */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
        >
          ← Regresar
        </button>

        {/* Título */}
        <h1 className="text-3xl font-semibold text-center mb-6">
          Términos{' '}
          <span className="text-pink-500 font-semibold">y Condiciones</span>
        </h1>

        {/* Tabs / Botones (se quedan los 3) */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {LABELS.map((label, idx) => {
            const value = idx as DocType;
            const isActive = doc === value;
            return (
              <button
                key={label}
                onClick={() => setDoc(value)}
                className={`px-6 py-2 rounded-full border text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-200 border-gray-400 font-semibold'
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Estado de carga / error */}
        {loading && (
          <p className="text-center text-gray-500 mb-4">Cargando…</p>
        )}
        {error && (
          <p className="text-center text-red-600 mb-4">
            Contenido no disponible por el momento ({error})
          </p>
        )}

        {/* Contenido desde la API */}
        {html && (
          <div
            className="text-sm leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {/* Si todavía no hay API y no llega nada */}
        {!loading && !error && !html && (
          <p className="text-center text-gray-400 text-sm">
            (Contenido se mostrará aquí cuando el backend envíe la información)
          </p>
        )}
      </main>
    </Plantilla>
  );
}
