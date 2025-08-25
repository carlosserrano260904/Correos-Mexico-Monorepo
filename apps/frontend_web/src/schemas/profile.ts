// schemas/profile.ts - Profile schemas with Zod validation

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real del backend)
// ============================================================

/**
 * Schema para Profile entity del backend
 */
export const BackendProfileEntitySchema = z.object({
  id: z.number(),
  nombre: z.string().nullable(), // Allow null values for existing users
  apellido: z.string().nullable(), // Allow null values for existing users
  numero: z.string().nullable(), // Allow null values for existing users
  estado: z.string().nullable(), // Allow null values for existing users
  ciudad: z.string().nullable(), // Allow null values for existing users
  fraccionamiento: z.string().nullable(), // Allow null values for existing users
  calle: z.string().nullable(), // Allow null values for existing users
  codigoPostal: z.string().nullable(), // Allow null values for existing users
  imagen: z.string().optional().default('https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'), // avatar with default
  stripeCustomerId: z.string().nullable().optional(), // Only nullable field
  // Relations (optional when populated)
  usuario: z.any().optional(), // CreateAccount relation
  transactions: z.array(z.any()).optional().default([]),
  favoritos: z.array(z.any()).optional().default([]),
  carrito: z.array(z.any()).optional().default([]),
  direcciones: z.array(z.any()).optional().default([]),
  cards: z.array(z.any()).optional().default([]),
  reviews: z.array(z.any()).optional().default([]),
})

/**
 * Schema para CreateProfileDto del backend
 */
export const BackendCreateProfileDtoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(30),
  apellido: z.string().min(1, 'Apellido es requerido').max(30),
  numero: z.string()
    .min(10, 'Número debe tener al menos 10 dígitos')
    .max(15, 'Número no puede exceder 15 caracteres')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'El número solo puede contener dígitos, espacios, guiones, paréntesis y el símbolo +'),
  estado: z.string().min(1, 'Estado es requerido'),
  ciudad: z.string().min(1, 'Ciudad es requerida'),
  fraccionamiento: z.string().min(1, 'Fraccionamiento es requerido'),
  calle: z.string().min(1, 'Calle es requerida'),
  codigoPostal: z.string().min(1, 'Código postal es requerido').max(5),
})

/**
 * Schema para UpdateProfileDto del backend (todos opcionales)
 */
export const BackendUpdateProfileDtoSchema = z.object({
  nombre: z.string().min(1).max(30).optional(),
  apellido: z.string().min(1).max(30).optional(),
  numero: z.string()
    .min(10, 'Número debe tener al menos 10 dígitos')
    .max(15, 'Número no puede exceder 15 caracteres')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'El número solo puede contener dígitos, espacios, guiones, paréntesis y el símbolo +')
    .optional(),
  estado: z.string().min(1).optional(),
  ciudad: z.string().min(1).optional(),
  fraccionamiento: z.string().min(1).optional(),
  calle: z.string().min(1).optional(),
  codigoPostal: z.string().min(1).max(5).optional(),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema del perfil para frontend/UI
 */
export const FrontendProfileSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  id: z.number(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  telefono: z.string().nullable(), // numero -> telefono (can be null for existing users)
  estado: z.string().nullable(),
  ciudad: z.string().nullable(),
  fraccionamiento: z.string().nullable(),
  calle: z.string().nullable(),
  codigoPostal: z.string().nullable(),
  avatar: z.string().optional(), // imagen -> avatar
  
  // === CAMPOS EXTRA PARA UI ===
  direccionCompleta: z.string().optional(), // computed field
  nombreCompleto: z.string().optional(), // computed field
})

/**
 * Schema para transformar de backend a frontend
 */
export const ProfileTransformSchema = BackendProfileEntitySchema.transform((backendProfile) => ({
  id: backendProfile.id,
  nombre: backendProfile.nombre,
  apellido: backendProfile.apellido,
  telefono: backendProfile.numero, // numero -> telefono
  estado: backendProfile.estado,
  ciudad: backendProfile.ciudad,
  fraccionamiento: backendProfile.fraccionamiento,
  calle: backendProfile.calle,
  codigoPostal: backendProfile.codigoPostal,
  avatar: backendProfile.imagen, // imagen -> avatar
  
  // Computed fields
  direccionCompleta: `${backendProfile.calle}, ${backendProfile.fraccionamiento}, ${backendProfile.ciudad}, ${backendProfile.estado} ${backendProfile.codigoPostal}`,
  nombreCompleto: `${backendProfile.nombre} ${backendProfile.apellido}`,
}))

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendProfileEntity = z.infer<typeof BackendProfileEntitySchema>
export type BackendCreateProfileDto = z.infer<typeof BackendCreateProfileDtoSchema>
export type BackendUpdateProfileDto = z.infer<typeof BackendUpdateProfileDtoSchema>
export type FrontendProfile = z.infer<typeof FrontendProfileSchema>

// Legacy compatibility
export type Profile = FrontendProfile
export type CreateProfileRequest = BackendCreateProfileDto
export type UpdateProfileRequest = BackendUpdateProfileDto