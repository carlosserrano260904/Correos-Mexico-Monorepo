// utils/mappers.ts - CORREGIDO PARA TU ESQUEMA REAL

import { 
  BackendProductSchema,
  BackendCreateProductSchema,
  FrontendProductSchema,
  BackendProduct,
  FrontendProduct,
  BackendCreateProductDto,
} from '@/schemas/products'

/**
 * 🔄 Backend Product -> Frontend Product - USANDO TU ESQUEMA REAL
 */
export function mapBackendToFrontend(backendProduct: unknown): FrontendProduct {
  console.log('🔍 Datos del backend recibidos:', backendProduct)
  
  try {
    // ✅ Validar con tu esquema REAL
    const validated = BackendProductSchema.parse(backendProduct)
    console.log('✅ Datos validados del backend:', validated)
    
    // ✅ USAR TU CAMPO REAL 'imagen' en lugar de 'images[0].url'
    const imageUrl = validated.imagen || 
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
    
    console.log('🖼️ URL de imagen obtenida:', imageUrl)
    
    // ✅ MAPEAR CAMPOS SEGÚN TU ESQUEMA REAL
    const frontendProduct = {
      // === CAMPOS QUE COINCIDEN ===
      ProductID: validated.id,
      ProductName: validated.nombre,
      ProductDescription: validated.descripcion,
      productPrice: validated.precio,
      ProductImageUrl: imageUrl,
      ProductCategory: validated.categoria || 'Sin categoría',
      
      // === CAMPOS QUE NECESITAN CONVERSIÓN ===
      productStockQuantity: validated.inventario, // Tu campo real
      ProductColors: validated.color ? [validated.color] : ['#000000'], // Convertir string a array
      ProductBrand: validated.marca || 'Sin marca',
      ProductWeight: validated.peso || null,
      ProductDimensions: validated.dimensiones || null,
      isActive: validated.isActive,
      
      // === CAMPOS OPCIONALES CON VALORES POR DEFECTO ===
      createdAt: validated.createdAt ? new Date(validated.createdAt) : undefined,
      updatedAt: validated.updatedAt ? new Date(validated.updatedAt) : undefined,
    }
    
    console.log('✅ Producto mapeado para frontend:', frontendProduct)
    
    // ✅ Validar resultado final con TU esquema
    return FrontendProductSchema.parse(frontendProduct)
    
  } catch (error) {
    console.error('❌ Error mapeando backend -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendProduct)
    
    throw new Error(`Error mapeando producto: ${error}`)
  }
}

/**
 * 🔄 Frontend Product -> Backend CreateProductDto  
 */
export function mapFrontendToCreateDto(frontendProduct: Partial<FrontendProduct>): BackendCreateProductDto {
  console.log('🔍 Mapeando frontend a CreateDTO:', frontendProduct)
  
  try {
    // ✅ Helper functions seguras
    const safeString = (value: string | undefined | null, fallback: string): string => {
      if (value === null || value === undefined) return fallback
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : fallback
    }
    
    const safeNumber = (value: number | undefined | null, fallback: number): number => {
      if (value === null || value === undefined) return fallback
      const num = Number(value)
      return isNaN(num) ? fallback : num
    }
    
    // ✅ MAPEAR SEGÚN TU ESQUEMA REAL
    const createDto = {
      nombre: safeString(frontendProduct.ProductName, 'Producto sin nombre'),
      descripcion: safeString(frontendProduct.ProductDescription, 'Sin descripción'),
      precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
      categoria: safeString(frontendProduct.ProductCategory, 'Sin categoría'),
      inventario: Math.max(0, Math.floor(safeNumber(frontendProduct.productStockQuantity, 0))),
      color: frontendProduct.ProductColors?.[0] || '#000000', // Tomar primer color
      marca: safeString(frontendProduct.ProductBrand, 'Sin marca'),
      peso: safeNumber(frontendProduct.ProductWeight, 0),
      dimensiones: safeString(frontendProduct.ProductDimensions, ''),
      isActive: frontendProduct.isActive ?? true,
    }
    
    console.log('✅ DTO creado para backend:', createDto)
    
    return BackendCreateProductSchema.parse(createDto)
    
  } catch (error) {
    console.error('❌ Error creando DTO:', error)
    throw new Error(`Error validando datos para crear: ${error}`)
  }
}

/**
 * 🔄 Validar array de productos del backend
 */
export function validateBackendProductsArray(products: unknown[]): FrontendProduct[] {
  console.log(`🔍 Validando ${products.length} productos del backend...`)
  
  const validProducts: FrontendProduct[] = []
  const errors: string[] = []
  
  products.forEach((product, index) => {
    try {
      console.log(`📦 Procesando producto ${index + 1}`)
      const validProduct = mapBackendToFrontend(product)
      validProducts.push(validProduct)
    } catch (error) {
      console.error(`❌ Error en producto ${index + 1}:`, error)
      errors.push(`Producto ${index + 1}: ${error}`)
    }
  })
  
  if (errors.length > 0) {
    console.warn(`⚠️ Se encontraron ${errors.length} productos con errores:`, errors)
  }
  
  console.log(`✅ ${validProducts.length} productos válidos de ${products.length} totales`)
  return validProducts
}