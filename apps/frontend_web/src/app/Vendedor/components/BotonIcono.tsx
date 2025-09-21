import React from 'react';
import { IconType } from 'react-icons/lib';



interface BotonesProps{
    Icono: IconType,
    titulo?: string,
    className: string,
    imgURL?: string,
}

export const Boton = ({
    Icono,
    titulo,
    className,
    imgURL, 

}: BotonesProps) => {
    return(
        <div className=' '>
            <p>{titulo}</p>
            <Icono className='size-[20px]'/>
        </div>

    );
}