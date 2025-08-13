'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [html, setHtml] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
    const url = `${API.replace(/\/$/, '')}/api/terminos-web-html`;

    (async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setHtml(await res.text());
      } catch (e: any) {
        setError(e?.message ?? 'Error desconocido');
      }
    })();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Términos y condiciones</h1>
      {error && <p className="text-red-600">Error cargando: {error}</p>}
      {!error && !html && <p>Cargando…</p>}
      {html && <div dangerouslySetInnerHTML={{ __html: html }} />}
    </main>
  );
}
