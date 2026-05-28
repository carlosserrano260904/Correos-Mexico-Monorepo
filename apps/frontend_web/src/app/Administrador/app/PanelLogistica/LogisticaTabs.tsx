'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHomeOutline,
  IoBusOutline,
  IoStorefrontOutline,
  IoCubeOutline,
  IoPersonOutline,
} from "react-icons/io5";

const tabs = [
  {
    label: "Inicio",
    href: "/Administrador/app/PanelLogistica/inicio",
    icon: IoHomeOutline,
  },
  {
    label: "Unidades",
    href: "/Administrador/app/PanelLogistica/unidades",
    icon: IoBusOutline,
  },
  {
    label: "Sucursales",
    href: "/Administrador/app/PanelLogistica/sucursales",
    icon: IoStorefrontOutline,
  },
  {
    label: "Paquetes",
    href: "/Administrador/app/PanelLogistica/paquetes",
    icon: IoCubeOutline,
  },
  {
    label: "Personal",
    href: "/Administrador/app/PanelLogistica/personal",
    icon: IoPersonOutline,
  },
];

export function LogisticaTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-full">
      <nav className="flex items-center gap-4 text-sm">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          const Icon = tab.icon;

          const base =
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm transition-colors";
          const activeStyles =
            "bg-pink-50 border-pink-200 text-pink-600";
          const inactiveStyles =
            "border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-100";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${base} ${active ? activeStyles : inactiveStyles}`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}