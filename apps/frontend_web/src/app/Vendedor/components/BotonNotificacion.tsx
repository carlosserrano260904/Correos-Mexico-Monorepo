'use client';

import { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import BandejaNotificaciones from "./tarjetaNotificacion";
import clsx from "clsx";

export default function BotonNotificacion() {
  const [activo, setActivo] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setActivo(!activo)}
        aria-label="Notificaciones"
        className={clsx(
          "cursor-pointer inline-flex items-center justify-center p-[5px] rounded-[8px] transition-colors duration-300",
          // Ajustamos el color del texto/icono aquí si es necesario (ej: text-gray-600)
          activo ? "bg-[#E5E7EB] text-gray-800" : "hover:bg-slate-100 text-gray-600"
        )}
      >
        {/* 2. Usamos el ícono directamente. 
            size={24} es un tamaño estándar para botones de acción. */}
        <IoMdNotificationsOutline size={24} />
      </button>

      {activo && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <BandejaNotificaciones />
        </div>
      )}
    </div>
  );
}