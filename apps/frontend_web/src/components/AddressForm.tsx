// src/components/AddressForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAddress } from '@/hooks/useAddress';
import type { CreateAddressRequest, UpdateAddressRequest, FrontendAddress } from '@/schemas/address';
import { formatMexicanPhoneNumber, isValidMexicanPostalCode } from '@/schemas/address';

interface AddressFormProps {
  userId: number;
  editingAddress?: FrontendAddress | null;
  onSuccess?: (address: FrontendAddress) => void;
  onCancel?: () => void;
  className?: string;
  showCancelButton?: boolean;
}

export default function AddressForm({
  userId,
  editingAddress,
  onSuccess,
  onCancel,
  className = '',
  showCancelButton = true,
}: AddressFormProps) {
  const address = useAddress();
  
  const [formData, setFormData] = useState({
    nombre: editingAddress?.AddressName || '',
    calle: editingAddress?.Street || '',
    colonia_fraccionamiento: editingAddress?.Neighborhood || '',
    numero_interior: editingAddress?.InteriorNumber || null,
    numero_exterior: editingAddress?.ExteriorNumber || null,
    numero_celular: editingAddress?.PhoneNumber || '',
    codigo_postal: editingAddress?.PostalCode || '',
    estado: editingAddress?.State || '',
    municipio: editingAddress?.Municipality || '',
    mas_info: editingAddress?.AdditionalInfo || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when editing address changes
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        nombre: editingAddress.AddressName,
        calle: editingAddress.Street,
        colonia_fraccionamiento: editingAddress.Neighborhood,
        numero_interior: editingAddress.InteriorNumber,
        numero_exterior: editingAddress.ExteriorNumber,
        numero_celular: editingAddress.PhoneNumber,
        codigo_postal: editingAddress.PostalCode,
        estado: editingAddress.State,
        municipio: editingAddress.Municipality,
        mas_info: editingAddress.AdditionalInfo || '',
      });
    }
  }, [editingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number | null = value;
    
    // Handle numeric fields
    if (name === 'numero_interior' || name === 'numero_exterior') {
      processedValue = value ? parseInt(value) : null;
    }
    
    // Format phone number in real-time
    if (name === 'numero_celular') {
      processedValue = formatMexicanPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.calle.trim()) newErrors.calle = 'La calle es obligatoria';
    if (!formData.colonia_fraccionamiento.trim()) newErrors.colonia_fraccionamiento = 'La colonia/fraccionamiento es obligatoria';
    if (!formData.numero_celular.trim()) newErrors.numero_celular = 'El número de celular es obligatorio';
    if (!formData.codigo_postal.trim()) newErrors.codigo_postal = 'El código postal es obligatorio';
    if (!formData.estado.trim()) newErrors.estado = 'El estado es obligatorio';
    if (!formData.municipio.trim()) newErrors.municipio = 'El municipio es obligatorio';
    
    // Postal code validation
    if (formData.codigo_postal && !isValidMexicanPostalCode(formData.codigo_postal)) {
      newErrors.codigo_postal = 'El código postal debe tener 5 dígitos';
    }
    
    // Phone number validation
    if (formData.numero_celular) {
      const phoneNumbers = formData.numero_celular.replace(/\D/g, '');
      if (phoneNumbers.length < 10) {
        newErrors.numero_celular = 'El número debe tener al menos 10 dígitos';
      }
    }
    
    // Length validations
    if (formData.nombre.length > 100) newErrors.nombre = 'El nombre es muy largo (máximo 100 caracteres)';
    if (formData.calle.length > 100) newErrors.calle = 'La calle es muy larga (máximo 100 caracteres)';
    if (formData.colonia_fraccionamiento.length > 100) newErrors.colonia_fraccionamiento = 'La colonia es muy larga (máximo 100 caracteres)';
    if (formData.estado.length > 50) newErrors.estado = 'El estado es muy largo (máximo 50 caracteres)';
    if (formData.municipio.length > 100) newErrors.municipio = 'El municipio es muy largo (máximo 100 caracteres)';
    if (formData.mas_info && formData.mas_info.length > 200) newErrors.mas_info = 'La información adicional es muy larga (máximo 200 caracteres)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (editingAddress) {
        // Update existing address
        const updateData: UpdateAddressRequest = {
          nombre: formData.nombre,
          calle: formData.calle,
          colonia_fraccionamiento: formData.colonia_fraccionamiento,
          numero_interior: formData.numero_interior,
          numero_exterior: formData.numero_exterior,
          numero_celular: formData.numero_celular,
          codigo_postal: formData.codigo_postal,
          estado: formData.estado,
          municipio: formData.municipio,
          mas_info: formData.mas_info || undefined,
        };
        
        result = await address.updateAddress(editingAddress.AddressId, updateData);
      } else {
        // Create new address
        const createData: CreateAddressRequest = {
          nombre: formData.nombre,
          calle: formData.calle,
          colonia_fraccionamiento: formData.colonia_fraccionamiento,
          numero_interior: formData.numero_interior,
          numero_exterior: formData.numero_exterior,
          numero_celular: formData.numero_celular,
          codigo_postal: formData.codigo_postal,
          estado: formData.estado,
          municipio: formData.municipio,
          mas_info: formData.mas_info || undefined,
          usuarioId: userId,
        };
        
        result = await address.createAddress(createData);
      }
      
      if (result.success && result.address) {
        // Reset form
        if (!editingAddress) {
          setFormData({
            nombre: '',
            calle: '',
            colonia_fraccionamiento: '',
            numero_interior: null,
            numero_exterior: null,
            numero_celular: '',
            codigo_postal: '',
            estado: '',
            municipio: '',
            mas_info: '',
          });
        }
        
        // Call success callback
        onSuccess?.(result.address);
      } else {
        // Handle error
        console.error('Error saving address:', result.error);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
          </h2>
          <p className="text-gray-600">
            {editingAddress ? 'Modifica los datos de tu dirección' : 'Completa los datos para agregar una nueva dirección'}
          </p>
        </div>

        {/* Error global */}
        {address.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{address.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre completo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Juan Pérez García"
              maxLength={100}
            />
            {errors.nombre && <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>}
          </div>

          {/* Calle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calle *
            </label>
            <input
              type="text"
              name="calle"
              value={formData.calle}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.calle ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Av. Insurgentes Sur"
              maxLength={100}
            />
            {errors.calle && <p className="text-red-600 text-sm mt-1">{errors.calle}</p>}
          </div>

          {/* Colonia/Fraccionamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colonia/Fraccionamiento *
            </label>
            <input
              type="text"
              name="colonia_fraccionamiento"
              value={formData.colonia_fraccionamiento}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.colonia_fraccionamiento ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Roma Norte"
              maxLength={100}
            />
            {errors.colonia_fraccionamiento && <p className="text-red-600 text-sm mt-1">{errors.colonia_fraccionamiento}</p>}
          </div>

          {/* Número exterior */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número exterior
            </label>
            <input
              type="number"
              name="numero_exterior"
              value={formData.numero_exterior || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="123"
              min="1"
              max="99999"
            />
          </div>

          {/* Número interior */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número interior
            </label>
            <input
              type="number"
              name="numero_interior"
              value={formData.numero_interior || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="201"
              min="1"
              max="9999"
            />
          </div>

          {/* Código postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código postal *
            </label>
            <input
              type="text"
              name="codigo_postal"
              value={formData.codigo_postal}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.codigo_postal ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="06700"
              maxLength={5}
              pattern="\d{5}"
            />
            {errors.codigo_postal && <p className="text-red-600 text-sm mt-1">{errors.codigo_postal}</p>}
          </div>

          {/* Número de celular */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de celular *
            </label>
            <input
              type="tel"
              name="numero_celular"
              value={formData.numero_celular}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.numero_celular ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
              maxLength={20}
            />
            {errors.numero_celular && <p className="text-red-600 text-sm mt-1">{errors.numero_celular}</p>}
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.estado ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Ciudad de México"
              maxLength={50}
            />
            {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado}</p>}
          </div>

          {/* Municipio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio *
            </label>
            <input
              type="text"
              name="municipio"
              value={formData.municipio}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.municipio ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Cuauhtémoc"
              maxLength={100}
            />
            {errors.municipio && <p className="text-red-600 text-sm mt-1">{errors.municipio}</p>}
          </div>

          {/* Información adicional */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información adicional
            </label>
            <textarea
              name="mas_info"
              value={formData.mas_info}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
                errors.mas_info ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Referencias adicionales, instrucciones de entrega, etc."
              maxLength={200}
            />
            {errors.mas_info && <p className="text-red-600 text-sm mt-1">{errors.mas_info}</p>}
            <p className="text-gray-500 text-sm mt-1">
              {formData.mas_info.length}/200 caracteres
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {showCancelButton && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || address.loading}
            className="px-8 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : editingAddress ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}