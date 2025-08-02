import React from 'react';
import { IconType } from 'react-icons/lib';

interface notificacionesProps{
    Icono: IconType;   
    nombreIcono: string;
    titulo: string;
    subtitulo: string;
    tiempo: string;
    descripcion: string;
    className?: string; 
}

export const TarjetaNotificacion = ({
    Icono,
    nombreIcono,
    titulo,
    subtitulo,
    tiempo,
    descripcion, 
    className,

}: notificacionesProps) => {
    return(
        <div className='flex flex-row bg-white py-[15px] px-[11px] gap-[15px]'> 
            <div className='flex flex-col justify-center items-center w-10 h-10 p-1 border border-solid rounded-[10px]  bg-white '>
                <Icono className=' w-6 h-6'/>
            </div>
            <div className=' flex flex-col bg-white gap-[10px]'>
                <div className='flex flex-col gap-[5px]'>
                    <div className='flex flex-row items-center gap-[10px] bg-white'>
                        <h1 className='font-serif text-[16px] text-[#374151] font-[400px]'>{titulo}</h1>
                        <div className=' bg-[#374151] rounded-[10px] w-[4px] h-[4px]' ></div>
                        <h2 className=' flex flex-col font-serif text-[12px] text-[#374151] font-[400px] justify-center h-auto'>{subtitulo}</h2>
                    </div>
                    <div>
                        <h3 className='font-serif text-[12px] text-[#6B7280] font-[500px]'>{tiempo}</h3>
                    </div>
                </div>
                <p className='font-serif text-[14px] text-[#6B7280] font-normal '>{descripcion}</p>
            </div>
        </div>
    );
};


