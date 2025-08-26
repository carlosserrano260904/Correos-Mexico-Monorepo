// VariantPreview.tsx - Componente para mostrar resumen de variantes

import React from 'react';
import { type FormularioData } from '@/utils/variantMapper';

interface VariantPreviewProps {
  formData: FormularioData;
  variantImages: Map<number, File>;
}

export const VariantPreview: React.FC<VariantPreviewProps> = ({ 
  formData, 
  variantImages 
}) => {
  const totalStock = formData.variants.reduce((sum, variant) => sum + variant.inventario, 0);
  const primaryColor = formData.variants.find(v => v.tipo === 'Color' && v.valor)?.valor;
  const hasImages = variantImages.size > 0;
  
  const colorVariants = formData.variants.filter(v => v.tipo === 'Color' && v.valor.trim() !== '');
  const sizeVariants = formData.variants.filter(v => v.tipo === 'Talla' && v.valor.trim() !== '');
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-blue-900 mb-3">
        📊 Resumen del Producto
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Stock Total:</span>
          <span className="ml-2 font-medium">{totalStock} unidades</span>
        </div>
        
        <div>
          <span className="text-gray-600">Variantes:</span>
          <span className="ml-2 font-medium">{formData.variants.length}</span>
        </div>
        
        {primaryColor && (
          <div>
            <span className="text-gray-600">Color Principal:</span>
            <div className="ml-2 inline-flex items-center">
              <div 
                className="w-4 h-4 border border-gray-300 rounded mr-2"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="font-medium">{primaryColor}</span>
            </div>
          </div>
        )}
        
        <div>
          <span className="text-gray-600">Imágenes:</span>
          <span className="ml-2 font-medium">
            {hasImages ? `${variantImages.size} subidas` : 'Ninguna'}
          </span>
        </div>
      </div>
      
      {(colorVariants.length > 0 || sizeVariants.length > 0) && (
        <div className="mt-4 pt-3 border-t border-blue-200">
          {colorVariants.length > 0 && (
            <div className="mb-2">
              <span className="text-xs font-medium text-gray-600">Colores: </span>
              <span className="text-xs text-gray-800">
                {colorVariants.map(v => v.valor).join(', ')}
              </span>
            </div>
          )}
          
          {sizeVariants.length > 0 && (
            <div>
              <span className="text-xs font-medium text-gray-600">Tallas: </span>
              <span className="text-xs text-gray-800">
                {sizeVariants.map(v => v.valor).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-blue-700">
        💡 Cada variante puede tener su propia imagen. El backend recibirá todas las imágenes como un array.
      </div>
    </div>
  );
};