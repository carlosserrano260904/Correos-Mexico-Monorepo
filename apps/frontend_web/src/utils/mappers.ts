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

import {
  BackendAuthResponse,
  BackendAuthResponseSchema,
  BackendUserEntity,
  BackendUserEntitySchema,
  FrontendAuthResponse,
  FrontendAuthResponseSchema,
  FrontendUserProfile,
  FrontendUserProfileSchema,
  FrontendOtpResponse,
  FrontendOtpResponseSchema,
} from '@/schemas/auth'

import {
  BackendProfileEntity,
  BackendProfileEntitySchema,
  BackendCreateProfileDto,
  BackendCreateProfileDtoSchema,
  BackendUpdateProfileDto,
  BackendUpdateProfileDtoSchema,
  FrontendProfile,
  FrontendProfileSchema,
} from '@/schemas/profile'

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
      ProductStock: validated.inventario,
      Color: validated.color,
      ProductBrand: validated.marca,
      ProductSlug: validated.slug,
      ProductSellerName: validated.vendedor,
      ProductStatus: validated.estado,
      ProductSold: validated.vendidos,
      ProductSKU: validated.sku,
      
      // === IMÁGENES ===
      ProductImages: validated.images || [],
      
      // === CAMPOS EXTRA PARA UI ===
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
    
    // ✅ MAPEAR SOLO LOS CAMPOS QUE ACEPTA EL BACKEND CreateProductDto
    const createDto = {
      nombre: safeString(frontendProduct.ProductName, 'Producto sin nombre'),
      descripcion: safeString(frontendProduct.ProductDescription, 'Sin descripción'),
      precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
      categoria: safeString(frontendProduct.ProductCategory, 'Sin categoría'),
      // NOTA: inventario y color NO están soportados en CreateProductDto del backend
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
    
    // NOTE: Color field is not supported in UpdateProductDto - removed to prevent API errors
    
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

// ============================================================
// 🔐 AUTH MAPPERS
// ============================================================

/**
 * 🔄 Backend AuthResponse -> Frontend AuthResponse
 */
export function mapBackendAuthToFrontend(backendAuth: unknown): FrontendAuthResponse {
  console.log('🔍 Datos de auth del backend recibidos:', backendAuth)
  
  try {
    // ✅ Validar que los datos coinciden con el schema del backend
    const validated = BackendAuthResponseSchema.parse(backendAuth)
    console.log('✅ Datos de auth validados del backend:', validated)
    
    // ✅ Mapear a estructura del frontend, manejando ambas estructuras
    let frontendAuth: FrontendAuthResponse
    
    if (validated.access_token && validated.user) {
      // Nueva estructura (signin/verifyOtp con access_token)
      frontendAuth = {
        access_token: validated.access_token,
        user: validated.user,
        token: validated.token, // Para compatibilidad con signup temporal
        userId: validated.userId, // Para compatibilidad
        needsVerification: false
      }
    } else if (validated.token && validated.userId) {
      // Estructura legacy (signin anterior)
      frontendAuth = {
        access_token: validated.token, // Mapear token a access_token
        user: {
          id: validated.userId,
          correo: '', // Se llenará después con getCurrentUser
          nombre: 'Usuario', // Default value
          apellido: '', // Default value
        },
        token: validated.token,
        userId: validated.userId,
        needsVerification: false
      }
    } else if (validated.token && validated.id) {
      // Estructura de signup temporal
      frontendAuth = {
        access_token: '', // No hay access_token real aún
        user: {
          id: validated.id,
          correo: '', // Se llenará después
          nombre: 'Usuario', // Default value
          apellido: '', // Default value
        },
        token: validated.token, // Token temporal para OTP
        userId: validated.id,
        needsVerification: true
      }
    } else {
      throw new Error('Estructura de respuesta de auth no reconocida')
    }
    
    console.log('✅ Auth response mapeada para frontend:', frontendAuth)
    
    // ✅ Validar resultado final
    return FrontendAuthResponseSchema.parse(frontendAuth)
    
  } catch (error) {
    console.error('❌ Error mapeando backend auth -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendAuth)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando auth response: ${error}`)
  }
}

/**
 * 🔄 Backend UserEntity -> Frontend UserProfile
 */
export function mapBackendUserToFrontend(backendUser: unknown): FrontendUserProfile {
  console.log('🔍 Datos de usuario del backend recibidos:', backendUser)
  
  try {
    // ✅ Validar que los datos coinciden con el schema del backend
    const validated = BackendUserEntitySchema.parse(backendUser)
    console.log('✅ Datos de usuario validados del backend:', validated)
    
    // ✅ Mapear a estructura del frontend
    const frontendUser: FrontendUserProfile = {
      id: validated.profile?.id || validated.id,
      correo: validated.correo,
      nombre: validated.nombre,
      apellido: validated.apellido,
      rol: validated.rol,
      profile: validated.profile
    }
    
    console.log('✅ Usuario mapeado para frontend:', frontendUser)
    
    // ✅ Validar resultado final
    return FrontendUserProfileSchema.parse(frontendUser)
    
  } catch (error) {
    console.error('❌ Error mapeando backend user -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendUser)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando usuario: ${error}`)
  }
}

/**
 * 🔄 Backend OTP Response -> Frontend OTP Response
 */
export function mapBackendOtpToFrontend(backendOtp: unknown): FrontendOtpResponse {
  console.log('🔍 Datos de OTP del backend recibidos:', backendOtp)
  
  try {
    // ✅ Permitir tanto la estructura antigua como la nueva
    const data = backendOtp as any
    
    const frontendOtp: FrontendOtpResponse = {
      isOtpVerified: data.isOtpVerified || false,
      access_token: data.access_token,
      user: data.user
    }
    
    console.log('✅ OTP response mapeada para frontend:', frontendOtp)
    
    // ✅ Validar resultado final
    return FrontendOtpResponseSchema.parse(frontendOtp)
    
  } catch (error) {
    console.error('❌ Error mapeando backend OTP -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendOtp)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando OTP response: ${error}`)
  }
}

// ============================================================
// 👤 PROFILE MAPPERS
// ============================================================

/**
 * 🔄 Backend ProfileEntity -> Frontend Profile
 */
export function mapBackendProfileToFrontend(backendProfile: unknown): FrontendProfile {
  console.log('🔍 Datos del perfil del backend recibidos:', backendProfile)
  
  // Check if it's just a success message and not actual profile data
  if (backendProfile && typeof backendProfile === 'object' && 'message' in backendProfile && 'ok' in backendProfile) {
    console.error('❌ Backend returned success message instead of profile data:', backendProfile)
    throw new Error('Backend no devolvió datos del perfil, solo mensaje de confirmación')
  }
  
  try {
    // ✅ Validar que los datos coinciden con el schema del backend
    const validated = BackendProfileEntitySchema.parse(backendProfile)
    console.log('✅ Datos del perfil validados del backend:', validated)
    
    // ✅ Mapear a estructura del frontend
    const frontendProfile: FrontendProfile = {
      id: validated.id,
      nombre: validated.nombre,
      apellido: validated.apellido,
      telefono: validated.numero, // numero -> telefono
      estado: validated.estado,
      ciudad: validated.ciudad,
      fraccionamiento: validated.fraccionamiento,
      calle: validated.calle,
      codigoPostal: validated.codigoPostal,
      avatar: validated.imagen || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
      
      // Computed fields
      direccionCompleta: `${validated.calle}, ${validated.fraccionamiento}, ${validated.ciudad}, ${validated.estado} ${validated.codigoPostal}`,
      nombreCompleto: `${validated.nombre} ${validated.apellido}`,
    }
    
    console.log('✅ Perfil mapeado para frontend:', frontendProfile)
    
    // ✅ Validar resultado final
    return FrontendProfileSchema.parse(frontendProfile)
    
  } catch (error) {
    console.error('❌ Error mapeando backend profile -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendProfile)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando perfil: ${error}`)
  }
}

/**
 * 🔄 Frontend Profile -> Backend UpdateProfileDto
 */
export function mapFrontendProfileToUpdateDto(frontendProfile: Partial<FrontendProfile>): BackendUpdateProfileDto {
  console.log('🔍 Datos del frontend para actualizar perfil:', frontendProfile)
  
  try {
    // ✅ Helper functions
    const safeString = (value: string | undefined | null): string | undefined => {
      if (value === null || value === undefined) return undefined
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    }
    
    // ✅ SOLO INCLUIR CAMPOS QUE ESTÁN PRESENTES
    const updateDto: Partial<BackendUpdateProfileDto> = {}
    
    if (frontendProfile.nombre !== undefined) {
      const nombre = safeString(frontendProfile.nombre)
      if (nombre) updateDto.nombre = nombre
    }
    
    if (frontendProfile.apellido !== undefined) {
      const apellido = safeString(frontendProfile.apellido)
      if (apellido) updateDto.apellido = apellido
    }
    
    if (frontendProfile.telefono !== undefined) {
      const numero = safeString(frontendProfile.telefono)
      if (numero) updateDto.numero = numero // telefono -> numero
    }
    
    if (frontendProfile.estado !== undefined) {
      const estado = safeString(frontendProfile.estado)
      if (estado) updateDto.estado = estado
    }
    
    if (frontendProfile.ciudad !== undefined) {
      const ciudad = safeString(frontendProfile.ciudad)
      if (ciudad) updateDto.ciudad = ciudad
    }
    
    if (frontendProfile.fraccionamiento !== undefined) {
      const fraccionamiento = safeString(frontendProfile.fraccionamiento)
      if (fraccionamiento) updateDto.fraccionamiento = fraccionamiento
    }
    
    if (frontendProfile.calle !== undefined) {
      const calle = safeString(frontendProfile.calle)
      if (calle) updateDto.calle = calle
    }
    
    if (frontendProfile.codigoPostal !== undefined) {
      const codigoPostal = safeString(frontendProfile.codigoPostal)
      if (codigoPostal) updateDto.codigoPostal = codigoPostal
    }
    
    console.log('✅ DTO de actualización preparado (antes de validación Zod):', updateDto)
    
    // ✅ Solo validar si hay al menos un campo para actualizar
    if (Object.keys(updateDto).length === 0) {
      throw new Error('No hay campos válidos para actualizar')
    }
    
    const validatedDto = BackendUpdateProfileDtoSchema.parse(updateDto)
    console.log('✅ DTO validado por Zod exitosamente:', validatedDto)
    
    return validatedDto
    
  } catch (error) {
    console.error('❌ Error en mapFrontendProfileToUpdateDto:', error)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const messages = zodError.issues.map((issue: any) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ')
      throw new Error(`Validación fallida: ${messages}`)
    }
    
    throw new Error(`Error inesperado validando datos del perfil: ${String(error)}`)
  }
}