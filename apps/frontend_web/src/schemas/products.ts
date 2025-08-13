// schemas/products.ts - CORREGIDO SEGÚN TU ESTRUCTURA REAL

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (según la estructura REAL que devuelve tu API)
// ============================================================

/**
 * Schema para la entidad Product REAL según el error de TypeScript
 * Tu backend devuelve esta estructura exacta
 */
export const BackendProductEntitySchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  categoria: z.string().nullable(),
  
  // ✅ CAMPOS QUE SÍ TIENES (según el error)
  inventario: z.number(),
  color: z.string().nullable(),
  
  // ✅ IMAGEN como STRING (no como array de relaciones)
  imagen: z.string().nullable(),
  
  // ✅ RELACIONES OPCIONALES (pueden venir o no)
  images: z.array(z.any()).optional().default([]), // Por si acaso viene la relación
  favoritos: z.array(z.any()).optional().default([]),
  carrito: z.array(z.any()).optional().default([]),
  reviews: z.array(z.any()).optional().default([]),
})

/**
 * Schema para CreateProductDto
 */
export const BackendCreateProductDtoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  descripcion: z.string().min(1, 'Descripción es requerida'), 
  precio: z.number().positive('Precio debe ser positivo'),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional().default(0),
  color: z.string().optional().default('#000000'),
  // imagen se maneja por separado en multipart
})

/**
 * Schema para UpdateProductDto
 */
export const BackendUpdateProductDtoSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().min(1).optional(),
  precio: z.number().positive().optional(),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional(),
  color: z.string().optional(),
  // imagen se maneja por separado
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Variant para productos (compatible con CarrouselProducts)
 */
export const ProductVariantSchema = z.object({
  tipo: z.literal('Color'),
  valor: z.string(),
  price: z.number(), // ⚠️ "price" no "precio"
  inventario: z.number().int().min(0),
  sku: z.string(),
})

/**
 * Schema del producto para frontend/UI
 */
export const FrontendProductSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BD ===
  ProductID: z.number(),
  ProductName: z.string(),
  ProductDescription: z.string(),
  ProductImageUrl: z.string(),
  productPrice: z.number(),
  ProductCategory: z.string(),
  ProductStock: z.number().int().min(0),
  Color: z.string(),
  
  // === CAMPOS EXTRA PARA UI ===
  ProductSlug: z.string(),
  ProductBrand: z.string(),
  ProductSellerName: z.string(),
  ProductStatus: z.boolean(),
  ProductSold: z.number().int().min(0),
  
  // === VARIANTS PARA CARROUSEL ===
  variants: z.array(ProductVariantSchema),
  ProductCupons: z.array(z.any()),
})

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendProductEntity = z.infer<typeof BackendProductEntitySchema>
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductDtoSchema>
export type BackendUpdateProductDto = z.infer<typeof BackendUpdateProductDtoSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>
export type FrontendProduct = z.infer<typeof FrontendProductSchema>