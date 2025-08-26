// schemas/auth.ts - Auth schemas with Zod validation

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real del backend)
// ============================================================

/**
 * Schema para CreateAccount entity (tabla usuarios)
 */
export const BackendCreateAccountEntitySchema = z.object({
  id: z.number(),
  correo: z.string().email(),
  nombre: z.string().nullable(), // nullable in entity
  apellido: z.string().nullable(), // nullable in entity  
  rol: z.string().optional().default('usuario'),
  confirmado: z.boolean().optional().default(false),
  password: z.string().nullable().optional(), // nullable in entity
  token: z.string().nullable().optional(),
  tokenCreatedAt: z.union([z.date(), z.string()]).nullable().optional(), // Can be Date or string
  profile: z.object({
    id: z.number(),
    nombre: z.string().nullable(), // Can be null
    apellido: z.string().nullable(), // Can be null
    numero: z.string().nullable(), // Can be null
    estado: z.string().nullable(), // Can be null
    ciudad: z.string().nullable(), // Can be null
    fraccionamiento: z.string().nullable(), // Can be null
    calle: z.string().nullable(), // Can be null
    codigoPostal: z.string().nullable(), // Can be null
    imagen: z.string().optional(),
    stripeCustomerId: z.string().nullable().optional(),
  }).optional(),
})

/**
 * Schema para User entity (diferente tabla)
 */
export const BackendUserEntitySchema = z.object({
  id: z.number(),
  correo: z.string().email(),
  nombre: z.string(),
  contrasena: z.string().nullable(),
  rol: z.string().default('usuario'),
})

/**
 * Schema unificado que puede manejar ambos tipos
 */
export const BackendUserUnifiedSchema = z.union([
  BackendCreateAccountEntitySchema,
  BackendUserEntitySchema,
  // Para casos donde viene solo el user data sin profile
  z.object({
    id: z.number(),
    correo: z.string().email(),
    nombre: z.string().nullable().optional(),
    apellido: z.string().nullable().optional(),
    rol: z.string().optional().default('usuario'),
    confirmado: z.boolean().optional(),
  })
])

/**
 * Schema para AuthResponse del backend (signin/signup) - MÁS FLEXIBLE
 */
export const BackendAuthResponseSchema = z.object({
  // Para signin - estructura actual
  token: z.string().optional(),
  userId: z.number().optional(),
  
  // Para signup
  id: z.number().optional(),
  
  // Nueva estructura que vamos a implementar
  access_token: z.string().optional(),
  
  // User data más flexible
  user: z.union([
    // Estructura completa con profile
    z.object({
      id: z.number(),
      correo: z.string().email(),
      nombre: z.string().nullable().optional(),
      apellido: z.string().nullable().optional(),
      rol: z.string().optional().default('usuario'),
      confirmado: z.boolean().optional(),
      profile: z.object({
        id: z.number(),
        nombre: z.string().nullable(),
        apellido: z.string().nullable(),
        numero: z.string().nullable(),
        estado: z.string().nullable(),
        ciudad: z.string().nullable(),
        fraccionamiento: z.string().nullable(),
        calle: z.string().nullable(),
        codigoPostal: z.string().nullable(),
        imagen: z.string().optional(),
      }).optional(),
    }),
    // Estructura simple sin profile
    z.object({
      id: z.number(),
      correo: z.string().email(),
      nombre: z.string().nullable().optional(),
      apellido: z.string().nullable().optional(),
    })
  ]).optional(),
  
  // Para casos donde viene directamente como propiedades del response
  correo: z.string().email().optional(),
  nombre: z.string().nullable().optional(),
  apellido: z.string().nullable().optional(),
  rol: z.string().optional(),
  confirmado: z.boolean().optional(),
})

/**
 * Schema para LoginRequest
 */
export const BackendLoginRequestSchema = z.object({
  correo: z.string().email('Email inválido'),
  contrasena: z.string().min(1, 'Contraseña es requerida'),
})

/**
 * Schema para RegisterRequest
 */
export const BackendRegisterRequestSchema = z.object({
  correo: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  nombre: z.string().min(1, 'Nombre es requerido').optional(),
  apellido: z.string().optional(),
})

/**
 * Schema para VerifyOtpRequest
 */
export const BackendVerifyOtpRequestSchema = z.object({
  correo: z.string().email('Email inválido'),
  token: z.string().min(1, 'Token es requerido'),
})

/**
 * Schema para ResendOtpRequest
 */
export const BackendResendOtpRequestSchema = z.object({
  correo: z.string().email('Email inválido'),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema para AuthResponse normalizada en frontend
 */
export const FrontendAuthResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.number(),
    correo: z.string().email(),
    nombre: z.string().nullable(), // Puede ser null desde CreateAccount entity
    apellido: z.string().nullable(), // Puede ser null desde CreateAccount entity
  }),
  // Para compatibilidad con signup temporal
  token: z.string().optional(),
  userId: z.number().optional(),
  needsVerification: z.boolean().optional().default(false),
})

/**
 * Schema para UserProfile en frontend
 */
export const FrontendUserProfileSchema = z.object({
  id: z.number(),
  correo: z.string().email(),
  nombre: z.string().nullable(), // CreateAccount entity permite null
  apellido: z.string().nullable(), // CreateAccount entity permite null  
  rol: z.string().optional().default('usuario'),
  profile: z.object({
    id: z.number(),
    nombre: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    apellido: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    numero: z.string().nullable(), // Profile entity permite null
    estado: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    ciudad: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    fraccionamiento: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    calle: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    codigoPostal: z.string().nullable(), // Profile entity puede tener null desde CreateAccount
    imagen: z.string().optional(), // Has default value
    stripeCustomerId: z.string().nullable().optional(), // Only this one is nullable
  }).optional(),
})

/**
 * Schema para OTP Verification Response
 */
export const FrontendOtpResponseSchema = z.object({
  isOtpVerified: z.boolean(),
  access_token: z.string().optional(),
  user: z.object({
    id: z.number(),
    correo: z.string().email(),
    nombre: z.string().nullable(), // CreateAccount entity permite null
    apellido: z.string().nullable(), // CreateAccount entity permite null
  }).optional(),
})

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendCreateAccountEntity = z.infer<typeof BackendCreateAccountEntitySchema>
export type BackendUserEntity = z.infer<typeof BackendUserEntitySchema>
export type BackendUserUnified = z.infer<typeof BackendUserUnifiedSchema>
export type BackendAuthResponse = z.infer<typeof BackendAuthResponseSchema>
export type BackendLoginRequest = z.infer<typeof BackendLoginRequestSchema>
export type BackendRegisterRequest = z.infer<typeof BackendRegisterRequestSchema>
export type BackendVerifyOtpRequest = z.infer<typeof BackendVerifyOtpRequestSchema>
export type BackendResendOtpRequest = z.infer<typeof BackendResendOtpRequestSchema>

export type FrontendAuthResponse = z.infer<typeof FrontendAuthResponseSchema>
export type FrontendUserProfile = z.infer<typeof FrontendUserProfileSchema>
export type FrontendOtpResponse = z.infer<typeof FrontendOtpResponseSchema>