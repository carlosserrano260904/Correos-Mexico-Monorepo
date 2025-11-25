'use client';

import type { ReactNode } from "react";
import { LogisticaTabs } from "./LogisticaTabs";

export default function PanelLogisticaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior con los tabs de logística */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center">
          <LogisticaTabs />
        </div>
      </header>

      {/* Contenido de cada pantalla (Inicio, Unidades, etc.) */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}