'use client';
import { useState } from "react";
import { Boton } from "./BotonIcono";
import { IoMdNotificationsOutline } from "react-icons/io";
import BandejaNotificaciones from "./tarjetaNotificacion"
import clsx from "clsx";

function Notificacion() {
  return (
    <Boton
      Icono={IoMdNotificationsOutline}
      className="Notificación"
    />
  );
}

export default function BotonNotificacion() {
  const [activo, setActivo] = useState(false);

  return (
    <div className=" inline-block">
      <button
        onClick={() => setActivo(!activo)}
        className={clsx(
          "cursor-pointer inline-flex items-center justify-center p-[5px] rounded-[8px] transition-colors duration-300",
          activo ? "bg-[#E5E7EB]" : "hover:bg-slate-100"
        )}
      >
        <Notificacion />
      </button>

      {activo && (
        <div className="absolute right-0 mt-2 w-80 z-50">
          <BandejaNotificaciones />
        </div>
      )}
    </div>
  );
}




