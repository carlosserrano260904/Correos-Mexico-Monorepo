'use client';

import React, { useState } from 'react';
import { IoSearchOutline, IoChevronDownOutline } from 'react-icons/io5';
import { FaUserTie, FaFileAlt, FaImages, FaHome } from 'react-icons/fa';

// Single-file React component that simulates the 5 screens the user requested.
// Built with Tailwind classes so you can paste it into a Next.js "use client" page.

export default function AdminDashboard() {
  const [route, setRoute] = useState<'inicio'|'terminos'|'productos'|'vendedores'|'banners'>('inicio');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header onNavigate={setRoute} active={route} />
      <main className="mt-6 max-w-6xl mx-auto">
        {route === 'inicio' && <PantallaInicio onNavigate={setRoute} />}
        {route === 'terminos' && <PantallaTerminos />}
        {route === 'productos' && <PantallaSolicitudesProductos />}
        {route === 'vendedores' && <PantallaSolicitudesVendedores />}
        {route === 'banners' && <PantallaBanners />}
      </main>
    </div>
  );
}

function Header({ onNavigate, active }:{onNavigate:(r:any)=>void, active:string}){
  return (
    <header className="flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">C</div>
        <h1 className="text-xl font-semibold text-gray-900">Panel administrativo</h1>
        <nav className="ml-6 flex items-center gap-2 text-sm text-gray-600">
          <NavButton label="Inicio" active={active==='inicio'} onClick={()=>onNavigate('inicio')} icon={<FaHome/>} />
          <NavButton label="Términos" active={active==='terminos'} onClick={()=>onNavigate('terminos')} />
          <NavButton label="Productos" active={active==='productos'} onClick={()=>onNavigate('productos')} />
          <NavButton label="Vendedores" active={active==='vendedores'} onClick={()=>onNavigate('vendedores')} />
          <NavButton label="Banners" active={active==='banners'} onClick={()=>onNavigate('banners')} icon={<FaImages/>} />
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">Usuarios</button>
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src="https://i.pravatar.cc/40" alt="avatar" />
        </div>
      </div>
    </header>
  );
}

function NavButton({label, onClick, active, icon}:{label:string, onClick?:any, active?:boolean, icon?:any}){
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded-full ${active ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'} text-sm flex items-center gap-2`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ----------------------------
// Pantalla: INICIO / DASHBOARD
// ----------------------------
function PantallaInicio({onNavigate}:{onNavigate:(r:any)=>void}){
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Bienvenida, Jimena</h2>
            <p className="text-sm text-gray-500 mt-1">Panel de control — resumen general</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <StatCard title="Solicitudes de vendedores" value="32" color="red" />
          <StatCard title="Solicitudes de productos" value="112" color="yellow" />
          <StatCard title="Nuevos usuarios" value="150" color="cyan" />
          <StatCard title="Nuevos productos" value="250" color="purple" />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">
          <ActionCard title="Términos y condiciones" onClick={()=>onNavigate('terminos')} colorClass="bg-green-500" />
          <ActionCard title="Banners de la aplicación" onClick={()=>onNavigate('banners')} colorClass="bg-violet-600" />
          <ActionCard title="Solicitudes para ser vendedor" onClick={()=>onNavigate('vendedores')} colorClass="bg-orange-500" />
          <ActionCard title="Solicitudes de productos" onClick={()=>onNavigate('productos')} colorClass="bg-sky-500" />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800">Actividad reciente</h3>
          <div className="mt-3 space-y-2">
            <ActivityRow text="Juan Pérez Díaz envió una solicitud de producto." badge="Nueva solicitud" badgeClass="bg-green-100 text-green-700" />
            <ActivityRow text="Juan Pérez Díaz modificó una solicitud de producto." badge="Modificaciones realizadas" badgeClass="bg-blue-100 text-blue-700" />
            <ActivityRow text="Juan Pérez Díaz envió una solicitud de producto." badge="Rechazada" badgeClass="bg-red-100 text-red-700" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({title, value, color}:{title:string, value:string, color:string}){
  const colorMap:any = {
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    purple: 'bg-violet-50 text-violet-600'
  };
  return (
    <div className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className={`mt-2 text-2xl font-semibold ${colorMap[color]}`}>{value}</div>
      </div>
    </div>
  );
}

function ActionCard({title, onClick, colorClass}:{title:string, onClick?:any, colorClass?:string}){
  return (
    <button onClick={onClick} className={`rounded-xl p-4 text-white shadow ${colorClass} text-left`}>{title}</button>
  );
}

function ActivityRow({text, badge, badgeClass}:{text:string, badge:string, badgeClass:string}){
  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100">
      <div className="text-sm text-gray-700">{text}</div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>{badge}</div>
    </div>
  );
}

// ----------------------------
// Pantalla: TERMINOS Y CONDICIONES
// ----------------------------
function PantallaTerminos(){
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Términos y Condiciones</h2>
          <p className="text-sm text-gray-500 mt-1">Modifica o actualiza los Términos y Condiciones de la aplicación.</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white rounded-full shadow">Guardar cambios</button>
      </div>

      <div className="mt-6">
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-700 space-y-3">
          <Section title="1. Introducción">Bienvenido(a) a nuestra aplicación. Al utilizar nuestros servicios, aceptas los presentes términos y condiciones que regulan el uso de la plataforma.</Section>
          <Section title="2. Uso del servicio">El usuario se compromete a utilizar el servicio de manera responsable y conforme a la ley. Queda prohibido el uso para actividades fraudulentas.</Section>
          <Section title="3. Privacidad y datos personales">Respetamos tu privacidad. La información personal se manejará conforme a nuestra Política de Privacidad.</Section>
          <Section title="4. Responsabilidades">La empresa no se hace responsable por fallos técnicos o pérdidas de datos derivadas de causas no atribuibles a su control.</Section>
          <Section title="5. Modificaciones">Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se notificarán según corresponda.</Section>
          <Section title="6. Contacto">Equipo de soporte: soporte@ejemplo.com</Section>
        </div>
      </div>
    </section>
  );
}

function Section({title, children}:{title:string, children:React.ReactNode}){
  return (
    <div>
      <div className="text-sm font-semibold text-gray-800">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{children}</div>
    </div>
  );
}

// ----------------------------
// Pantalla: SOLICITUDES DE PRODUCTOS
// ----------------------------
function PantallaSolicitudesProductos(){
  const solicitudes = Array.from({length:12}).map((_,i)=>({
    id: i+1,
    nombre: `Nombre del producto ${i+1}`,
    vendedor: 'Juan Pérez',
    fecha: '21/11/2025',
    estado: i % 5 === 0 ? 'Rechazada' : (i % 3 === 0 ? 'Modificada' : 'Nueva')
  }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Solicitudes de Productos</h2>
          <p className="text-sm text-gray-500">Administra las solicitudes de productos hechas por los vendedores de la aplicación.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm w-72" placeholder="Buscar por nombre o vendedor"/>
          </div>
          <select className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm">
            <option>Todas las solicitudes</option>
            <option>Nuevas</option>
            <option>Modificadas</option>
            <option>Rechazadas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {solicitudes.map(s=> (
              <CardSolicitud key={s.id} data={s} />
            ))}
          </div>
        </div>
        <aside className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Solicitudes recientes</h3>
          <div className="mt-3 space-y-2">
            {solicitudes.slice(0,4).map(s=> (
              <div key={s.id} className="bg-white p-3 rounded-lg border border-gray-100 text-sm">
                <div className="font-medium">{s.nombre}</div>
                <div className="text-xs text-gray-500">Vendedor: {s.vendedor} • {s.fecha}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function CardSolicitud({data}:{data:any}){
  const colorClass = data.estado === 'Nueva' ? 'bg-green-50 text-green-700' : (data.estado === 'Modificada' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700');
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900">{data.nombre}</div>
          <div className="text-xs text-gray-500 mt-1">Vendedor: {data.vendedor}</div>
          <div className="text-xs text-gray-400 mt-1">Fecha: {data.fecha}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>{data.estado}</div>
      </div>
    </div>
  );
}

// ----------------------------
// Pantalla: SOLICITUDES DE VENDEDORES
// ----------------------------
function PantallaSolicitudesVendedores(){
  const solicitudes = Array.from({length:8}).map((_,i)=>({
    id: i+1,
    nombre: 'Marta Rodríguez',
    fecha: '21/11/2025',
    estado: i===6 ? 'Rechazada' : 'Nueva'
  }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Solicitudes de Vendedores</h2>
          <p className="text-sm text-gray-500">Administra aquí las solicitudes de prospectos para nuevos vendedores.</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative mb-4">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm w-72" placeholder="Buscar por nombre"/>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {solicitudes.map(s=> (
            <div key={s.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-sm font-medium">{s.nombre}</div>
              <div className="text-xs text-gray-500 mt-1">Fecha de creación: {s.fecha}</div>
              <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${s.estado==='Nueva' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{s.estado}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------------
// Pantalla: BANNERS DEL SISTEMA
// ----------------------------
function PantallaBanners(){
  const banners = Array.from({length:4}).map((_,i)=>({
    id: i+1,
    img: 'https://via.placeholder.com/160x60?text=Banner+'+(i+1),
    pagina: 'Inicio - 1',
    estado: 'Activo'
  }));

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Banners del Sistema</h2>
          <p className="text-sm text-gray-500">Configura los banners que se muestren en la aplicación y en la página web.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded-full border border-gray-200 bg-white text-sm">Aplicación móvil</button>
          <button className="px-3 py-1 rounded-full border border-gray-200 bg-white text-sm">Página web</button>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-100">
        <table className="w-full text-sm table-auto">
          <thead className="text-left">
            <tr>
              <th className="py-3 px-4 text-gray-500">Imagen</th>
              <th className="py-3 px-4 text-gray-500">Página y orden de aparición</th>
              <th className="py-3 px-4 text-gray-500">Estado</th>
              <th className="py-3 px-4 text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(b=> (
              <tr key={b.id} className="border-b border-gray-100">
                <td className="py-3 px-4"><img src={b.img} alt="banner" className="h-12 w-36 object-cover rounded-md"/></td>
                <td className="py-3 px-4">{b.pagina}</td>
                <td className="py-3 px-4"><span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">{b.estado}</span></td>
                <td className="py-3 px-4"><button className="px-3 py-1 rounded-full border border-gray-200 text-sm">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
