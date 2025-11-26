'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useProducts } from '../../../hooks/useProduct'
import { useCupons } from '../../../hooks/useCupons'
import { CuponProps } from '../../../types/interface'
import { ProductosProps } from '@/types'
import { IoSearchOutline } from "react-icons/io5";

interface FiltrosProps {
  onFilteredProducts?: (filteredProducts: any[]) => void;  // ← SOLUCIÓN TEMPORAL
  onFilteredCupons?: (filteredCupons: any[]) => void;
  type?: 'productos' | 'cupones';
}

export const Filtros = ({ onFilteredProducts, onFilteredCupons, type }: FiltrosProps) => {
  const { Products } = useProducts()
  const { Cupons } = useCupons()
 
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const filterType = type || (onFilteredCupons ? 'cupones' : 'productos')
  
  const categories = useMemo(() => {
    if (filterType !== 'productos') return []
    const uniqueCategories = [...new Set(Products.map(product => product.ProductCategory))]
    return uniqueCategories.filter(category => category && category.trim() !== '')
  }, [Products, filterType])
  
  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (filterType !== 'productos') return []
    
    return Products.filter(product => {
      // Filtro por nombre
      const matchesName = product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
     
      // Filtro por categoría
      const matchesCategory = selectedCategory === 'all' || product.ProductCategory === selectedCategory
     
      // Filtro por status (boolean)
      const matchesStatus = selectedStatus === 'all' ||
        (selectedStatus === 'true' && product.ProductStatus === true) ||
        (selectedStatus === 'false' && product.ProductStatus === false)
     
      return matchesName && matchesCategory && matchesStatus
    })
  }, [Products, searchTerm, selectedCategory, selectedStatus, filterType])

  // Filtrar cupones
  const filteredCupons = useMemo(() => {
    if (filterType !== 'cupones') return []
    
    return Cupons.filter(cupon => {
      // Filtro por código del cupón
      const matchesName = cupon.CuponCode.toLowerCase().includes(searchTerm.toLowerCase())
     
      // Filtro por status (número)
      const matchesStatus = selectedStatus === 'all' || 
        cupon.CuponStatus.toString() === selectedStatus
     
      return matchesName && matchesStatus
    })
  }, [Cupons, searchTerm, selectedStatus, filterType])
  
  // Comunicar productos/cupones filtrados al componente padre
  useEffect(() => {
    if (filterType === 'productos' && onFilteredProducts) {
      onFilteredProducts(filteredProducts as ProductosProps[])
    } else if (filterType === 'cupones' && onFilteredCupons) {
      onFilteredCupons(filteredCupons)
    }
  }, [filteredProducts, filteredCupons, onFilteredProducts, onFilteredCupons, filterType])
  
  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedStatus('all')
  }

  return (
    <div className="flex gap-2.5">
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

      {/* Select de categorías (solo para productos) */}
      {filterType === 'productos' && (
        <div className="">
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
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
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  )
}