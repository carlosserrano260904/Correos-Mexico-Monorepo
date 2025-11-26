import React from 'react'
import { Navbar } from './navbar';
import { Title } from './primitivos';

export const Plantilla = ({children, title}: Readonly<{children: React.ReactNode, title:string;}>) => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar/>
      <div className='min-h-screen bg-white rounded-xl border border-[#E5E7EB] px-20 py-3 pt-9 m-2'>
        <Title>{title}</Title>
        {children}
      </div>
    </div>
  ) 
}
