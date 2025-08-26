// schemas/payments.ts - Esquemas de validación para pagos y tarjetas con Zod

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real de la base de datos)
// ============================================================

/**
 * Schema para la entidad Card del backend
 */
export const BackendCardSchema = z.object({
  id: z.number(),
  stripeCardId: z.string().optional(),
  ipeCardId: z.string().optional(), // Para manejar el typo en algunos registros
  last4: z.string(),
  brand: z.string(), // visa, mastercard, amex, etc.
  profile: z.object({
    id: z.number(),
  }).optional(),
  profileId: z.number(),
}).transform((data) => ({
  ...data,
  // Normalizar el campo stripeCardId
  stripeCardId: data.stripeCardId || data.ipeCardId || '',
}))

/**
 * Schema para CreateCardDto del backend
 */
export const BackendCreateCardDtoSchema = z.object({
  stripeCustomerId: z.string(),
  token: z.string(), // Token de Stripe
  profileId: z.number().int().positive(),
})

/**
 * Schema para respuesta de confirmar pago del backend
 */
export const BackendPaymentConfirmationSchema = z.object({
  status: z.literal('success'),
  message: z.string(),
  paymentIntentId: z.string(),
  profile: z.object({
    id: z.number(),
  }),
})

/**
 * Schema para Transaction entity del backend
 */
export const BackendTransactionSchema = z.object({
  id: z.number(),
  total: z.coerce.number(),
  diaTransaccion: z.string().or(z.date()),
  profileId: z.number(),
  profile: z.object({
    id: z.number(),
  }).optional(),
  contenidos: z.array(z.object({
    id: z.number(),
    precio: z.coerce.number(),
    cantidad: z.number().int().positive(),
    producto: z.object({
      id: z.number(),
      nombre: z.string(),
      precio: z.coerce.number(),
    }),
  })).optional().default([]),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema de tarjeta para frontend/UI (mapeado desde backend)
 */
export const FrontendCardSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  CardId: z.number(), // id
  StripeCardId: z.string(), // stripeCardId
  Last4: z.string(), // last4
  Brand: z.string(), // brand
  ProfileId: z.number(), // profileId
  
  // === CAMPOS EXTRA PARA UI ===
  isSelected: z.boolean().default(false), // Para selección en UI
  isDefault: z.boolean().default(false), // Tarjeta por defecto
  
  // === CAMPOS COMPUTADOS PARA UI ===
  DisplayName: z.string().optional(), // "Visa ***1234"
  CardType: z.string().optional(), // Para iconos: 'visa', 'mastercard', etc.
  MaskedNumber: z.string().optional(), // "**** **** **** 1234"
})

/**
 * Schema de lista de tarjetas para frontend
 */
export const FrontendCardsListSchema = z.object({
  cards: z.array(FrontendCardSchema),
  totalCards: z.number().int().min(0).default(0),
  defaultCardId: z.number().nullable().optional(),
})

/**
 * Schema de pago para frontend
 */
export const FrontendPaymentSchema = z.object({
  // === INFORMACIÓN DE PAGO ===
  PaymentId: z.string(), // paymentIntentId de Stripe
  Status: z.string(), // 'success', 'pending', 'failed'
  Amount: z.number(), // Total en centavos
  Currency: z.string().default('mxn'),
  
  // === INFORMACIÓN DE TARJETA USADA ===
  CardUsed: FrontendCardSchema.optional(),
  
  // === INFORMACIÓN DEL PERFIL ===
  ProfileId: z.number(),
  
  // === TIMESTAMPS ===
  CreatedAt: z.string().or(z.date()),
  
  // === CAMPOS EXTRA PARA UI ===
  FormattedAmount: z.string().optional(), // "$100.50 MXN"
  StatusMessage: z.string().optional(), // Mensaje descriptivo
})

/**
 * Schema de transacción para frontend
 */
export const FrontendTransactionSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  TransactionId: z.number(), // id
  Total: z.number(), // total
  Date: z.string().or(z.date()), // diaTransaccion
  ProfileId: z.number(), // profileId
  
  // === PRODUCTOS/ITEMS ===
  Items: z.array(z.object({
    ItemId: z.number(), // contenidos[].id
    ProductName: z.string(), // contenidos[].producto.nombre
    Price: z.number(), // contenidos[].precio
    Quantity: z.number(), // contenidos[].cantidad
    Subtotal: z.number(), // precio * cantidad
  })).default([]),
  
  // === CAMPOS COMPUTADOS PARA UI ===
  FormattedDate: z.string().optional(), // "15 Dic 2024"
  FormattedTotal: z.string().optional(), // "$150.00"
  ItemsCount: z.number().optional(), // Total de items
})

/**
 * Schema para transformar tarjeta de backend a frontend
 */
export const CardTransformSchema = BackendCardSchema.transform((backendCard) => ({
  CardId: backendCard.id,
  StripeCardId: backendCard.stripeCardId,
  Last4: backendCard.last4,
  Brand: backendCard.brand,
  ProfileId: backendCard.profileId,
  isSelected: false,
  isDefault: false,
  DisplayName: `${backendCard.brand.toUpperCase()} ***${backendCard.last4}`,
  CardType: backendCard.brand.toLowerCase(),
  MaskedNumber: `**** **** **** ${backendCard.last4}`,
}))

/**
 * Schema para transformar transacción de backend a frontend
 */
export const TransactionTransformSchema = BackendTransactionSchema.transform((backendTransaction) => {
  const items = (backendTransaction.contenidos || []).map(item => ({
    ItemId: item.id,
    ProductName: item.producto.nombre,
    Price: item.precio,
    Quantity: item.cantidad,
    Subtotal: item.precio * item.cantidad,
  }))

  return {
    TransactionId: backendTransaction.id,
    Total: backendTransaction.total,
    Date: backendTransaction.diaTransaccion,
    ProfileId: backendTransaction.profileId,
    Items: items,
    FormattedDate: new Date(backendTransaction.diaTransaccion).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    FormattedTotal: `$${backendTransaction.total.toFixed(2)}`,
    ItemsCount: items.reduce((total, item) => total + item.Quantity, 0),
  }
})

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendCard = z.infer<typeof BackendCardSchema>
export type BackendCreateCardDto = z.infer<typeof BackendCreateCardDtoSchema>
export type BackendPaymentConfirmation = z.infer<typeof BackendPaymentConfirmationSchema>
export type BackendTransaction = z.infer<typeof BackendTransactionSchema>

export type FrontendCard = z.infer<typeof FrontendCardSchema>
export type FrontendCardsList = z.infer<typeof FrontendCardsListSchema>
export type FrontendPayment = z.infer<typeof FrontendPaymentSchema>
export type FrontendTransaction = z.infer<typeof FrontendTransactionSchema>

// ============================================================
// 🔧 SCHEMAS DE VALIDACIÓN PARA REQUESTS
// ============================================================

/**
 * Schema para validar request de agregar tarjeta
 */
export const AddCardRequestSchema = z.object({
  stripeCustomerId: z.string().min(1, 'Stripe Customer ID es requerido'),
  token: z.string().min(1, 'Token de Stripe es requerido'),
  profileId: z.number().int().positive('Profile ID debe ser un número positivo'),
})

/**
 * Schema para validar request de confirmar pago
 */
export const ConfirmPaymentRequestSchema = z.object({
  profileId: z.string().or(z.number()).transform(val => String(val)),
  total: z.number().positive('El total debe ser un número positivo'),
})

/**
 * Schema para validar request de eliminar tarjeta
 */
export const DeleteCardRequestSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment Method ID es requerido'),
  profileId: z.number().int().positive('Profile ID debe ser un número positivo'),
})

/**
 * Schema para validar datos de formulario de tarjeta (frontend)
 */
export const CardFormSchema = z.object({
  NombreTarjeta: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  NumeroTarjeta: z.string()
    .min(13, 'Número de tarjeta muy corto')
    .max(19, 'Número de tarjeta muy largo')
    .regex(/^[0-9\s]+$/, 'Solo se permiten números y espacios'),
  FechaExpiracion: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato debe ser MM/AA')
    .refine((val) => {
      const [month, year] = val.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, 'La tarjeta está vencida'),
  CodigoSeguridad: z.string()
    .min(3, 'CVV debe tener al menos 3 dígitos')
    .max(4, 'CVV debe tener máximo 4 dígitos')
    .regex(/^\d+$/, 'CVV solo puede contener números'),
})

export type AddCardRequest = z.infer<typeof AddCardRequestSchema>
export type ConfirmPaymentRequest = z.infer<typeof ConfirmPaymentRequestSchema>
export type DeleteCardRequest = z.infer<typeof DeleteCardRequestSchema>
export type CardFormData = z.infer<typeof CardFormSchema>