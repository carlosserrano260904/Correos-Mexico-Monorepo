// schemas/cart.ts - Esquemas de validación para el carrito con Zod

import { z } from 'zod'
import { sanitizeImageUrl } from '@/utils/mappers'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real de la base de datos)
// ============================================================

/**
 * Schema para la entidad Carrito del backend
 */
export const BackendCartItemSchema = z.object({
  id: z.number(),
  cantidad: z.number().int().positive(),
  precio_unitario: z.coerce.number(),
  activo: z.boolean(),
  usuario: z.object({
    id: z.number(),
  }).optional(),
  producto: z.object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.coerce.number(),
    categoria: z.string().nullable(),
    inventario: z.coerce.number(),
    color: z.string(),
    marca: z.string(),
    slug: z.string(),
    vendedor: z.string(),
    estado: z.boolean(),
    vendidos: z.coerce.number(),
    sku: z.string(),
    images: z.array(z.object({
      id: z.number(),
      url: z.string(),
      orden: z.number(),
    })).optional().default([]),
  }),
})

/**
 * Schema para la respuesta del carrito del backend
 */
export const BackendCartResponseSchema = z.object({
  items: z.array(BackendCartItemSchema),
  subtotal: z.coerce.number(),
  total: z.coerce.number(),
})

/**
 * Schema para CreateCarritoDto (matches backend exactly)
 */
export const BackendCreateCartDtoSchema = z.object({
  profileId: z.number().int().positive(),
  productId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
})

/**
 * Schema para EditarCantidadDto
 */
export const BackendUpdateCartDtoSchema = z.object({
  cantidad: z.number().int().positive(),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema del item del carrito para frontend/UI (mapeado desde backend)
 */
export const FrontendCartItemSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  CartItemId: z.number(), // id del item en carrito
  ProductID: z.number(), // producto.id
  ProductName: z.string(), // producto.nombre
  ProductDescription: z.string(), // producto.descripcion
  productPrice: z.number(), // producto.precio
  ProductCategory: z.string().nullable(), // producto.categoria
  ProductStock: z.number().int().min(0), // producto.inventario
  Color: z.string(), // producto.color
  ProductBrand: z.string(), // producto.marca
  ProductSlug: z.string(), // producto.slug
  ProductSellerName: z.string(), // producto.vendedor
  ProductStatus: z.boolean(), // producto.estado
  ProductSold: z.number().int().min(0), // producto.vendidos
  ProductSKU: z.string(), // producto.sku
  
  // === DATOS DEL CARRITO ===
  prodcutQuantity: z.number().int().positive(), // cantidad
  unitPrice: z.number(), // precio_unitario
  isActive: z.boolean(), // activo
  
  // === IMÁGENES ===
  ProductImageUrl: z.string().optional(), // URL principal (primera imagen)
  ProductImages: z.array(z.object({
    id: z.number(),
    url: z.string(),
    orden: z.number(),
  })).optional().default([]), // Todas las imágenes
  
  // === CAMPOS EXTRA PARA UI ===
  isSelected: z.boolean().default(true), // Para selección multiple en UI
})

/**
 * Schema del carrito completo para frontend
 */
export const FrontendCartSchema = z.object({
  items: z.array(FrontendCartItemSchema),
  subtotal: z.number(),
  total: z.number(),
  totalItems: z.number().int().min(0).default(0),
  selectedItems: z.number().int().min(0).default(0),
})

/**
 * Schema para transformar item del carrito de backend a frontend
 */
export const CartItemTransformSchema = BackendCartItemSchema.transform((backendItem) => ({
  CartItemId: backendItem.id,
  ProductID: backendItem.producto.id,
  ProductName: backendItem.producto.nombre,
  ProductDescription: backendItem.producto.descripcion,
  productPrice: backendItem.producto.precio,
  ProductCategory: backendItem.producto.categoria,
  ProductStock: backendItem.producto.inventario,
  Color: backendItem.producto.color,
  ProductBrand: backendItem.producto.marca,
  ProductSlug: backendItem.producto.slug,
  ProductSellerName: backendItem.producto.vendedor,
  ProductStatus: backendItem.producto.estado,
  ProductSold: backendItem.producto.vendidos,
  ProductSKU: backendItem.producto.sku,
  prodcutQuantity: backendItem.cantidad,
  unitPrice: backendItem.precio_unitario,
  isActive: backendItem.activo,
  ProductImageUrl: sanitizeImageUrl(backendItem.producto.images?.[0]?.url),
  ProductImages: backendItem.producto.images || [],
  isSelected: true, // Default para UI
}))

/**
 * Schema para transformar respuesta completa del carrito
 */
export const CartTransformSchema = BackendCartResponseSchema.transform((backendCart) => ({
  items: backendCart.items.map(item => CartItemTransformSchema.parse(item)),
  subtotal: backendCart.subtotal,
  total: backendCart.total,
  totalItems: backendCart.items.reduce((total, item) => total + item.cantidad, 0),
  selectedItems: backendCart.items.length, // Todos seleccionados por default
}))

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendCartItem = z.infer<typeof BackendCartItemSchema>
export type BackendCartResponse = z.infer<typeof BackendCartResponseSchema>
export type BackendCreateCartDto = z.infer<typeof BackendCreateCartDtoSchema>
export type BackendUpdateCartDto = z.infer<typeof BackendUpdateCartDtoSchema>
export type FrontendCartItem = z.infer<typeof FrontendCartItemSchema>
export type FrontendCart = z.infer<typeof FrontendCartSchema>

// ============================================================
// 🔧 SCHEMAS DE VALIDACIÓN PARA REQUESTS
// ============================================================

/**
 * Schema para validar request de agregar al carrito
 */
export const AddToCartRequestSchema = z.object({
  profileId: z.number().int().positive('Profile ID debe ser un número positivo'),
  productId: z.number().int().positive('Product ID debe ser un número positivo'),
  cantidad: z.number().int().positive('Cantidad debe ser un número positivo'),
})

/**
 * Schema para validar request de actualizar cantidad
 */
export const UpdateCartQuantityRequestSchema = z.object({
  cantidad: z.number().int().positive('Cantidad debe ser un número positivo'),
})

export type AddToCartRequest = z.infer<typeof AddToCartRequestSchema>
export type UpdateCartQuantityRequest = z.infer<typeof UpdateCartQuantityRequestSchema>