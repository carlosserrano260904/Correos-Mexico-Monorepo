'use client'

import { HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const Navbar = () => {
  const pathName = usePathname()

  const navItems = [
    {href: '/Administrador/app/Resumen', label: 'Resumen'},
    {href: '/Administrador/app/Conductores', label: 'Conductores'},
    {href: '/Administrador/app/Sucursales', label: 'Sucursales'},
    {href: '/Administrador/app/Unidades', label: 'Unidades'},
  ]

  return (
    <div className='h-12 flex flex-row bg-gray-100 px-3 py-3'>
       <div className='flex flex-row place-items-center gap-5'>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`
              rounded-sm px-1 text-gray-700 font-medium
              ${pathName === item.href ? 'bg-[#E5E7EB]' : 'hover:bg-slate-100' }
            `}>
              {item.label}
            </Link>
          ))}
       </div>
       <div className='flex flex-row place-items-center gap-3 grow justify-end'>
          <HiOutlineBell size={26} className="text-gray-600 hover:text-gray-800 cursor-pointer" />
          <Link href={'/Perfil'}>
            <HiOutlineUserCircle size={26} className="text-gray-600 hover:text-gray-800" />
          </Link>
       </div>
    </div>
  )
}
