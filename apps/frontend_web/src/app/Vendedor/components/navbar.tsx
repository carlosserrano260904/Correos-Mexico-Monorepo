'use client'

import { HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import BotonNotificacion from '@/app/Vendedor/components/BotonNotificacion'



export const Navbar = () => {
  const pathName = usePathname()

  const navItems = [
    {href: '/Vendedor/app/', label: 'Resumen'},
    {href: '/Vendedor/app/Productos', label: 'Productos'},
    {href: '/Vendedor/app/Ordenes', label: 'Ordenes'},
    {href: '/Vendedor/app/Cupones', label: 'Cupones'},
    {href: '/Vendedor/app/Descuentos', label: 'Descuentos'},
  ]

  return (
    <div className='h-12 m-3 flex flex-row'>
       <div className='flex flex-row place-items-center gap-5'>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`
              rounded-sm px-1
              ${pathName === item.href ? 'bg-[#E5E7EB]' : 'hover:bg-slate-100' }
            `}>
              {item.label}
            </Link>
          ))}
       </div>
       <div className='flex flex-row place-items-center gap-3 grow justify-end'>
          <HiOutlineBell size={26} />
          <Link href={'/Perfil'}><HiOutlineUserCircle size={26} /></Link>
       </div>
    </div>
  )
}
