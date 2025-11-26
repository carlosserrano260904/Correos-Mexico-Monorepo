// utils/mappers.ts - CORREGIDO PARA TU ESTRUCTURA REAL

import { 
  BackendProductEntity,
  BackendProductEntitySchema,
  BackendCreateProductDto,
  BackendCreateProductDtoSchema,
  BackendUpdateProductDto,
  BackendUpdateProductDtoSchema,
  FrontendProduct,
  FrontendProductSchema,
} from '@/schemas/products'

/**
 * 🔄 Backend Entity -> Frontend Product - BASADO EN TU ENTIDAD REAL
 */
export function mapBackendToFrontend(backendProduct: unknown): FrontendProduct {
  console.log('🔍 Datos del backend recibidos:', backendProduct)
  
  try {
    // ✅ Validar que los datos coinciden con tu entidad REAL
    const validated = BackendProductEntitySchema.parse(backendProduct)
    console.log('✅ Datos validados del backend:', validated)
    
    // ✅ USAR IMAGES ARRAY (tu estructura real) para obtener primera imagen
    const imageUrl = validated.images?.[0]?.url || 
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
    
    console.log('🖼️ URL de imagen obtenida:', imageUrl)
    console.log('📊 Total de imágenes:', validated.images?.length || 0)
    
    // ✅ MAPEAR CAMPOS REALES + AGREGAR VALORES POR DEFECTO PARA UI
    const frontendProduct = {
      // === CAMPOS REALES DE TU BD ===
      ProductID: validated.id,
      ProductName: validated.nombre,
      ProductDescription: validated.descripcion,
      ProductImageUrl: imageUrl, // Desde images[0].url
      productPrice: validated.precio, // Ya convertido a number por Zod transform
      ProductCategory: validated.categoria || 'Sin categoría',
      
      // === CAMPOS INVENTADOS PARA UI (no existen en tu BD) ===
      ProductStock: 100, // Valor por defecto - ajusta según tu necesidad
      Color: '#000000', // Valor por defecto - ajusta según tu necesidad
      
      // === CAMPOS CALCULADOS PARA UI ===
      ProductSlug: validated.nombre.toLowerCase().replace(/\s+/g, '-'),
      ProductBrand: 'Sin marca',
      ProductSellerName: 'Tienda',
      ProductStatus: true, // Siempre disponible (ajusta según tu lógica)
      ProductSold: 0,
      
      // ✅ VARIANTS USANDO DATOS DISPONIBLES
      variants: [{
        tipo: 'Color' as const,
        valor: '#000000', // Color por defecto
        price: validated.precio, // ✅ precio ya es number
        inventario: 100, // Stock por defecto  
        sku: `SKU-${validated.id}-default`,
      }],
      
      ProductCupons: [],
    }
    
    console.log('✅ Producto mapeado para frontend:', frontendProduct)
    
    // ✅ Validar resultado final
    return FrontendProductSchema.parse(frontendProduct)
    
  } catch (error) {
    console.error('❌ Error mapeando backend -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendProduct)
    
    // Si es un ZodError, mostrar detalles específicos
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
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
    
    // ✅ MAPEAR TODOS LOS CAMPOS DISPONIBLES (ahora sí tienes inventario y color)
    const createDto = {
      nombre: safeString(frontendProduct.ProductName, 'Producto sin nombre'),
      descripcion: safeString(frontendProduct.ProductDescription, 'Sin descripción'),
      precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
      categoria: safeString(frontendProduct.ProductCategory, 'Sin categoría'),
      inventario: Math.max(0, Math.floor(safeNumber(frontendProduct.ProductStock, 0))),
      color: safeString(frontendProduct.Color, '#000000'),
      // imagen se maneja por separado en tu servicio con archivos
    }
    
    console.log('✅ DTO creado para backend:', createDto)
    
    return BackendCreateProductDtoSchema.parse(createDto)
    
  } catch (error) {
    console.error('❌ Error creando DTO:', error)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const messages = zodError.issues.map((issue: any) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ')
      throw new Error(`Validación fallida: ${messages}`)
    }
    
    throw new Error(`Error validando datos para crear: ${error}`)
  }
}

/**
 * 🔄 Frontend Product -> Backend UpdateProductDto
 */
export function mapFrontendToUpdateDto(frontendProduct: Partial<FrontendProduct>): BackendUpdateProductDto {
  console.log('🔍 Datos del frontend para actualizar:', frontendProduct)
  
  try {
    // ✅ Helper functions
    const safeString = (value: string | undefined | null): string | undefined => {
      if (value === null || value === undefined) return undefined
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    }
    
    const safeNumber = (value: number | undefined | null): number | undefined => {
      if (value === null || value === undefined) return undefined
      const num = Number(value)
      return isNaN(num) ? undefined : num
    }
    
    // ✅ SOLO INCLUIR CAMPOS QUE ESTÁN PRESENTES
    const updateDto: Partial<BackendUpdateProductDto> = {}
    
    if (frontendProduct.ProductName !== undefined) {
      const nombre = safeString(frontendProduct.ProductName)
      if (nombre) updateDto.nombre = nombre
    }
    
    if (frontendProduct.ProductDescription !== undefined) {
      const descripcion = safeString(frontendProduct.ProductDescription)
      if (descripcion) updateDto.descripcion = descripcion
    }
    
    if (frontendProduct.productPrice !== undefined) {
      const precio = safeNumber(frontendProduct.productPrice)
      if (precio !== undefined && precio > 0) updateDto.precio = precio
    }
    
    if (frontendProduct.ProductCategory !== undefined) {
      const categoria = safeString(frontendProduct.ProductCategory)
      if (categoria) updateDto.categoria = categoria
    }
    
    if (frontendProduct.ProductStock !== undefined) {
      const inventario = safeNumber(frontendProduct.ProductStock)
      if (inventario !== undefined && inventario >= 0) {
        updateDto.inventario = Math.floor(inventario)
      }
    }
    
    if (frontendProduct.Color !== undefined) {
      const color = safeString(frontendProduct.Color)
      if (color) updateDto.color = color
    }
    
    console.log('✅ DTO preparado (antes de validación Zod):', updateDto)
    
    // ✅ Solo validar si hay al menos un campo para actualizar
    if (Object.keys(updateDto).length === 0) {
      throw new Error('No hay campos válidos para actualizar')
    }
    
    const validatedDto = BackendUpdateProductDtoSchema.parse(updateDto)
    console.log('✅ DTO validado por Zod exitosamente:', validatedDto)
    
    return validatedDto
    
  } catch (error) {
    console.error('❌ Error en mapFrontendToUpdateDto:', error)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const messages = zodError.issues.map((issue: any) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ')
      throw new Error(`Validación fallida: ${messages}`)
    }
    
    throw new Error(`Error inesperado validando datos: ${String(error)}`)
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

/**
 * 🔄 Helper para manejo de errores con contexto
 */
export function handleValidationError(error: unknown, context: string): never {
  console.error(`❌ Error de validación en ${context}:`, error)
  
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any
    const details = zodError.issues.map((issue: any) => 
      `${issue.path.join('.')}: ${issue.message}`
    ).join('; ')
    throw new Error(`Error de validación en ${context}: ${details}`)
  }
  
  throw new Error(`Error de validación en ${context}: ${String(error)}`)
}