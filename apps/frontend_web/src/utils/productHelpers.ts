// utils/productHelpers.ts - Helpers especializados para productos

import { FrontendProduct, BackendCreateProductDto } from '@/schemas/products';

/**
 * 🎯 Helper para crear un slug único
 */
export function generateProductSlug(name: string, brand?: string): string {
  const baseName = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-')         // Espacios a guiones
    .replace(/-+/g, '-')          // Múltiples guiones a uno
    .trim();
  
  const brandSlug = brand 
    ? brand.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 3)
    : '';
  
  const timestamp = Date.now().toString().slice(-4); // Últimos 4 dígitos
  
  return `${baseName}${brandSlug ? '-' + brandSlug : ''}-${timestamp}`;
}

/**
 * 🎯 Helper para generar SKU único
 */
export function generateProductSKU(category?: string, brand?: string): string {
  const catCode = category 
    ? category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
    : 'GEN';
  
  const brandCode = brand
    ? brand.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
    : 'XXX';
  
  const timestamp = Date.now().toString().slice(-6);
  
  return `${catCode}-${brandCode}-${timestamp}`;
}

/**
 * 🎯 Helper para validar dimensiones físicas
 */
export function validateDimensions(height?: number, length?: number, width?: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (height !== undefined && height <= 0) {
    errors.push('La altura debe ser mayor a 0');
  }
  
  if (length !== undefined && length <= 0) {
    errors.push('El largo debe ser mayor a 0');
  }
  
  if (width !== undefined && width <= 0) {
    errors.push('El ancho debe ser mayor a 0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 🎯 Helper para calcular volumen y peso volumétrico
 */
export function calculateProductVolume(
  height?: number | null, 
  length?: number | null, 
  width?: number | null
): {
  volume?: number;
  volumetricWeight?: number; // kg (usando factor estándar 167)
  displayText?: string;
} {
  if (!height || !length || !width) {
    return {};
  }
  
  const volume = height * length * width; // cm³
  const volumetricWeight = volume / 5000; // Factor estándar para envíos
  
  return {
    volume,
    volumetricWeight: Math.round(volumetricWeight * 100) / 100,
    displayText: `${volume.toLocaleString()} cm³`
  };
}

/**
 * 🎯 Helper para formatear dimensiones para mostrar
 */
export function formatProductDimensions(
  height?: number | null,
  length?: number | null,
  width?: number | null,
  weight?: number | null
): {
  dimensions?: string;
  weight?: string;
  compact?: string; // "30x25x15cm, 2.5kg"
} {
  const dims = [];
  if (height) dims.push(`${height}cm`);
  if (length) dims.push(`${length}cm`);
  if (width) dims.push(`${width}cm`);
  
  const dimensionsText = dims.length === 3 ? dims.join(' × ') : undefined;
  const weightText = weight ? `${weight}kg` : undefined;
  
  const compactParts = [];
  if (dimensionsText) compactParts.push(dimensionsText);
  if (weightText) compactParts.push(weightText);
  
  return {
    dimensions: dimensionsText,
    weight: weightText,
    compact: compactParts.length > 0 ? compactParts.join(', ') : undefined
  };
}

/**
 * 🎯 Helper para crear un producto con valores por defecto inteligentes
 */
export function createProductWithDefaults(
  baseData: Partial<FrontendProduct>,
  sellerId: number
): BackendCreateProductDto {
  const slug = baseData.ProductSlug || generateProductSlug(
    baseData.ProductName || 'Producto',
    baseData.ProductBrand
  );
  
  const sku = baseData.ProductSKU || generateProductSKU(
    baseData.ProductCategory || undefined,
    baseData.ProductBrand
  );
  
  return {
    // Campos requeridos con defaults
    nombre: baseData.ProductName || 'Producto sin nombre',
    descripcion: baseData.ProductDescription || 'Sin descripción',
    precio: baseData.productPrice || 0.01,
    inventario: baseData.ProductStock || 0,
    categoria: baseData.ProductCategory || 'Sin categoría',
    color: baseData.Color || 'Sin especificar',
    marca: baseData.ProductBrand || 'Sin marca',
    slug,
    estado: baseData.ProductStatus ?? true,
    sku,
    vendedor: baseData.ProductSellerName || 'Vendedor no especificado',
    vendidos: baseData.ProductSold || 0,
    idPerfil: sellerId,
    
    // Dimensiones opcionales
    altura: baseData.ProductHeight || undefined,
    largo: baseData.ProductLength || undefined,
    ancho: baseData.ProductWidth || undefined,
    peso: baseData.ProductWeight || undefined,
  };
}

/**
 * 🎯 Helper para preparar producto para envío (calcular peso dimensional)
 */
export function calculateShippingWeight(product: FrontendProduct): {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number; // El mayor entre peso real y volumétrico
  recommendation: string;
} {
  const actualWeight = product.ProductWeight || 0;
  const volumeInfo = calculateProductVolume(
    product.ProductHeight,
    product.ProductLength,
    product.ProductWidth
  );
  
  const volumetricWeight = volumeInfo.volumetricWeight || 0;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);
  
  let recommendation = 'Complete las dimensiones para cálculo preciso';
  
  if (actualWeight > 0 && volumetricWeight > 0) {
    if (volumetricWeight > actualWeight) {
      recommendation = 'El producto ocupará más por volumen que por peso';
    } else {
      recommendation = 'El peso real determina el costo de envío';
    }
  }
  
  return {
    actualWeight,
    volumetricWeight,
    chargeableWeight,
    recommendation
  };
}

/**
 * 🎯 Helper para validar que el producto esté completo para publicación
 */
export function validateProductForPublication(product: Partial<FrontendProduct>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validaciones críticas
  if (!product.ProductName?.trim()) {
    errors.push('El nombre del producto es requerido');
  }
  
  if (!product.ProductDescription?.trim()) {
    errors.push('La descripción del producto es requerida');
  }
  
  if (!product.productPrice || product.productPrice <= 0) {
    errors.push('El precio debe ser mayor a 0');
  }
  
  if (!product.ProductStock || product.ProductStock < 0) {
    errors.push('El inventario debe ser mayor o igual a 0');
  }
  
  if (!product.ProductCategory?.trim()) {
    errors.push('La categoría es requerida');
  }
  
  if (!product.ProductBrand?.trim()) {
    errors.push('La marca es requerida');
  }
  
  if (!product.ProductImages || product.ProductImages.length === 0) {
    errors.push('Se requiere al menos una imagen');
  }
  
  // Validaciones de advertencia
  if (!product.ProductHeight && !product.ProductLength && !product.ProductWidth) {
    warnings.push('Considere agregar las dimensiones para cálculos de envío precisos');
  }
  
  if (!product.ProductWeight) {
    warnings.push('Considere agregar el peso para cálculos de envío precisos');
  }
  
  if (product.ProductStock && product.ProductStock < 5) {
    warnings.push('Inventario bajo - considere reabastecer');
  }
  
  if (product.ProductDescription && product.ProductDescription.length < 50) {
    warnings.push('La descripción es muy corta - considere agregar más detalles');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}