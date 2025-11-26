'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useProducts } from '../../../hooks/useProduct'
import { useCupons } from '../../../hooks/useCupons'
import { CuponProps } from '../../../types/interface'
import { ProductosProps } from '@/types'
import { IoSearchOutline, IoCloseCircleOutline } from "react-icons/io5";

interface FiltrosProps {
  onFilteredProducts?: (filteredProducts: ProductosProps[]) => void;
  onFilteredCupons?: (filteredCupons: CuponProps[]) => void;
  type?: 'productos' | 'cupones';
}

export const Filtros = ({ onFilteredProducts, onFilteredCupons, type }: FiltrosProps) => {
  // CAMBIO 1: Renombramos al desestructurar. El hook devuelve 'products' (minúscula), 
  // pero tu código usa 'Products' (mayúscula). Usamos alias { products: Products }.
  const { products: Products } = useProducts()
  
  // Asumiendo que Cupons está bien, si te da error similar, revisa si el hook devuelve 'cupons' o 'Cupons'
  const { Cupons } = useCupons()
 
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const filterType = type || (onFilteredCupons ? 'cupones' : 'productos')
  
  const categories = useMemo(() => {
    if (filterType !== 'productos' || !Products) return []
    
    // CAMBIO 2: Lógica de categorías segura. 
    // Filtramos primero para asegurar que solo pasen strings válidos y no nulos.
    // Esto arregla el error de "trim does not exist on type {}" y los errores de "unknown" en el select.
    const validCategories = Products
      .map(p => p.ProductCategory)
      .filter((c): c is string => typeof c === 'string' && c.trim() !== '');

    return [...new Set(validCategories)];
  }, [Products, filterType])
  
  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (filterType !== 'productos' || !Products) return []
    
    return Products.filter((product) => {
      const matchesName = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.ProductCategory === selectedCategory
      
      // CORRECCIÓN AQUÍ:
      // TypeScript no ve 'ProductStatus' en tu tipo 'ProductosProps'.
      // Usamos '(product as any)' para acceder a la propiedad sin que marque error.
      const status = (product as any).ProductStatus;

      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'true' && status === true) ||
        (selectedStatus === 'false' && status === false)
      
      return matchesName && matchesCategory && matchesStatus
    })
  }, [Products, searchTerm, selectedCategory, selectedStatus, filterType])

  // Filtrar cupones
  const filteredCupons = useMemo(() => {
    if (filterType !== 'cupones' || !Cupons) return []
    
    return Cupons.filter(cupon => {
      const matchesName = cupon.CuponCode.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = selectedStatus === 'all' || 
        cupon.CuponStatus.toString() === selectedStatus
      
      return matchesName && matchesStatus
    })
  }, [Cupons, searchTerm, selectedStatus, filterType])
  
  useEffect(() => {
    if (filterType === 'productos' && onFilteredProducts) {
      onFilteredProducts(filteredProducts)
    } else if (filterType === 'cupones' && onFilteredCupons) {
      onFilteredCupons(filteredCupons)
    }
  }, [filteredProducts, filteredCupons, onFilteredProducts, onFilteredCupons, filterType])
  
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="flex gap-2.5 items-center flex-wrap">
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IoSearchOutline className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={filterType === 'cupones' ? 'Código del cupón...' : 'Nombre del producto...'}
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Select de categorías */}
      {filterType === 'productos' && (
        <div className="">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {/* Como categories ahora es string[], ya no dará error de unknown */}
            {categories.map((category) => (
              <option key={`category-${category}`} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Select de status */}
      <div className="">
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="all">Todos los status</option>
          {filterType === 'productos' ? (
            <>
              <option value="true">Activo</option>
              <option value="false">Archivado</option>
            </>
          ) : (
            <>
              <option value="1">Activo</option>
              <option value="2">Borrado</option>
              <option value="3">Caducado</option>
            </>
          )}
        </select>
      </div>

      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Limpiar filtros"
        >
          <IoCloseCircleOutline className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}