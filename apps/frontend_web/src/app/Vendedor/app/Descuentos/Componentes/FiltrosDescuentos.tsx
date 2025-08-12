'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { useDescuentos } from '../../../../../hooks/useDescuentos'
import { DescuentoProps } from '../../../../../types/interface'
import { IoSearchOutline } from "react-icons/io5";

interface FiltrosDescuentosProps {
  onFilteredDescuentos: (filteredDescuentos: DescuentoProps[]) => void;
}

export const FiltrosDescuentos = ({ onFilteredDescuentos }: FiltrosDescuentosProps) => {
  const { Descuentos } = useDescuentos()
 
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  // Filtrar descuentos
  const filteredDescuentos = useMemo(() => {
    return Descuentos.filter(descuento => {
      // Filtro por nombre del descuento
      const matchesName = descuento.DescuentoName.toLowerCase().includes(searchTerm.toLowerCase())
     
      // Filtro por status (número)
      const matchesStatus = selectedStatus === 'all' || 
        descuento.DescuentoStatus.toString() === selectedStatus
     
      return matchesName && matchesStatus
    })
  }, [Descuentos, searchTerm, selectedStatus])
  
  // Comunicar descuentos filtrados al componente padre
  useEffect(() => {
    onFilteredDescuentos(filteredDescuentos)
  }, [filteredDescuentos, onFilteredDescuentos])
  
  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('')
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
          placeholder="Nombre del descuento..."
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Select de status */}
      <div className="">
        <select
          id="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos los status</option>
          <option value="1">Activo</option>
          <option value="2">Borrado</option>
          <option value="3">Caducado</option>
        </select>
      </div>
    </div>
  )
}
