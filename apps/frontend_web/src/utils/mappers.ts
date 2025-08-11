// ✅ ASEGÚRATE DE TENER ESTOS IMPORTS AL INICIO DEL ARCHIVO
import { 
  BackendProductEntity,
  BackendProductEntitySchema,
  BackendCreateProductDto,
  BackendCreateProductDtoSchema,
  BackendUpdateProductDto,        // ← ASEGÚRATE DE QUE ESTE ESTÉ IMPORTADO
  BackendUpdateProductDtoSchema,  // ← Y ESTE TAMBIÉN
  FrontendProduct,
  FrontendProductSchema,
} from '@/schemas/products'

/**
 * 🔄 Backend Entity -> Frontend Product
 * Convierte la respuesta de tu BD al formato que usa tu UI
 */
export function mapBackendToFrontend(backendProduct: unknown): FrontendProduct {
  console.log('🔍 Datos del backend recibidos:', backendProduct)
  
  try {
    // Validar que los datos coinciden con tu Product Entity
    const validated = BackendProductEntitySchema.parse(backendProduct)
    console.log('✅ Datos validados del backend:', validated)
    
    // Mapear campos exactos + agregar campos extra para UI
    const frontendProduct = {
      // === CAMPOS REALES DE TU BD (mapeados) ===
      ProductID: validated.id,
      ProductName: validated.nombre,
      ProductDescription: validated.descripcion,
      ProductImageUrl: validated.imagen || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
      ProductStock: validated.inventario,
      productPrice: validated.precio,
      ProductCategory: validated.categoria || 'Sin categoría',
      Color: validated.color,
      
      // === CAMPOS EXTRA SOLO PARA UI ===
      ProductSlug: validated.nombre.toLowerCase().replace(/\s+/g, '-'),
      ProductBrand: 'Sin marca',
      ProductSellerName: 'Tienda',
      ProductStatus: validated.inventario > 0,
      ProductSold: 0,
      
      // ✅ VARIANTS COMPATIBLE con CarrouselProducts
      variants: validated.color ? [{
        tipo: 'Color' as const,
        price: validated.precio, // ← price (no precio)
        valor: validated.color,
        inventario: validated.inventario,
        sku: `SKU-${validated.id}-${validated.color}`, // ← agregar sku
      }] : [],
      
      ProductCupons: [],
    }
    
    console.log('✅ Producto mapeado para frontend:', frontendProduct)
    
    // Validar resultado final
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
 * Convierte los datos del formulario al formato que espera tu CreateProductDto
 */
/**
 * 🔄 Frontend Product -> Backend CreateProductDto CORREGIDA 
 * Convierte los datos del formulario al formato que espera tu CreateProductDto
 */
export function mapFrontendToCreateDto(frontendProduct: Partial<FrontendProduct>): BackendCreateProductDto {
  console.log('🔍 Mapeando frontend a CreateDTO:', frontendProduct)
  
  try {
    // ✅ HELPER FUNCTION para strings seguros - VERSIÓN CORREGIDA
    const safeString = (value: string | undefined | null, fallback: string): string => {
      // Primero verificar si value existe y no es null/undefined
      if (value === null || value === undefined) {
        return fallback
      }
      
      // Luego verificar si después de trim tiene contenido
      const trimmedValue = value.trim()
      return trimmedValue.length > 0 ? trimmedValue : fallback
    }
    
    // ✅ HELPER FUNCTION para números seguros - VERSIÓN CORREGIDA
    const safeNumber = (value: number | undefined | null, fallback: number): number => {
      // Verificar si el valor es null o undefined
      if (value === null || value === undefined) {
        return fallback
      }
      
      const num = Number(value)
      return isNaN(num) ? fallback : num
    }
    
    const createDto = {
      // Mapear campos del frontend a los nombres que espera el backend
      nombre: safeString(frontendProduct.ProductName, ''),
      descripcion: safeString(frontendProduct.ProductDescription, ''),
      inventario: Math.max(0, safeNumber(frontendProduct.ProductStock, 0)),
      precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
      categoria: safeString(frontendProduct.ProductCategory, ''),
      color: safeString(frontendProduct.Color, '#000000'),
      // imagen NO va aquí cuando no hay archivo
    }
    
    console.log('✅ DTO creado para backend:', createDto)
    
    // Validar que coincide con tu CreateProductDto
    return BackendCreateProductDtoSchema.parse(createDto)
    
  } catch (error) {
    console.error('❌ Error creando DTO:', error)
    throw new Error(`Error validando datos para crear: ${error}`)
  }
}

/**
 * 🔄 Frontend Product -> Backend UpdateProductDto SEGURO PARA TYPESCRIPT
 * Convierte los datos del formulario al formato que espera tu UpdateProductDto
 */
export function mapFrontendToUpdateDto(frontendProduct: Partial<FrontendProduct>): BackendUpdateProductDto {
  console.log('🔍 Datos del frontend para actualizar:', frontendProduct)
  
  try {
  // ✅ HELPER FUNCTION para strings seguros - VERSIÓN CORREGIDA
  const safeString = (value: string | undefined | null, fallback: string): string => {
    // Primero verificar si value existe y no es null/undefined
    if (value === null || value === undefined) {
      return fallback
    }
    
    // Luego verificar si después de trim tiene contenido
    const trimmedValue = value.trim()
    return trimmedValue.length > 0 ? trimmedValue : fallback
  }
  
  // ✅ HELPER FUNCTION para números seguros - VERSIÓN CORREGIDA
  const safeNumber = (value: number | undefined | null, fallback: number): number => {
    // Verificar si el valor es null o undefined
    if (value === null || value === undefined) {
      return fallback
    }
    
    const num = Number(value)
    return isNaN(num) ? fallback : num
  }
  
  // ✅ PREPARAR DATOS con validaciones TypeScript-safe
  const updateDto = {
    // Nombre: obligatorio, mínimo 1 carácter
    nombre: safeString(frontendProduct.ProductName, 'Producto sin nombre'),
    
    // Descripción: obligatorio, mínimo 1 carácter  
    descripcion: safeString(frontendProduct.ProductDescription, 'Sin descripción'),
    
    // Imagen: obligatorio, mínimo 1 carácter
    imagen: safeString(
      frontendProduct.ProductImageUrl, 
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
    ),
    
    // Inventario: debe ser número válido >= 0
    inventario: Math.max(0, Math.floor(safeNumber(frontendProduct.ProductStock, 0))),
    
    // Precio: debe ser número válido > 0
    precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
    
    // Categoría: obligatorio, mínimo 1 carácter
    categoria: safeString(frontendProduct.ProductCategory, 'Sin categoría'),
    
    // Color: obligatorio, mínimo 1 carácter  
    color: safeString(frontendProduct.Color, '#000000'),
  }
  
  console.log('✅ DTO preparado (antes de validación Zod):', updateDto)
  
  // ✅ VALIDAR con tu schema Zod exacto
  const validatedDto = BackendUpdateProductDtoSchema.parse(updateDto)
  console.log('✅ DTO validado por Zod exitosamente:', validatedDto)
  
  return validatedDto
  
} catch (error) {
  console.error('❌ Error en mapFrontendToUpdateDto:', error)
  
  // ✅ MANEJO MEJORADO DE ERRORES ZOD
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as any
    console.error('❌ Errores específicos de Zod:', zodError.issues)
    
    // Crear mensaje más legible
    const messages = zodError.issues.map((issue: any) => {
      const field = issue.path.join('.')
      const message = issue.message
      return `${field}: ${message}`
    }).join('; ')
    
    throw new Error(`Validación fallida: ${messages}`)
  }
  
  // Si es error manual
  if (error instanceof Error) {
    throw error
  }
  
  throw new Error(`Error inesperado validando datos: ${String(error)}`)
}
}

/**
 * 🔄 Validar array de productos del backend
 */
export function validateBackendProductsArray(products: unknown[]): FrontendProduct[] {
  console.log(`🔍 Validando ${products.length} productos del backend...`)
  
  return products.map((product, index) => {
    console.log(`📦 Procesando producto ${index + 1}`)
    return mapBackendToFrontend(product)
  })
}

/**
 * 🔄 Manejo de errores con contexto
 */
export function handleValidationError(error: unknown, context: string): never {
  console.error(`❌ Error de validación en ${context}:`, error)
  throw new Error(`Error de validación en ${context}`)
}