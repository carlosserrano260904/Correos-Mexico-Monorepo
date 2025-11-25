'use client';

import { createContext, useContext, useState, ReactNode } from "react";

export type ProductoStatus = "activo" | "archivado";

export type Producto = {
  id: number;
  nombre: string;
  marca: string;
  status: ProductoStatus;
  inventario: number;
  categoria: string;
  vendedor: string;
  sku: string;
  descripcion: string;
  tipo: string;   // MXN, USD, etc.
  valor: string;  // "$200"
};

type PanelProductosContextType = {
  // SOLO los productos que tú agregas desde el formulario
  productosExtra: Producto[];
  addProducto: (data: Omit<Producto, "id">) => void;
};

const PanelProductosContext = createContext<PanelProductosContextType | null>(
  null
);

export function PanelProductosProvider({ children }: { children: ReactNode }) {
  const [productosExtra, setProductosExtra] = useState<Producto[]>([]);

  const addProducto = (data: Omit<Producto, "id">) => {
    setProductosExtra((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1000; // ids altos para no chocar con los mocks
      return [...prev, { id: nextId, ...data }];
    });
  };

  return (
    <PanelProductosContext.Provider value={{ productosExtra, addProducto }}>
      {children}
    </PanelProductosContext.Provider>
  );
}

export function usePanelProductos() {
  const ctx = useContext(PanelProductosContext);
  if (!ctx) {
    throw new Error(
      "usePanelProductos debe usarse dentro de PanelProductosProvider"
    );
  }
  return ctx;
}