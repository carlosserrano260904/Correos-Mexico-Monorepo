// schemas/favorites.ts - Esquemas de validación para favoritos con Zod

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real de la base de datos)
// ============================================================

/**
 * Schema para la entidad Favorito del backend
 */
export const BackendFavoritoSchema = z.object({
  id: z.number(),
  fechaAgregado: z.string().datetime(), // ISO string from backend
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
 * Schema para la respuesta de favoritos del backend
 */
export const BackendFavoritesResponseSchema = z.array(BackendFavoritoSchema)

/**
 * Schema para CreateFavoritoDto (matches backend exactly)
 */
export const BackendCreateFavoritoDto = z.object({
  profileId: z.number().int().positive(),
  productId: z.number().int().positive(),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema del favorito para frontend/UI (mapeado desde backend)
 */
export const FrontendFavoriteSchema = z.object({
  // === CAMPOS DEL FAVORITO ===
  FavoriteId: z.number(), // id del favorito
  DateAdded: z.string(), // fechaAgregado (ISO string)
  
  // === CAMPOS DEL PRODUCTO (mapeados desde backend) ===
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
  
  // === IMÁGENES ===
  ProductImageUrl: z.string().optional(), // URL principal (primera imagen)
  ProductImages: z.array(z.object({
    id: z.number(),
    url: z.string(),
    orden: z.number(),
  })).optional().default([]), // Todas las imágenes
})

/**
 * Schema de la lista de favoritos para frontend
 */
export const FrontendFavoritesSchema = z.object({
  favorites: z.array(FrontendFavoriteSchema),
  totalFavorites: z.number().int().min(0).default(0),
})

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendFavorito = z.infer<typeof BackendFavoritoSchema>
export type BackendFavoritesResponse = z.infer<typeof BackendFavoritesResponseSchema>
export type BackendCreateFavoritoDto = z.infer<typeof BackendCreateFavoritoDto>
export type FrontendFavorite = z.infer<typeof FrontendFavoriteSchema>
export type FrontendFavorites = z.infer<typeof FrontendFavoritesSchema>

// ============================================================
// 🔧 SCHEMAS DE VALIDACIÓN PARA REQUESTS
// ============================================================

/**
 * Schema para validar request de agregar a favoritos
 */
export const AddToFavoritesRequestSchema = z.object({
  profileId: z.number().int().positive('Profile ID debe ser un número positivo'),
  productId: z.number().int().positive('Product ID debe ser un número positivo'),
})

/**
 * Schema para validar request de eliminar de favoritos
 */
export const RemoveFromFavoritesRequestSchema = z.object({
  favoriteId: z.number().int().positive('Favorite ID debe ser un número positivo'),
})

export type AddToFavoritesRequest = z.infer<typeof AddToFavoritesRequestSchema>
export type RemoveFromFavoritesRequest = z.infer<typeof RemoveFromFavoritesRequestSchema>