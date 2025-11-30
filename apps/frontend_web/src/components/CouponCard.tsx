import React from 'react';

// Tipos de variantes para los colores
export type CouponVariant = 'purple' | 'green' | 'orange';

interface CouponProps {
  code: string;           // Ej: EX806
  name: string;           // Ej: Tech15
  discountText: string;   // Ej: Descuento del 20%...
  expirationDate: string; // Ej: 24/10/2025
  variant: CouponVariant; 
  statusLabel: string;    // Ej: Activo, Expirado
  statusColor: 'green' | 'red'; // Color de la etiqueta de estado
}

export const CouponCard: React.FC<CouponProps> = ({
  code,
  name,
  discountText,
  expirationDate,
  variant,
  statusLabel,
  statusColor,
}) => {
  
  // Configuración de estilos según la variante (Borde izquierdo y Color del título secundario)
  const variantStyles = {
    purple: {
      border: 'border-l-purple-600',
      text: 'text-purple-600',
    },
    green: {
      border: 'border-l-green-500',
      text: 'text-green-500',
    },
    orange: {
      border: 'border-l-orange-400',
      text: 'text-orange-400',
    },
  };

  // Configuración de estilos para la etiqueta de estado (Badge)
  const statusStyles = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  const currentStyle = variantStyles[variant];

  return (
    <div className={`relative bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 ${currentStyle.border} p-5 flex flex-col justify-between h-full`}>
      
      {/* Header de la tarjeta */}
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xl font-bold text-gray-800">{code}</h3>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusStyles[statusColor]}`}>
            • {statusLabel}
          </span>
        </div>
        
        {/* Subtítulo con color dinámico */}
        <h4 className={`text-md font-bold mb-2 ${currentStyle.text}`}>
          {name}
        </h4>

        {/* Descripción con la parte del porcentaje en negrita (simulado visualmente) */}
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {discountText}
        </p>
      </div>

      {/* Separador punteado y Footer */}
      <div>
        {/* Línea punteada */}
        <div className="border-t-2 border-dashed border-gray-200 my-3 w-full" />
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-medium">Vencimiento</span>
          <span className="text-gray-800 font-bold">{expirationDate}</span>
        </div>
      </div>
    </div>
  );
};