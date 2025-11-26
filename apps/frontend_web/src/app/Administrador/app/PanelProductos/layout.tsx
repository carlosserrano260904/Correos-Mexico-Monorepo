'use client';

import { ReactNode } from "react";
import { ProductosTabs } from "./ProductosTabs";
import { PanelProductosProvider } from "./PanelProductosContext";

export default function PanelProductosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PanelProductosProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header con tabs */}
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-6 h-12 flex items-center">
            <ProductosTabs />
          </div>
        </header>

        {/* Contenido */}
        <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
      </div>
    </PanelProductosProvider>
  );
}