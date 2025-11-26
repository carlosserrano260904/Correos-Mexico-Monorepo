'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Resumen",    href: "/Administrador/app/PanelProductos/resumen" },
  { label: "Productos",  href: "/Administrador/app/PanelProductos/Productos" },
  { label: "Órdenes",    href: "/Administrador/app/PanelProductos/ordenes" },
  { label: "Cupones",    href: "/Administrador/app/PanelProductos/cupones" },
  { label: "Descuentos", href: "/Administrador/app/PanelProductos/descuentos" },
];

export function ProductosTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-white w-full">
      <nav className="flex items-center gap-4 text-sm">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);

          const base =
            "px-3 py-2 rounded-md transition-colors";
          const inactive = "text-gray-500 hover:text-gray-900 hover:bg-gray-100";
          const activeStyles = "bg-gray-100 text-gray-900 font-medium";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={base + " " + (active ? activeStyles : inactive)}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}