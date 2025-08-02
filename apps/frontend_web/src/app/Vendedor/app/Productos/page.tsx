'use client'
import { Plantilla } from '../../components/plantilla'
import { BtnLink } from '../../components/primitivos'
import React, { useState } from 'react'
import TableDemo from './Componentes/tableroProductos'
import { Separator } from '@/components/ui/separator'
import { useProducts } from '@/hooks/useProduct'
import { Filtros } from '../../components/filtros'
import { ProductosProps } from '../../../../types/interface'
import { ProductSheet } from './Componentes/ProductSheet'



export { ProductSheet };

export default function Productos() {
    const { Products } = useProducts()
    const [filteredProducts, setFilteredProducts] = useState<ProductosProps[]>([])

    // Sincroniza filteredProducts con Products cuando Products cambie
    React.useEffect(() => {
        setFilteredProducts(Products)
    }, [Products])
   
    // Función para recibir los productos filtrados del componente Filtros
    const handleFilteredProducts = (filtered: ProductosProps[]) => {
        setFilteredProducts(filtered)
    }

    return (
        <Plantilla title='Productos'>
            <div className='-mt-8'>
                <div className='flex place-content-end'>
                    <BtnLink link="Productos/Agregar">Crear producto</BtnLink>
                </div>
                <Separator className="my-2" />
                <div>
                    <Filtros onFilteredProducts={handleFilteredProducts} />
                </div>
                <div className='my-5'>
                    <ProductSheet product={undefined} />
                </div>
                <div className='mt-5'>
                    <TableDemo entradas={filteredProducts} />
                </div>
            </div>
        </Plantilla>
    )
}