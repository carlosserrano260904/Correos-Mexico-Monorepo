// utils/variantMapper.ts - Mapper para convertir variantes a estructura del backend

import { FrontendProduct, BackendCreateProductDto } from '@/schemas/products';
import { createProductWithDefaults } from './productHelpers';

export interface VariantData {
  tipo: 'Color' | 'Talla';
  price: number;
  valor: string;
  inventario: number;
  sku: string;
  image?: File; // Imagen específica de esta variante
}

export interface FormularioData {
  ProductName: string;
  ProductDescription: string;
  productPrice: number;
  ProductSlug: string;
  ProductBrand: string;
  ProductCategory: string;
  variants: VariantData[];
}

/**
 * 🎯 Convierte datos del formulario con variantes a estructura del backend
 */
export function mapVariantsToBackendProduct(
  formData: FormularioData,
  variantImages: Map<number, File>, // Mapa de índice de variante -> archivo
  sellerId: number
): {
  productDto: BackendCreateProductDto;
  imageFiles: File[];
  variantInfo: {
    totalStock: number;
    primaryColor: string;
    consolidatedSKU: string;
    variantSummary: string;
  };
} {
  console.log('🔄 Mapeando variantes a producto del backend...');
  console.log('📊 Variantes encontradas:', formData.variants.length);
  console.log('🖼️ Imágenes por variante:', variantImages.size);
  
  // === CONSOLIDAR INFORMACIÓN DE VARIANTES ===
  const totalStock = formData.variants.reduce((sum, variant) => sum + variant.inventario, 0);
  
  // Obtener color principal (primera variante de color con valor)
  const primaryColorVariant = formData.variants.find(v => v.tipo === 'Color' && v.valor.trim() !== '');
  const primaryColor = primaryColorVariant?.valor || '#000000';
  
  // Crear SKU consolidado
  const consolidatedSKU = generateConsolidatedSKU(formData, formData.variants);
  
  // Crear resumen de variantes para descripción
  const variantSummary = createVariantSummary(formData.variants);
  
  // === CONSOLIDAR DESCRIPCIÓN ===
  const enhancedDescription = formData.ProductDescription + 
    (variantSummary ? `\n\nVariantes disponibles: ${variantSummary}` : '');
  
  // === RECOPILAR IMÁGENES ===
  const imageFiles: File[] = [];
  formData.variants.forEach((variant, index) => {
    const image = variantImages.get(index);
    if (image) {
      // Renombrar archivo para incluir info de variante
      const renamedFile = new File(
        [image],
        `${formData.ProductName}-${variant.tipo}-${variant.valor}.${image.name.split('.').pop()}`,
        { type: image.type }
      );
      imageFiles.push(renamedFile);
    }
  });
  
  // === CREAR ESTRUCTURA BASE DEL PRODUCTO ===
  const baseProduct: Omit<FrontendProduct, 'ProductID'> = {
    ProductName: formData.ProductName,
    ProductDescription: enhancedDescription,
    productPrice: formData.productPrice,
    ProductCategory: formData.ProductCategory,
    ProductBrand: formData.ProductBrand,
    ProductSlug: formData.ProductSlug,
    ProductStock: totalStock,
    Color: primaryColor,
    ProductImageUrl: '', // Se asignará por el backend
    ProductImages: [],
    ProductStatus: true,
    ProductSellerName: 'Vendedor', // Se puede personalizar
    ProductSold: 0,
    ProductSKU: consolidatedSKU,
    ProductCupons: [],
    
    // Nuevos campos (opcionales)
    ProductHeight: undefined,
    ProductLength: undefined,
    ProductWidth: undefined,
    ProductWeight: undefined,
    ProductSellerId: sellerId,
    ProductVolume: undefined,
    ProductDimensions: undefined,
    ProductWeightDisplay: undefined,
  };
  
  // === CONVERTIR A DTO DEL BACKEND ===
  const productDto = createProductWithDefaults(baseProduct, sellerId);
  
  console.log('✅ Mapeo completado:');
  console.log(`   - Stock total: ${totalStock}`);
  console.log(`   - Color principal: ${primaryColor}`);
  console.log(`   - Imágenes: ${imageFiles.length}`);
  console.log(`   - SKU: ${consolidatedSKU}`);
  
  return {
    productDto,
    imageFiles,
    variantInfo: {
      totalStock,
      primaryColor,
      consolidatedSKU,
      variantSummary
    }
  };
}

/**
 * 🎯 Genera un SKU consolidado basado en las variantes
 */
function generateConsolidatedSKU(formData: FormularioData, variants: VariantData[]): string {
  const namePrefix = formData.ProductName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
  const brandPrefix = formData.ProductBrand.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, 'X');
  
  // Crear código de variantes
  const colorVariants = variants.filter(v => v.tipo === 'Color' && v.valor);
  const sizeVariants = variants.filter(v => v.tipo === 'Talla' && v.valor);
  
  let variantCode = '';
  if (colorVariants.length > 0) {
    variantCode += `C${colorVariants.length}`;
  }
  if (sizeVariants.length > 0) {
    variantCode += `T${sizeVariants.length}`;
  }
  if (!variantCode) {
    variantCode = 'V1';
  }
  
  const timestamp = Date.now().toString().slice(-4);
  
  return `${namePrefix}-${brandPrefix}-${variantCode}-${timestamp}`;
}

/**
 * 🎯 Crea un resumen textual de las variantes
 */
function createVariantSummary(variants: VariantData[]): string {
  const colorVariants = variants
    .filter(v => v.tipo === 'Color' && v.valor.trim() !== '')
    .map(v => v.valor);
    
  const sizeVariants = variants
    .filter(v => v.tipo === 'Talla' && v.valor.trim() !== '')
    .map(v => v.valor);
  
  const summaryParts = [];
  
  if (colorVariants.length > 0) {
    summaryParts.push(`Colores: ${colorVariants.join(', ')}`);
  }
  
  if (sizeVariants.length > 0) {
    summaryParts.push(`Tallas: ${sizeVariants.join(', ')}`);
  }
  
  return summaryParts.join(' | ');
}

/**
 * 🎯 Valida que las variantes estén completas
 */
export function validateVariants(variants: VariantData[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (variants.length === 0) {
    errors.push('Se requiere al menos una variante');
    return { isValid: false, errors, warnings };
  }
  
  variants.forEach((variant, index) => {
    const variantNumber = index + 1;
    
    // Validaciones críticas
    if (!variant.valor.trim()) {
      errors.push(`Variante ${variantNumber}: El valor es requerido`);
    }
    
    if (variant.inventario <= 0) {
      errors.push(`Variante ${variantNumber}: El inventario debe ser mayor a 0`);
    }
    
    // Validaciones de advertencia
    if (variant.price <= 0 && variant.price !== 0) {
      warnings.push(`Variante ${variantNumber}: Precio no establecido`);
    }
    
    if (!variant.sku.trim()) {
      warnings.push(`Variante ${variantNumber}: SKU no generado`);
    }
  });
  
  // Verificar duplicados
  const valores = variants.map(v => `${v.tipo}-${v.valor}`);
  const duplicados = valores.filter((valor, index) => 
    valores.indexOf(valor) !== index && valor !== 'Color-' && valor !== 'Talla-'
  );
  
  if (duplicados.length > 0) {
    errors.push('Se encontraron variantes duplicadas');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 🎯 Helper para crear un mapa de imágenes por variante
 */
export function createVariantImageMap(
  variants: VariantData[],
  files: FileList | File[]
): Map<number, File> {
  const imageMap = new Map<number, File>();
  
  const fileArray = Array.isArray(files) ? files : Array.from(files);
  
  // Asignar archivos a variantes (uno a uno)
  variants.forEach((variant, index) => {
    if (index < fileArray.length) {
      imageMap.set(index, fileArray[index]);
    }
  });
  
  return imageMap;
}

/**
 * 🎯 Helper para manejar múltiples archivos de imagen
 */
export function processVariantImages(
  variants: VariantData[],
  imageFiles: File[]
): {
  processedImages: File[];
  imageMap: Map<number, File>;
  summary: string;
} {
  const imageMap = new Map<number, File>();
  const processedImages: File[] = [];
  
  // Asignar imágenes a variantes
  imageFiles.forEach((file, index) => {
    if (index < variants.length) {
      const variant = variants[index];
      
      // Crear nombre descriptivo
      const extension = file.name.split('.').pop();
      const descriptiveName = `${variant.tipo}-${variant.valor}.${extension}`;
      
      const renamedFile = new File([file], descriptiveName, { type: file.type });
      
      imageMap.set(index, renamedFile);
      processedImages.push(renamedFile);
    }
  });
  
  const summary = `${processedImages.length} imágenes procesadas para ${variants.length} variantes`;
  
  return {
    processedImages,
    imageMap,
    summary
  };
}