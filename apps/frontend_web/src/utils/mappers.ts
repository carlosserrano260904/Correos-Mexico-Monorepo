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
  BackendCartItem,
  BackendCartResponse,
  BackendCartItemSchema,
  BackendCartResponseSchema,
  FrontendCartItem,
  FrontendCart,
  FrontendCartItemSchema,
  FrontendCartSchema,
  CartItemTransformSchema,
  CartTransformSchema,
  BackendCreateCartDto,
  BackendCreateCartDtoSchema,
  BackendUpdateCartDto,
  AddToCartRequest,
  UpdateCartQuantityRequest,
} from '@/schemas/cart'

import {
  BackendFavorito,
  BackendFavoritesResponse,
  BackendFavoritesResponseSchema,
  BackendCreateFavoritoDto,
  FrontendFavorite,
  FrontendFavorites,
  FrontendFavoriteSchema,
  FrontendFavoritesSchema,
} from '@/schemas/favorites'

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
      
      // === NUEVAS DIMENSIONES FÍSICAS ===
      ProductHeight: validated.altura,
      ProductLength: validated.largo,
      ProductWidth: validated.ancho,
      ProductWeight: validated.peso,
      
      // === VENDEDOR ===
      ProductSellerId: validated.idPerfil,
      
      // === IMÁGENES ===
      ProductImages: validated.images || [],
      
      // === CAMPOS EXTRA PARA UI ===
      ProductCupons: [],
      
      // === CAMPOS CALCULADOS PARA UI ===
      ProductVolume: validated.altura && validated.largo && validated.ancho 
        ? validated.altura * validated.largo * validated.ancho 
        : undefined,
      ProductDimensions: validated.altura && validated.largo && validated.ancho
        ? `${validated.altura} x ${validated.largo} x ${validated.ancho} cm`
        : undefined,
      ProductWeightDisplay: validated.peso ? `${validated.peso} kg` : undefined,
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
    
    // ✅ MAPEAR CAMPOS QUE ACEPTA EL BACKEND CreateProductDto (ACTUALIZADO)
    const createDto = {
      // === CAMPOS BÁSICOS REQUERIDOS ===
      nombre: safeString(frontendProduct.ProductName, 'Producto sin nombre'),
      descripcion: safeString(frontendProduct.ProductDescription, 'Sin descripción'),
      precio: Math.max(0.01, safeNumber(frontendProduct.productPrice, 0.01)),
      inventario: Math.max(0, safeNumber(frontendProduct.ProductStock, 0)),
      categoria: safeString(frontendProduct.ProductCategory, 'Sin categoría'),
      color: safeString(frontendProduct.Color, 'Sin especificar'),
      marca: safeString(frontendProduct.ProductBrand, 'Sin marca'),
      slug: safeString(frontendProduct.ProductSlug, 'producto-sin-slug'),
      estado: frontendProduct.ProductStatus ?? true,
      sku: safeString(frontendProduct.ProductSKU, 'SKU-AUTO-' + Date.now()),
      vendedor: safeString(frontendProduct.ProductSellerName, 'Vendedor no especificado'),
      vendidos: safeNumber(frontendProduct.ProductSold, 0),
      idPerfil: safeNumber(frontendProduct.ProductSellerId, 1), // Requerido en backend
      
      // === DIMENSIONES FÍSICAS OPCIONALES ===
      altura: frontendProduct.ProductHeight || undefined,
      largo: frontendProduct.ProductLength || undefined,
      ancho: frontendProduct.ProductWidth || undefined,
      peso: frontendProduct.ProductWeight || undefined,
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
    
    if (frontendProduct.ProductBrand !== undefined) {
      const marca = safeString(frontendProduct.ProductBrand)
      if (marca) updateDto.marca = marca
    }
    
    if (frontendProduct.ProductSlug !== undefined) {
      const slug = safeString(frontendProduct.ProductSlug)
      if (slug) updateDto.slug = slug
    }
    
    if (frontendProduct.ProductStatus !== undefined) {
      updateDto.estado = frontendProduct.ProductStatus
    }
    
    if (frontendProduct.ProductSKU !== undefined) {
      const sku = safeString(frontendProduct.ProductSKU)
      if (sku) updateDto.sku = sku
    }
    
    if (frontendProduct.ProductSellerName !== undefined) {
      const vendedor = safeString(frontendProduct.ProductSellerName)
      if (vendedor) updateDto.vendedor = vendedor
    }
    
    if (frontendProduct.ProductSold !== undefined) {
      const vendidos = safeNumber(frontendProduct.ProductSold)
      if (vendidos !== undefined && vendidos >= 0) {
        updateDto.vendidos = Math.floor(vendidos)
      }
    }
    
    if (frontendProduct.ProductSellerId !== undefined) {
      const idPerfil = safeNumber(frontendProduct.ProductSellerId)
      if (idPerfil !== undefined) updateDto.idPerfil = idPerfil
    }
    
    // === DIMENSIONES FÍSICAS ===
    if (frontendProduct.ProductHeight !== undefined) {
      const altura = safeNumber(frontendProduct.ProductHeight)
      if (altura !== undefined && altura > 0) updateDto.altura = altura
    }
    
    if (frontendProduct.ProductLength !== undefined) {
      const largo = safeNumber(frontendProduct.ProductLength)
      if (largo !== undefined && largo > 0) updateDto.largo = largo
    }
    
    if (frontendProduct.ProductWidth !== undefined) {
      const ancho = safeNumber(frontendProduct.ProductWidth)
      if (ancho !== undefined && ancho > 0) updateDto.ancho = ancho
    }
    
    if (frontendProduct.ProductWeight !== undefined) {
      const peso = safeNumber(frontendProduct.ProductWeight)
      if (peso !== undefined && peso > 0) updateDto.peso = peso
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

// ============================================================
// 🔐 AUTH MAPPERS
// ============================================================

/**
 * 🔄 Backend Signup Response -> Frontend AuthResponse (for OTP verification flow)
 */
export function mapBackendSignupToFrontend(backendSignup: unknown, userEmail?: string): FrontendAuthResponse {
  console.log('🔍 Datos de signup del backend recibidos:', backendSignup)
  
  try {
    const validated = BackendAuthResponseSchema.parse(backendSignup)
    console.log('✅ Datos de signup validados del backend:', validated)
    
    // Estructura de signup temporal que requiere verificación OTP
    const frontendAuth: FrontendAuthResponse = {
      access_token: '', // No hay access_token real aún
      user: {
        id: validated.id || validated.userId || 0,
        correo: userEmail || 'temp@temporary.com', // Usar email real si está disponible
        nombre: 'Usuario', // Default value
        apellido: '', // Default value
      },
      token: validated.token, // Token temporal para OTP
      userId: validated.id || validated.userId || 0,
      needsVerification: true
    }
    
    console.log('✅ Signup response mapeada para frontend:', frontendAuth)
    return FrontendAuthResponseSchema.parse(frontendAuth)
    
  } catch (error) {
    console.error('❌ Error mapeando backend signup -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendSignup)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando signup response: ${error}`)
  }
}

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
          correo: 'temp@temporary.com', // Email temporal válido para pasar validación
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
      
      // Computed fields (handle nulls gracefully)
      direccionCompleta: `${validated.calle || ''}, ${validated.fraccionamiento || ''}, ${validated.ciudad || ''}, ${validated.estado || ''} ${validated.codigoPostal || ''}`.trim(),
      nombreCompleto: `${validated.nombre || ''} ${validated.apellido || ''}`.trim(),
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

// ============================================================
// 🛒 CART MAPPERS
// ============================================================

/**
 * 🔄 Backend CartItem -> Frontend CartItem
 */
export function mapBackendCartItemToFrontend(backendItem: unknown): FrontendCartItem {
  console.log('🔍 Datos del item del carrito del backend recibidos:', backendItem)
  
  try {
    // ✅ Validar que los datos coinciden con el schema del backend
    const validated = BackendCartItemSchema.parse(backendItem)
    console.log('✅ Datos del item validados del backend:', validated)
    
    // ✅ Mapear usando el schema transform
    const frontendItem = CartItemTransformSchema.parse(validated)
    
    console.log('✅ Item del carrito mapeado para frontend:', frontendItem)
    
    return frontendItem
    
  } catch (error) {
    console.error('❌ Error mapeando backend cart item -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendItem)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando item del carrito: ${error}`)
  }
}

/**
 * 🔄 Backend CartResponse -> Frontend Cart
 */
export function mapBackendCartToFrontend(backendCart: unknown): FrontendCart {
  console.log('🔍 Datos del carrito del backend recibidos:', backendCart)
  
  try {
    // ✅ Validar que los datos coinciden con el schema del backend
    const validated = BackendCartResponseSchema.parse(backendCart)
    console.log('✅ Datos del carrito validados del backend:', validated)
    
    // ✅ Mapear usando el schema transform
    const frontendCart = CartTransformSchema.parse(validated)
    
    console.log('✅ Carrito mapeado para frontend:', frontendCart)
    
    return frontendCart
    
  } catch (error) {
    console.error('❌ Error mapeando backend cart -> frontend:', error)
    console.error('❌ Datos que causaron error:', backendCart)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando carrito: ${error}`)
  }
}

// ============================================================
// ❤️ FAVORITES MAPPERS
// ============================================================

/**
 * 🔄 Backend Favorito -> Frontend Favorite
 */
export function mapBackendFavoritoToFrontend(backendFavorito: BackendFavorito): FrontendFavorite {
  console.log('🔍 Mapeando favorito individual:', backendFavorito.id)
  
  try {
    const frontendFavorite: FrontendFavorite = {
      // === CAMPOS DEL FAVORITO ===
      FavoriteId: backendFavorito.id,
      DateAdded: backendFavorito.fechaAgregado,
      
      // === CAMPOS DEL PRODUCTO ===
      ProductID: backendFavorito.producto.id,
      ProductName: backendFavorito.producto.nombre,
      ProductDescription: backendFavorito.producto.descripcion,
      productPrice: backendFavorito.producto.precio,
      ProductCategory: backendFavorito.producto.categoria,
      ProductStock: backendFavorito.producto.inventario,
      Color: backendFavorito.producto.color,
      ProductBrand: backendFavorito.producto.marca,
      ProductSlug: backendFavorito.producto.slug,
      ProductSellerName: backendFavorito.producto.vendedor,
      ProductStatus: backendFavorito.producto.estado,
      ProductSold: backendFavorito.producto.vendidos,
      ProductSKU: backendFavorito.producto.sku,
      
      // === IMÁGENES ===
      ProductImageUrl: backendFavorito.producto.images?.[0]?.url || '',
      ProductImages: backendFavorito.producto.images || [],
    }
    
    // Validar resultado con Zod
    const validated = FrontendFavoriteSchema.parse(frontendFavorite)
    console.log('✅ Favorito mapeado exitosamente:', validated.FavoriteId)
    
    return validated
    
  } catch (error) {
    console.error('❌ Error mapeando favorito individual:', error)
    console.error('❌ Datos que causaron error:', backendFavorito)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando favorito individual: ${error}`)
  }
}

/**
 * 🔄 Backend Favorites Array -> Frontend Favorites
 */
export function mapBackendFavoritesToFrontend(backendFavorites: BackendFavoritesResponse): FrontendFavorites {
  console.log(`🔍 Mapeando ${backendFavorites.length} favoritos`)
  
  try {
    const mappedFavorites = backendFavorites.map(favorito => 
      mapBackendFavoritoToFrontend(favorito)
    )
    
    const frontendFavorites: FrontendFavorites = {
      favorites: mappedFavorites,
      totalFavorites: mappedFavorites.length,
    }
    
    // Validar resultado con Zod
    const validated = FrontendFavoritesSchema.parse(frontendFavorites)
    console.log('✅ Lista de favoritos mapeada exitosamente:', validated.totalFavorites, 'favoritos')
    
    return validated
    
  } catch (error) {
    console.error('❌ Error mapeando lista de favoritos:', error)
    console.error('❌ Datos que causaron error:', backendFavorites)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues)
    }
    
    throw new Error(`Error mapeando lista de favoritos: ${error}`)
  }
}

/**
 * 🔄 Frontend Product -> Backend CreateFavoritoDto
 */
export function mapFrontendProductToAddFavoritesDto(
  product: FrontendProduct, 
  profileId: number
): BackendCreateFavoritoDto {
  console.log('🔍 Preparando datos para agregar a favoritos:', { product: product.ProductID, profileId })
  
  try {
    const addToFavoritesDto: BackendCreateFavoritoDto = {
      profileId,
      productId: product.ProductID,
    }
    
    console.log('✅ DTO preparado para favoritos:', addToFavoritesDto)
    return addToFavoritesDto
    
  } catch (error) {
    console.error('❌ Error preparando DTO para favoritos:', error)
    throw new Error(`Error preparando datos para favoritos: ${String(error)}`)
  }
}

/**
 * 🔄 Frontend Product -> Backend AddToCartDto
 */
export function mapFrontendProductToAddCartDto(
  product: FrontendProduct, 
  profileId: number, 
  quantity: number = 1
): BackendCreateCartDto {
  console.log('🔍 Preparando datos para agregar al carrito:', { product: product.ProductID, profileId, quantity })
  
  try {
    const addToCartDto = {
      profileId,
      productId: product.ProductID,
      cantidad: Math.max(1, Math.floor(quantity)),
    }
    
    console.log('✅ DTO preparado (antes de validación Zod):', addToCartDto)
    
    // ✅ Validar con Zod
    const validatedDto = BackendCreateCartDtoSchema.parse(addToCartDto)
    console.log('✅ DTO validado por Zod exitosamente:', validatedDto)
    
    return validatedDto
    
  } catch (error) {
    console.error('❌ Error en mapFrontendProductToAddCartDto:', error)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const messages = zodError.issues.map((issue: any) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ')
      throw new Error(`Validación fallida: ${messages}`)
    }
    
    throw new Error(`Error inesperado preparando datos para carrito: ${String(error)}`)
  }
}

/**
 * 🔄 Validate Update Cart Quantity Request
 */
export function validateUpdateCartQuantity(quantity: number): BackendUpdateCartDto {
  console.log('🔍 Validando cantidad para actualizar carrito:', quantity)
  
  try {
    const updateDto = {
      cantidad: Math.max(1, Math.floor(quantity)),
    }
    
    console.log('✅ DTO preparado (antes de validación Zod):', updateDto)
    
    // ✅ Validar con Zod
    const validatedDto = BackendUpdateCartDtoSchema.parse(updateDto)
    console.log('✅ DTO validado por Zod exitosamente:', validatedDto)
    
    return validatedDto
    
  } catch (error) {
    console.error('❌ Error en validateUpdateCartQuantity:', error)
    
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as any
      const messages = zodError.issues.map((issue: any) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('; ')
      throw new Error(`Validación fallida: ${messages}`)
    }
    
    throw new Error(`Error inesperado validando cantidad: ${String(error)}`)
  }
}

/**
 * 🔄 Validar array de items del carrito del backend
 */
export function validateBackendCartItemsArray(items: unknown[]): FrontendCartItem[] {
  console.log(`🔍 Validando ${items.length} items del carrito del backend...`)
  
  const validItems: FrontendCartItem[] = []
  const errors: string[] = []
  
  items.forEach((item, index) => {
    try {
      console.log(`🛒 Procesando item del carrito ${index + 1}`)
      const validItem = mapBackendCartItemToFrontend(item)
      validItems.push(validItem)
    } catch (error) {
      console.error(`❌ Error en item del carrito ${index + 1}:`, error)
      errors.push(`Item ${index + 1}: ${error}`)
    }
  })
  
  if (errors.length > 0) {
    console.warn(`⚠️ Se encontraron ${errors.length} items con errores:`, errors)
  }
  
  console.log(`✅ ${validItems.length} items válidos de ${items.length} totales`)
  return validItems
}