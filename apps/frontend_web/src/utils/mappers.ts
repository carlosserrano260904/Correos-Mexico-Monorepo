// utils/mappers.ts - CORREGIDO PARA TU ESTRUCTURA REAL

// ============================================================
// 🔧 HELPERS PARA VALIDACIÓN DE EMAIL Y DATOS
// ============================================================

/**
 * 🎯 Helper para debuggear errores de ZodError
 */
function debugZodError(error: any, data: unknown, context: string): void {
  console.error(`❌ === ZodError en ${context} ===`);
  console.error('Datos originales:', data);
  
  if (error && 'issues' in error) {
    console.error('Problemas de validación:');
    error.issues.forEach((issue: any, index: number) => {
      console.error(`  ${index + 1}. ${issue.path.join('.')} - ${issue.message} (${issue.code})`);
      if (issue.expected) console.error(`     Esperado: ${issue.expected}`);
      if (issue.received) console.error(`     Recibido: ${issue.received}`);
    });
  }
  
  console.error('='.repeat(50));
}

/**
 * 🎯 Función para hacer validation con mejor error handling
 */
function safeZodParse<T>(schema: any, data: unknown, context: string): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    debugZodError(error, data, context);
    return null;
  }
}

/**
 * 🖼️ Helper para limpiar y validar URLs de imágenes de S3
 */
function sanitizeImageUrl(url: string | undefined | null): string {
  const defaultImage = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
  
  if (!url || typeof url !== 'string') {
    return defaultImage;
  }
  
  try {
    // Si la URL ya está bien formada, devolverla tal como está
    new URL(url);
    return url;
  } catch (error) {
    // Si la URL no es válida, intentar limpiarla
    console.warn('⚠️ URL de imagen mal formada, intentando limpiar:', url);
    
    try {
      // Separar la base de la URL y el path
      const parts = url.split('/images/');
      if (parts.length !== 2) {
        console.warn('⚠️ URL no tiene formato esperado de S3, usando imagen por defecto');
        return defaultImage;
      }
      
      const [baseUrl, imagePath] = parts;
      
      // Limpiar el nombre del archivo de caracteres problemáticos
      const cleanImagePath = imagePath
        .replace(/\s+/g, '%20')  // Espacios -> %20
        .replace(/#/g, '%23')    // # -> %23
        .replace(/\$/g, '%24')   // $ -> %24
        .replace(/&/g, '%26')    // & -> %26
        .replace(/\+/g, '%2B')   // + -> %2B
        .replace(/,/g, '%2C')    // , -> %2C
        .replace(/:/g, '%3A')    // : -> %3A
        .replace(/;/g, '%3B')    // ; -> %3B
        .replace(/=/g, '%3D')    // = -> %3D
        .replace(/\?/g, '%3F')   // ? -> %3F
        .replace(/@/g, '%40');   // @ -> %40
      
      const cleanUrl = `${baseUrl}/images/${cleanImagePath}`;
      
      // Verificar que la URL limpia es válida
      new URL(cleanUrl);
      console.log('✅ URL de imagen limpia:', cleanUrl);
      return cleanUrl;
      
    } catch (cleanError) {
      console.error('❌ No se pudo limpiar la URL de imagen:', cleanError);
      return defaultImage;
    }
  }
}

/**
 * 🎯 Valida y normaliza un email, retornando un email válido o uno por defecto
 */
function validateAndNormalizeEmail(emailData: unknown, fallbackEmail: string = 'temp@temporary.com'): string {
  // Si es null o undefined, usar fallback
  if (!emailData) {
    console.warn('⚠️ Email es null/undefined, usando fallback:', fallbackEmail);
    return fallbackEmail;
  }
  
  // Si es string, validar formato
  if (typeof emailData === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailData)) {
      return emailData;
    } else {
      console.warn('⚠️ Email inválido:', emailData, 'usando fallback:', fallbackEmail);
      return fallbackEmail;
    }
  }
  
  // Si es objeto, buscar propiedades de email
  if (typeof emailData === 'object') {
    const obj = emailData as any;
    const email = obj.correo || obj.email || obj.emailAddress;
    return validateAndNormalizeEmail(email, fallbackEmail);
  }
  
  console.warn('⚠️ Tipo de email no reconocido:', typeof emailData, emailData, 'usando fallback:', fallbackEmail);
  return fallbackEmail;
}

/**
 * 🎯 Extrae y valida datos de usuario desde cualquier estructura
 */
function extractUserData(userData: unknown): {
  id: number;
  correo: string;
  nombre: string | null;
  apellido: string | null;
  rol?: string;
  confirmado?: boolean;
} {
  const data = userData as any;
  
  return {
    id: data.id || data.userId || 0,
    correo: validateAndNormalizeEmail(data.correo || data.email),
    nombre: data.nombre || data.name || null,
    apellido: data.apellido || data.lastName || null,
    rol: data.rol || data.role || 'usuario',
    confirmado: data.confirmado || data.confirmed || false,
  };
}

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
  BackendUserUnified,
  BackendUserUnifiedSchema,
  BackendCreateAccountEntity,
  BackendCreateAccountEntitySchema,
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

import {
  BackendAddress,
  BackendCreateAddressDto,
  BackendAddressSchema,
  BackendCreateAddressDtoSchema,
  FrontendAddress,
  FrontendAddressSchema,
} from '@/schemas/address'

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
    const rawImageUrl = validated.images?.[0]?.url;
    const imageUrl = sanitizeImageUrl(rawImageUrl);
    
    console.log('🖼️ URL de imagen original:', rawImageUrl)
    console.log('🖼️ URL de imagen sanitizada:', imageUrl)
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
      
      // === NUEVAS DIMENSIONES FÍSICAS (pueden no existir en BD) ===
      ProductHeight: validated.altura || null,
      ProductLength: validated.largo || null,
      ProductWidth: validated.ancho || null,
      ProductWeight: validated.peso || null,
      
      // === VENDEDOR ===
      ProductSellerId: validated.idPerfil,
      
      // === IMÁGENES ===
      ProductImages: (validated.images || []).map(img => ({
        ...img,
        url: sanitizeImageUrl(img.url)
      })),
      
      // === CAMPOS EXTRA PARA UI ===
      ProductCupons: [],
      
      // === CAMPOS CALCULADOS PARA UI (safe calculation) ===
      ProductVolume: (validated.altura && validated.largo && validated.ancho) 
        ? validated.altura * validated.largo * validated.ancho 
        : undefined,
      ProductDimensions: (validated.altura && validated.largo && validated.ancho)
        ? `${validated.altura} x ${validated.largo} x ${validated.ancho} cm`
        : undefined,
      ProductWeightDisplay: (validated.peso && validated.peso > 0) ? `${validated.peso} kg` : undefined,
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
      
      // === DIMENSIONES FÍSICAS OPCIONALES (solo incluir si tienen valores válidos) ===
      ...(frontendProduct.ProductHeight && frontendProduct.ProductHeight > 0 ? { altura: frontendProduct.ProductHeight } : {}),
      ...(frontendProduct.ProductLength && frontendProduct.ProductLength > 0 ? { largo: frontendProduct.ProductLength } : {}),
      ...(frontendProduct.ProductWidth && frontendProduct.ProductWidth > 0 ? { ancho: frontendProduct.ProductWidth } : {}),
      ...(frontendProduct.ProductWeight && frontendProduct.ProductWeight > 0 ? { peso: frontendProduct.ProductWeight } : {}),
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
    
    // === DIMENSIONES FÍSICAS (solo incluir si existen en BD) ===
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
 * 🖼️ Función exportada para sanitizar URLs de imágenes (para usar en componentes y schemas)
 */
export { sanitizeImageUrl };

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
    // ✅ Intentar validar con el schema del backend
    let validated: BackendAuthResponse;
    
    try {
      validated = BackendAuthResponseSchema.parse(backendAuth);
      console.log('✅ Datos de auth validados del backend:', validated)
    } catch (validationError) {
      console.warn('⚠️ No se pudo validar con schema estricto, intentando validación flexible...');
      console.warn('Error de validación:', validationError);
      
      // Fallback: crear un objeto válido con los datos que tengamos
      const data = backendAuth as any;
      validated = {
        token: data.token || data.access_token,
        userId: data.userId || data.id || data.user?.id,
        id: data.id || data.user?.id,
        access_token: data.access_token || data.token,
        user: data.user,
        correo: data.correo || data.email || data.user?.correo,
        nombre: data.nombre || data.name || data.user?.nombre,
        apellido: data.apellido || data.lastName || data.user?.apellido,
        rol: data.rol || data.role || data.user?.rol,
        confirmado: data.confirmado || data.confirmed || data.user?.confirmado
      };
      console.log('✅ Datos de auth normalizados:', validated);
    }
    
    // ✅ Mapear a estructura del frontend, manejando todas las estructuras posibles
    let frontendAuth: FrontendAuthResponse
    
    if (validated.access_token && validated.user) {
      // Nueva estructura (signin/verifyOtp con access_token)
      const userData = extractUserData(validated.user);
      frontendAuth = {
        access_token: validated.access_token,
        user: {
          id: userData.id,
          correo: userData.correo,
          nombre: userData.nombre,
          apellido: userData.apellido,
        },
        token: validated.token, // Para compatibilidad con signup temporal
        userId: validated.userId || userData.id, // Para compatibilidad
        needsVerification: false
      }
    } else if (validated.token && (validated.userId || validated.id)) {
      // Estructura legacy o signup
      const userId = validated.userId || validated.id!;
      const isSignup = !validated.userId && validated.id; // Solo signup tiene "id" sin "userId"
      
      frontendAuth = {
        access_token: isSignup ? '' : validated.token, // No hay access_token real para signup
        user: {
          id: userId,
          correo: validateAndNormalizeEmail(validated.correo, 'temp@temporary.com'),
          nombre: validated.nombre || 'Usuario', // Default value
          apellido: validated.apellido || null, // Default value
        },
        token: validated.token,
        userId: userId,
        needsVerification: isSignup // Solo signup necesita verificación
      }
    } else {
      // Fallback con datos mínimos
      console.warn('⚠️ Estructura de auth incompleta, usando fallback');
      const fallbackUserData = extractUserData(validated);
      frontendAuth = {
        access_token: validated.access_token || validated.token || '',
        user: {
          id: fallbackUserData.id,
          correo: fallbackUserData.correo,
          nombre: fallbackUserData.nombre || 'Usuario',
          apellido: fallbackUserData.apellido,
        },
        token: validated.token,
        userId: fallbackUserData.id,
        needsVerification: false
      }
    }
    
    console.log('✅ Auth response mapeada para frontend:', frontendAuth)
    
    // ✅ Validar resultado final con mejor error handling
    try {
      return FrontendAuthResponseSchema.parse(frontendAuth)
    } catch (finalValidationError) {
      console.error('❌ Error en validación final de FrontendAuthResponse:');
      debugZodError(finalValidationError, frontendAuth, 'FrontendAuthResponse');
      
      // Como último recurso, devolver un objeto mínimo válido
      console.warn('🚨 Usando fallback de emergencia para AuthResponse');
      const emergencyAuth: FrontendAuthResponse = {
        access_token: frontendAuth.access_token || '',
        user: {
          id: frontendAuth.user?.id || 0,
          correo: validateAndNormalizeEmail(frontendAuth.user?.correo, 'emergency@temp.com'),
          nombre: frontendAuth.user?.nombre || null,
          apellido: frontendAuth.user?.apellido || null,
        },
        token: frontendAuth.token,
        userId: frontendAuth.userId,
        needsVerification: frontendAuth.needsVerification || false
      };
      
      console.log('🚨 AuthResponse de emergencia:', emergencyAuth);
      return emergencyAuth;
    }
    
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
    // ✅ Intentar validar con el schema unificado que maneja ambas estructuras
    let validated: BackendUserUnified;
    
    try {
      validated = BackendUserUnifiedSchema.parse(backendUser);
      console.log('✅ Datos de usuario validados con schema unificado:', validated)
    } catch (unifiedError) {
      console.warn('⚠️ No se pudo validar con schema unificado, intentando validación flexible...');
      console.warn('Error de schema unificado:', unifiedError);
      
      // Fallback: crear un objeto válido con los datos que tengamos
      const data = backendUser as any;
      validated = {
        id: data.id || 0,
        correo: data.correo || data.email || '',
        nombre: data.nombre || data.name || null,
        apellido: data.apellido || data.lastName || null,
        rol: data.rol || data.role || 'usuario',
        confirmado: data.confirmado || data.confirmed || false,
      };
      console.log('✅ Datos de usuario normalizados:', validated);
    }
    
    // ✅ Mapear a estructura del frontend
    let frontendUser: FrontendUserProfile;
    
    if ('profile' in validated && validated.profile) {
      // Caso CreateAccount con profile
      frontendUser = {
        id: validated.id,
        correo: validated.correo,
        nombre: validated.nombre || validated.profile.nombre || null,
        apellido: validated.apellido || validated.profile.apellido || null,
        rol: ('rol' in validated ? validated.rol : 'usuario') || 'usuario',
        profile: validated.profile
      };
    } else {
      // Caso User simple o sin profile
      frontendUser = {
        id: validated.id,
        correo: validated.correo,
        nombre: validated.nombre || null,
        apellido: validated.apellido || null,
        rol: ('rol' in validated ? validated.rol : 'usuario') || 'usuario',
        profile: undefined
      };
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
    // ✅ Intentar validar con el schema del backend
    let validated: any;
    
    try {
      validated = BackendProfileEntitySchema.parse(backendProfile);
      console.log('✅ Datos del perfil validados del backend:', validated)
    } catch (validationError) {
      console.warn('⚠️ No se pudo validar con schema estricto, intentando validación flexible...');
      console.warn('Error de validación:', validationError);
      
      // Fallback: normalizar datos de perfil
      const data = backendProfile as any;
      validated = {
        id: data.id || 0,
        nombre: data.nombre || data.name || null,
        apellido: data.apellido || data.lastName || null,
        numero: data.numero || data.phone || data.telefono || null,
        estado: data.estado || data.state || null,
        ciudad: data.ciudad || data.city || null,
        fraccionamiento: data.fraccionamiento || data.neighborhood || null,
        calle: data.calle || data.street || null,
        codigoPostal: data.codigoPostal || data.zipCode || data.postalCode || null,
        imagen: data.imagen || data.image || data.avatar || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
        stripeCustomerId: data.stripeCustomerId || null,
      };
      console.log('✅ Datos del perfil normalizados:', validated);
    }
    
    // ✅ Mapear a estructura del frontend con manejo seguro de nulls
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
      direccionCompleta: [
        validated.calle,
        validated.fraccionamiento,
        validated.ciudad,
        validated.estado,
        validated.codigoPostal
      ].filter(Boolean).join(', ') || 'Dirección no completada',
      nombreCompleto: [validated.nombre, validated.apellido].filter(Boolean).join(' ') || 'Nombre no especificado',
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
      ProductImageUrl: sanitizeImageUrl(backendFavorito.producto.images?.[0]?.url),
      ProductImages: (backendFavorito.producto.images || []).map(img => ({
        ...img,
        url: sanitizeImageUrl(img.url)
      })),
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

// ============================================================
// 🏠 ADDRESS MAPPERS
// ============================================================

// Definir el tipo que se usa en los componentes
export interface UserAddressDeriveryProps {
  Nombre: string;
  Apellido: string;
  Calle: string;
  Numero: number;
  CodigoPostal: string;
  Estado: string;
  Municipio: string;
  Ciudad: string;
  Colonia: string;
  NumeroDeTelefono: string;
  InstruccionesExtra: string;
}

/**
 * 🔄 Backend Address -> Frontend Address
 */
export function mapBackendAddressToFrontend(backendAddress: unknown): FrontendAddress {
  console.log('🔍 Mapeando dirección del backend a FrontendAddress:', backendAddress);
  
  try {
    // Validar estructura del backend
    const validated = BackendAddressSchema.parse(backendAddress);
    console.log('✅ Dirección validada del backend:', validated);
    
    // Mapear a la estructura del frontend
    const frontendAddress: FrontendAddress = {
      AddressId: validated.id,
      AddressName: validated.nombre,
      Street: validated.calle,
      Neighborhood: validated.colonia_fraccionamiento,
      InteriorNumber: validated.numero_interior,
      ExteriorNumber: validated.numero_exterior,
      PhoneNumber: validated.numero_celular,
      PostalCode: validated.codigo_postal,
      State: validated.estado,
      Municipality: validated.municipio,
      AdditionalInfo: validated.mas_info,
      UserId: validated.usuario?.id || 0,
      isDefault: false,
      isSelected: false,
      FullAddress: [
        validated.calle,
        validated.numero_exterior ? `${validated.numero_exterior}` : '',
        validated.colonia_fraccionamiento,
        `${validated.municipio}, ${validated.estado} ${validated.codigo_postal}`
      ].filter(Boolean).join(', '),
    };
    
    console.log('✅ Dirección mapeada para frontend:', frontendAddress);
    return FrontendAddressSchema.parse(frontendAddress);
    
  } catch (error) {
    console.error('❌ Error mapeando dirección del backend:', error);
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues);
    }
    
    throw new Error(`Error mapeando dirección: ${error}`);
  }
}

/**
 * 🔄 Frontend Address -> Backend CreateAddressDto
 */
export function mapFrontendAddressToCreateDto(
  frontendAddress: Omit<FrontendAddress, 'AddressId' | 'isDefault' | 'isSelected' | 'FullAddress'>, 
  usuarioId: number
): BackendCreateAddressDto {
  console.log('🔍 Mapeando FrontendAddress a backend create:', frontendAddress);
  
  try {
    const backendDto = {
      nombre: frontendAddress.AddressName,
      calle: frontendAddress.Street,
      colonia_fraccionamiento: frontendAddress.Neighborhood,
      numero_interior: frontendAddress.InteriorNumber,
      numero_exterior: frontendAddress.ExteriorNumber,
      numero_celular: frontendAddress.PhoneNumber,
      codigo_postal: frontendAddress.PostalCode,
      estado: frontendAddress.State,
      municipio: frontendAddress.Municipality,
      mas_info: frontendAddress.AdditionalInfo || undefined,
      usuarioId: usuarioId,
    };
    
    console.log('✅ DTO creado para backend:', backendDto);
    return BackendCreateAddressDtoSchema.parse(backendDto);
    
  } catch (error) {
    console.error('❌ Error creando DTO de dirección:', error);
    throw new Error(`Error preparando datos de dirección: ${error}`);
  }
}

// ============================================================
// 💳 PAYMENTS MAPPERS
// ============================================================

import {
  BackendCard,
  BackendTransaction,
  BackendPaymentConfirmation,
  FrontendCard,
  FrontendTransaction,
  FrontendPayment,
  BackendCardSchema,
  BackendTransactionSchema,
  BackendPaymentConfirmationSchema,
  FrontendCardSchema,
  FrontendTransactionSchema,
  FrontendPaymentSchema,
} from '@/schemas/payments'

/**
 * 💳 Backend Card -> Frontend Card
 */
export function mapBackendCardToFrontend(backendCard: unknown): FrontendCard {
  console.log('🔍 Mapeando tarjeta del backend a FrontendCard:', backendCard);
  
  try {
    // Validar estructura del backend
    const validated = BackendCardSchema.parse(backendCard);
    console.log('✅ Tarjeta validada del backend:', validated);
    
    // Mapear a la estructura del frontend
    const frontendCard: FrontendCard = {
      CardId: validated.id,
      StripeCardId: validated.stripeCardId,
      Last4: validated.last4,
      Brand: validated.brand,
      ProfileId: validated.profileId,
      isSelected: false,
      isDefault: false,
      
      // Computed fields para UI
      DisplayName: `${validated.brand.toUpperCase()} ***${validated.last4}`,
      CardType: validated.brand.toLowerCase(),
      MaskedNumber: `**** **** **** ${validated.last4}`,
    };
    
    console.log('✅ Tarjeta mapeada para frontend:', frontendCard);
    return FrontendCardSchema.parse(frontendCard);
    
  } catch (error) {
    console.error('❌ Error mapeando tarjeta del backend:', error);
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues);
    }
    
    throw new Error(`Error mapeando tarjeta: ${error}`);
  }
}

/**
 * 📜 Backend Transaction -> Frontend Transaction
 */
export function mapBackendTransactionToFrontend(backendTransaction: unknown): FrontendTransaction {
  console.log('🔍 Mapeando transacción del backend a FrontendTransaction:', backendTransaction);
  
  try {
    // Validar estructura del backend
    const validated = BackendTransactionSchema.parse(backendTransaction);
    console.log('✅ Transacción validada del backend:', validated);
    
    // Mapear items de la transacción
    const items = (validated.contenidos || []).map(item => ({
      ItemId: item.id,
      ProductName: item.producto.nombre,
      Price: item.precio,
      Quantity: item.cantidad,
      Subtotal: item.precio * item.cantidad,
    }));
    
    // Mapear a la estructura del frontend
    const frontendTransaction: FrontendTransaction = {
      TransactionId: validated.id,
      Total: validated.total,
      Date: validated.diaTransaccion,
      ProfileId: validated.profileId,
      Items: items,
      
      // Computed fields para UI
      FormattedDate: new Date(validated.diaTransaccion).toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      FormattedTotal: `$${validated.total.toFixed(2)}`,
      ItemsCount: items.reduce((total, item) => total + item.Quantity, 0),
    };
    
    console.log('✅ Transacción mapeada para frontend:', frontendTransaction);
    return FrontendTransactionSchema.parse(frontendTransaction);
    
  } catch (error) {
    console.error('❌ Error mapeando transacción del backend:', error);
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues);
    }
    
    throw new Error(`Error mapeando transacción: ${error}`);
  }
}

/**
 * 💰 Backend Payment Confirmation -> Frontend Payment
 */
export function mapBackendPaymentToFrontend(
  backendPayment: unknown, 
  cardUsed?: FrontendCard
): FrontendPayment {
  console.log('🔍 Mapeando confirmación de pago del backend:', backendPayment);
  
  try {
    // Validar estructura del backend
    const validated = BackendPaymentConfirmationSchema.parse(backendPayment);
    console.log('✅ Pago validado del backend:', validated);
    
    // Mapear a la estructura del frontend
    const frontendPayment: FrontendPayment = {
      PaymentId: validated.paymentIntentId,
      Status: validated.status,
      Amount: 0, // El backend no devuelve el amount, habría que calcularlo
      Currency: 'mxn',
      ProfileId: validated.profile.id,
      CreatedAt: new Date().toISOString(),
      
      // Datos opcionales
      CardUsed: cardUsed,
      
      // Computed fields para UI
      FormattedAmount: `$0.00 MXN`, // Placeholder, se actualizaría con el amount real
      StatusMessage: validated.message,
    };
    
    console.log('✅ Pago mapeado para frontend:', frontendPayment);
    return FrontendPaymentSchema.parse(frontendPayment);
    
  } catch (error) {
    console.error('❌ Error mapeando pago del backend:', error);
    
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Detalles de validación Zod:', (error as any).issues);
    }
    
    throw new Error(`Error mapeando confirmación de pago: ${error}`);
  }
}

/**
 * 🔄 Mapear array de tarjetas del backend
 */
export function mapBackendCardsArrayToFrontend(backendCards: unknown[]): FrontendCard[] {
  console.log('🔍 Mapeando array de tarjetas del backend:', backendCards);
  
  try {
    const mappedCards = backendCards.map((card, index) => {
      try {
        return mapBackendCardToFrontend(card);
      } catch (error) {
        console.warn(`⚠️ Error mapeando tarjeta ${index}:`, error);
        return null;
      }
    }).filter((card): card is FrontendCard => card !== null);
    
    console.log(`✅ ${mappedCards.length} tarjetas mapeadas de ${backendCards.length} totales`);
    return mappedCards;
    
  } catch (error) {
    console.error('❌ Error mapeando array de tarjetas:', error);
    throw new Error(`Error mapeando tarjetas: ${error}`);
  }
}

/**
 * 🔄 Mapear array de transacciones del backend
 */
export function mapBackendTransactionsArrayToFrontend(backendTransactions: unknown[]): FrontendTransaction[] {
  console.log('🔍 Mapeando array de transacciones del backend:', backendTransactions);
  
  try {
    const mappedTransactions = backendTransactions.map((transaction, index) => {
      try {
        return mapBackendTransactionToFrontend(transaction);
      } catch (error) {
        console.warn(`⚠️ Error mapeando transacción ${index}:`, error);
        return null;
      }
    }).filter((transaction): transaction is FrontendTransaction => transaction !== null);
    
    console.log(`✅ ${mappedTransactions.length} transacciones mapeadas de ${backendTransactions.length} totales`);
    return mappedTransactions;
    
  } catch (error) {
    console.error('❌ Error mapeando array de transacciones:', error);
    throw new Error(`Error mapeando transacciones: ${error}`);
  }
}

/**
 * 💳 Utilidad: Formatear datos de formulario de tarjeta para Stripe
 */
export function formatCardDataForStripe(formData: {
  NombreTarjeta: string;
  NumeroTarjeta: string;
  FechaExpiracion: string;
  CodigoSeguridad: string;
}) {
  console.log('🔍 Formateando datos de tarjeta para Stripe');
  
  try {
    // Limpiar número de tarjeta
    const cleanCardNumber = formData.NumeroTarjeta.replace(/\s+/g, '');
    
    // Extraer mes y año de la fecha
    const [month, year] = formData.FechaExpiracion.split('/');
    const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
    
    const stripeData = {
      number: cleanCardNumber,
      exp_month: parseInt(month),
      exp_year: fullYear,
      cvc: formData.CodigoSeguridad,
      name: formData.NombreTarjeta,
    };
    
    console.log('✅ Datos formateados para Stripe (CVV oculto):', {
      ...stripeData,
      cvc: '***',
      number: `***${cleanCardNumber.slice(-4)}`
    });
    
    return stripeData;
    
  } catch (error) {
    console.error('❌ Error formateando datos para Stripe:', error);
    throw new Error(`Error formateando datos de tarjeta: ${error}`);
  }
}

/**
 * 💰 Utilidad: Convertir datos de pago a formato legible
 */
export function formatPaymentForDisplay(payment: FrontendPayment) {
  return {
    id: payment.PaymentId,
    amount: payment.FormattedAmount || `$${payment.Amount.toFixed(2)} ${payment.Currency.toUpperCase()}`,
    status: payment.StatusMessage || payment.Status,
    card: payment.CardUsed?.DisplayName || 'Tarjeta no especificada',
    date: new Date(payment.CreatedAt).toLocaleDateString('es-MX'),
    isSuccessful: payment.Status === 'success',
  };
}