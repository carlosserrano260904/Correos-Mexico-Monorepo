// schemas/address.ts - Esquemas de validación para direcciones con Zod

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real de la base de datos)
// ============================================================

/**
 * Schema para la entidad Misdireccione del backend
 */
export const BackendAddressSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  calle: z.string(),
  colonia_fraccionamiento: z.string(),
  numero_interior: z.number().nullable(),
  numero_exterior: z.number().nullable(),
  numero_celular: z.string(),
  codigo_postal: z.string(),
  estado: z.string(),
  municipio: z.string(),
  mas_info: z.string().nullable(),
  usuario: z.object({
    id: z.number(),
  }).optional(),
})

/**
 * Schema para CreateMisdireccioneDto (matches backend exactly)
 */
export const BackendCreateAddressDtoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  calle: z.string().min(1, 'La calle es obligatoria'),
  colonia_fraccionamiento: z.string().min(1, 'La colonia/fraccionamiento es obligatoria'),
  numero_interior: z.number().nullable().optional(),
  numero_exterior: z.number().nullable().optional(),
  numero_celular: z.string().min(10, 'El número debe tener al menos 10 dígitos'),
  codigo_postal: z.string().min(5, 'El código postal debe tener al menos 5 dígitos').max(5, 'El código postal debe tener máximo 5 dígitos'),
  estado: z.string().min(1, 'El estado es obligatorio'),
  municipio: z.string().min(1, 'El municipio es obligatorio'),
  mas_info: z.string().optional(),
  usuarioId: z.number().int().positive('El ID del usuario debe ser un número positivo'),
})

/**
 * Schema para UpdateMisdireccioneDto
 */
export const BackendUpdateAddressDtoSchema = BackendCreateAddressDtoSchema.partial()

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema de dirección para frontend/UI (mapeado desde backend)
 */
export const FrontendAddressSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  AddressId: z.number(), // id
  AddressName: z.string(), // nombre
  Street: z.string(), // calle
  Neighborhood: z.string(), // colonia_fraccionamiento
  InteriorNumber: z.number().nullable(), // numero_interior
  ExteriorNumber: z.number().nullable(), // numero_exterior
  PhoneNumber: z.string(), // numero_celular
  PostalCode: z.string(), // codigo_postal
  State: z.string(), // estado
  Municipality: z.string(), // municipio
  AdditionalInfo: z.string().nullable(), // mas_info
  UserId: z.number(), // usuario.id
  
  // === CAMPOS EXTRA PARA UI ===
  isDefault: z.boolean().default(false), // Para marcar dirección por defecto
  isSelected: z.boolean().default(false), // Para selección en formularios
  
  // === CAMPOS COMPUTADOS ===
  FullAddress: z.string().optional(), // Dirección completa formateada
})

/**
 * Schema para transformar dirección de backend a frontend
 */
export const AddressTransformSchema = BackendAddressSchema.transform((backendAddress) => ({
  AddressId: backendAddress.id,
  AddressName: backendAddress.nombre,
  Street: backendAddress.calle,
  Neighborhood: backendAddress.colonia_fraccionamiento,
  InteriorNumber: backendAddress.numero_interior,
  ExteriorNumber: backendAddress.numero_exterior,
  PhoneNumber: backendAddress.numero_celular,
  PostalCode: backendAddress.codigo_postal,
  State: backendAddress.estado,
  Municipality: backendAddress.municipio,
  AdditionalInfo: backendAddress.mas_info,
  UserId: backendAddress.usuario?.id || 0,
  isDefault: false,
  isSelected: false,
  FullAddress: formatFullAddress({
    calle: backendAddress.calle,
    numero_interior: backendAddress.numero_interior,
    numero_exterior: backendAddress.numero_exterior,
    colonia_fraccionamiento: backendAddress.colonia_fraccionamiento,
    municipio: backendAddress.municipio,
    estado: backendAddress.estado,
    codigo_postal: backendAddress.codigo_postal,
  }),
}))

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendAddress = z.infer<typeof BackendAddressSchema>
export type BackendCreateAddressDto = z.infer<typeof BackendCreateAddressDtoSchema>
export type BackendUpdateAddressDto = z.infer<typeof BackendUpdateAddressDtoSchema>
export type FrontendAddress = z.infer<typeof FrontendAddressSchema>

// ============================================================
// 🔧 SCHEMAS DE VALIDACIÓN PARA REQUESTS
// ============================================================

/**
 * Schema para validar request de crear dirección
 */
export const CreateAddressRequestSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100, 'El nombre es muy largo'),
  calle: z.string().min(1, 'La calle es obligatoria').max(100, 'La calle es muy larga'),
  colonia_fraccionamiento: z.string().min(1, 'La colonia/fraccionamiento es obligatoria').max(100, 'La colonia/fraccionamiento es muy larga'),
  numero_interior: z.number().nullable().optional(),
  numero_exterior: z.number().nullable().optional(),
  numero_celular: z.string()
    .min(10, 'El número debe tener al menos 10 dígitos')
    .max(15, 'El número es muy largo')
    .regex(/^[\+\-\s\d\(\)]+$/, 'El formato del número no es válido'),
  codigo_postal: z.string()
    .min(5, 'El código postal debe tener 5 dígitos')
    .max(5, 'El código postal debe tener 5 dígitos')
    .regex(/^\d{5}$/, 'El código postal debe contener solo números'),
  estado: z.string().min(1, 'El estado es obligatorio').max(50, 'El estado es muy largo'),
  municipio: z.string().min(1, 'El municipio es obligatorio').max(100, 'El municipio es muy largo'),
  mas_info: z.string().max(200, 'La información adicional es muy larga').optional(),
  usuarioId: z.number().int().positive('El ID del usuario debe ser un número positivo'),
})

/**
 * Schema para validar request de actualizar dirección
 */
export const UpdateAddressRequestSchema = CreateAddressRequestSchema.partial().omit({ usuarioId: true })

export type CreateAddressRequest = z.infer<typeof CreateAddressRequestSchema>
export type UpdateAddressRequest = z.infer<typeof UpdateAddressRequestSchema>

// ============================================================
// 🛠️ UTILITY FUNCTIONS
// ============================================================

/**
 * Formatea una dirección completa desde los campos del backend
 */
function formatFullAddress(address: {
  calle: string;
  numero_interior: number | null;
  numero_exterior: number | null;
  colonia_fraccionamiento: string;
  municipio: string;
  estado: string;
  codigo_postal: string;
}): string {
  const parts = [];
  
  // Calle y números
  let streetPart = address.calle;
  if (address.numero_exterior) {
    streetPart += ` ${address.numero_exterior}`;
  }
  if (address.numero_interior) {
    streetPart += ` Int. ${address.numero_interior}`;
  }
  parts.push(streetPart);
  
  // Colonia
  parts.push(address.colonia_fraccionamiento);
  
  // Municipio, Estado y CP
  parts.push(`${address.municipio}, ${address.estado} ${address.codigo_postal}`);
  
  return parts.join(', ');
}

/**
 * Valida un código postal mexicano
 */
export function isValidMexicanPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode);
}

/**
 * Formatea un número de teléfono mexicano
 */
export function formatMexicanPhoneNumber(phone: string): string {
  // Remover todo excepto números
  const numbers = phone.replace(/\D/g, '');
  
  // Formato para números de 10 dígitos: (XXX) XXX-XXXX
  if (numbers.length === 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  
  // Formato para números de 13 dígitos (+52): +52 (XXX) XXX-XXXX
  if (numbers.length === 13 && numbers.startsWith('52')) {
    return `+52 (${numbers.slice(2, 5)}) ${numbers.slice(5, 8)}-${numbers.slice(8)}`;
  }
  
  // Devolver el número original si no coincide con los formatos esperados
  return phone;
}

/**
 * Convierte FrontendAddress a CreateAddressRequest
 */
export function frontendAddressToCreateRequest(address: Omit<FrontendAddress, 'AddressId' | 'isDefault' | 'isSelected' | 'FullAddress'>, userId: number): CreateAddressRequest {
  return CreateAddressRequestSchema.parse({
    nombre: address.AddressName,
    calle: address.Street,
    colonia_fraccionamiento: address.Neighborhood,
    numero_interior: address.InteriorNumber,
    numero_exterior: address.ExteriorNumber,
    numero_celular: address.PhoneNumber,
    codigo_postal: address.PostalCode,
    estado: address.State,
    municipio: address.Municipality,
    mas_info: address.AdditionalInfo || undefined,
    usuarioId: userId,
  });
}

/**
 * Convierte FrontendAddress a UpdateAddressRequest
 */
export function frontendAddressToUpdateRequest(address: Partial<FrontendAddress>): UpdateAddressRequest {
  const updateData: Partial<CreateAddressRequest> = {};
  
  if (address.AddressName !== undefined) updateData.nombre = address.AddressName;
  if (address.Street !== undefined) updateData.calle = address.Street;
  if (address.Neighborhood !== undefined) updateData.colonia_fraccionamiento = address.Neighborhood;
  if (address.InteriorNumber !== undefined) updateData.numero_interior = address.InteriorNumber;
  if (address.ExteriorNumber !== undefined) updateData.numero_exterior = address.ExteriorNumber;
  if (address.PhoneNumber !== undefined) updateData.numero_celular = address.PhoneNumber;
  if (address.PostalCode !== undefined) updateData.codigo_postal = address.PostalCode;
  if (address.State !== undefined) updateData.estado = address.State;
  if (address.Municipality !== undefined) updateData.municipio = address.Municipality;
  if (address.AdditionalInfo !== undefined) updateData.mas_info = address.AdditionalInfo || undefined;
  
  return UpdateAddressRequestSchema.parse(updateData);
}