"use client";

import React, { useState } from "react";
import { Plantilla } from "../../components/plantilla";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5"; 

function Toggle({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition
        ${checked ? "bg-pink-600" : "bg-gray-300"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${checked ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  right,
  sublabel,
}: {
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div>
        <p className="text-xs text-gray-800">{label}</p>
        {sublabel && <p className="text-[11px] text-gray-500">{sublabel}</p>}
      </div>
      {right}
    </div>
  );
}

function SmallButton({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[11px] px-3 py-1 rounded-md bg-pink-600 text-white hover:bg-pink-700 transition"
    >
      {text}
    </button>
  );
}

export default function ConfiguracionPage() {
  const router = useRouter();

  // switches
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificacionesPush, setNotificacionesPush] = useState(false);
  const [dosPasos, setDosPasos] = useState(false);
  const [iconosGrandes, setIconosGrandes] = useState(false);
  const [mostrarActividad, setMostrarActividad] = useState(false);
  const [compartirDatos, setCompartirDatos] = useState(false);

  // handlers navegación
  const goPerfil = () => router.push("/perfil");
  const goCambiarFoto = () => router.push("/perfil/foto"); // ajusta si tienes otra ruta
  const goContrasenia = () => router.push("/perfil/contrasena");
  const goDispositivos = () => router.push("/seguridad/dispositivos");
  const goTerminos = () => router.push("/terminos");

  const handleLogout = () => router.push("/");

  const handleEliminarCuenta = () => {
    // aquí podrías abrir modal/confirmación real
    alert("Función pendiente: eliminar cuenta");
  };

  return (
    <Plantilla>
      <div className="min-h-screen bg-[#f3f4f6] px-4 py-6">
        <div className="max-w-3xl mx-auto">

          {/* ✅ BOTÓN REGRESAR */}
          <div className="mb-3">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 bg-pink-600 text-white text-[11px] px-3 py-1 rounded-md hover:bg-pink-700 transition"
            >
              <IoChevronBack size={14} />
              Regresar
            </button>
          </div>

          <h1 className="text-xl font-bold text-center text-gray-900 mb-4">
            Configuración
          </h1>

          {/* PERFIL */}
          <SectionCard title="Perfil">
            <Row
              label="Editar Perfil"
              right={<SmallButton text="Editar" onClick={goPerfil} />}
            />
            <Row
              label="Cambiar Foto"
              right={<SmallButton text="Cambiar" onClick={goCambiarFoto} />}
            />
            <Row
              label="Contraseña"
              right={<SmallButton text="Actualizar" onClick={goContrasenia} />}
            />
          </SectionCard>

          {/* PREFERENCIAS */}
          <SectionCard title="Preferencias">
            <Row
              label="Modo Oscuro"
              right={
                <Toggle
                  checked={modoOscuro}
                  onChange={setModoOscuro}
                  ariaLabel="Activar modo oscuro"
                />
              }
            />
            <Row
              label="Notificaciones Push"
              right={
                <Toggle
                  checked={notificacionesPush}
                  onChange={setNotificacionesPush}
                  ariaLabel="Activar notificaciones push"
                />
              }
            />
          </SectionCard>

          {/* SEGURIDAD */}
          <SectionCard title="Seguridad">
            <Row
              label="Ver Dispositivos"
              right={<SmallButton text="Ver" onClick={goDispositivos} />}
            />
            <Row
              label="Autenticación 2 Pasos"
              right={
                <Toggle
                  checked={dosPasos}
                  onChange={setDosPasos}
                  ariaLabel="Activar autenticación de dos pasos"
                />
              }
            />
          </SectionCard>

          {/* APARIENCIA */}
          <SectionCard title="Apariencia">
            <Row
              label="Iconos Grandes"
              right={
                <Toggle
                  checked={iconosGrandes}
                  onChange={setIconosGrandes}
                  ariaLabel="Activar iconos grandes"
                />
              }
            />
          </SectionCard>

          {/* PRIVACIDAD */}
          <SectionCard title="Privacidad">
            <Row
              label="Mostrar Actividad"
              right={
                <Toggle
                  checked={mostrarActividad}
                  onChange={setMostrarActividad}
                  ariaLabel="Mostrar actividad"
                />
              }
            />
            <Row
              label="Compartir Datos"
              right={
                <Toggle
                  checked={compartirDatos}
                  onChange={setCompartirDatos}
                  ariaLabel="Compartir datos"
                />
              }
            />
          </SectionCard>

          {/* INFORMACIÓN APP */}
          <SectionCard title="Información de la App">
            <Row
              label="Versión"
              right={<span className="text-[11px] text-gray-600">1.0.0</span>}
            />
            <Row
              label="Términos y Condiciones"
              right={<SmallButton text="Ver" onClick={goTerminos} />}
            />
          </SectionCard>

          {/* BOTONES INFERIORES */}
          <div className="mt-6 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md text-sm font-semibold transition"
            >
              Cerrar sesión
            </button>
            <button
              onClick={handleEliminarCuenta}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md text-sm font-semibold transition"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </Plantilla>
  );
}
