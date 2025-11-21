'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [html, setHtml] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [doc, setDoc] = useState<0 | 1 | 2>(0); // 0: Términos, 1: Aviso, 2: ARCO

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const urls = [
      `${API.replace(/\/$/, '')}/api/terminos-web-html`,
      `${API.replace(/\/$/, '')}/api/aviso-web-html`,
      `${API.replace(/\/$/, '')}/api/arco-web-html`,
    ];

    (async () => {
      try {
        setError(null);
        setHtml(null);
        const res = await fetch(urls[doc], { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setHtml(await res.text());
      } catch (e: any) {
        setError(e?.message ?? 'Error desconocido');
      }
    })();
  }, [doc]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Botones / tabs */}
      <div className="flex gap-2 mb-6">
        {['Términos y condiciones', 'Aviso de privacidad', 'Derechos ARCO'].map((label, idx) => (
          <button
                key={label}
                onClick={() => setDoc(idx as 0 | 1 | 2)}
                className={`px-4 py-2 rounded-full border border-gray-300 cursor-pointer transition-colors ${doc === (idx as 0 | 1 | 2) ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                    }`}
                aria-pressed={doc === (idx as 0 | 1 | 2)}
            >
                {label}
            </button>
        ))}
      </div>

      <h1 className="text-xl font-semibold mb-4"> {['Términos y condiciones', 'Aviso de privacidad', 'Derechos ARCO'][doc]}</h1>
      {error && <p className="text-red-600">Error cargando: {error}</p>}
      {!error && !html && <p>Cargando…</p>}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </main>
  );
}
