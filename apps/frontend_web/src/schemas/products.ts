// schemas/products.ts - Adaptado a la estructura real del backend

import { z } from 'zod'

// ============================================================
// 🗄️ BACKEND SCHEMAS (estructura real de la base de datos)
// ============================================================

/**
 * Schema para ProductImage entity
 */
export const BackendProductImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  orden: z.number(),
  productId: z.number(),
})

/**
 * Schema para la entidad Product real del backend
 */
export const BackendProductEntitySchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  categoria: z.string().nullable(),
  inventario: z.number(),
  color: z.string(),
  marca: z.string(),
  slug: z.string(),
  vendedor: z.string(),
  estado: z.boolean(),
  vendidos: z.number(),
  sku: z.string(),
  
  // Relaciones (opcionales cuando vienen populadas)
  images: z.array(BackendProductImageSchema).optional().default([]),
  favoritos: z.array(z.any()).optional().default([]),
  carrito: z.array(z.any()).optional().default([]),
  reviews: z.array(z.any()).optional().default([]),
})

/**
 * Schema para CreateProductDto (matches backend exactly)
 */
export const BackendCreateProductDtoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(60),
  descripcion: z.string().min(1, 'Descripción es requerida').max(120),
  precio: z.number().positive('Precio debe ser positivo'),
  categoria: z.string().optional(),
  // Only these 4 fields are supported by backend CreateProductDto
})

/**
 * Schema para UpdateProductDto (todos opcionales) - matches backend DTO exactly
 */
export const BackendUpdateProductDtoSchema = z.object({
  nombre: z.string().min(1).max(60).optional(),
  descripcion: z.string().min(1).max(120).optional(),
  precio: z.number().positive().optional(),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional(),
  // color field is not supported in backend UpdateProductDto
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema del producto para frontend/UI (mapeado desde backend)
 */
export const FrontendProductSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  ProductID: z.number(), // id
  ProductName: z.string(), // nombre
  ProductDescription: z.string(), // descripcion
  productPrice: z.number(), // precio
  ProductCategory: z.string().nullable(), // categoria
  ProductStock: z.number().int().min(0), // inventario
  Color: z.string(), // color
  ProductBrand: z.string(), // marca
  ProductSlug: z.string(), // slug
  ProductSellerName: z.string(), // vendedor
  ProductStatus: z.boolean(), // estado
  ProductSold: z.number().int().min(0), // vendidos
  ProductSKU: z.string(), // sku
  
  // === IMÁGENES ===
  ProductImageUrl: z.string().optional(), // URL principal (primera imagen)
  ProductImages: z.array(z.object({
    id: z.number(),
    url: z.string(),
    orden: z.number(),
  })).optional().default([]), // Todas las imágenes
  
  // === CAMPOS EXTRA PARA UI ===
  ProductCupons: z.array(z.any()).optional().default([]),
})

/**
 * Schema para transformar de backend a frontend
 */
export const ProductTransformSchema = BackendProductEntitySchema.transform((backendProduct) => ({
  ProductID: backendProduct.id,
  ProductName: backendProduct.nombre,
  ProductDescription: backendProduct.descripcion,
  productPrice: backendProduct.precio,
  ProductCategory: backendProduct.categoria,
  ProductStock: backendProduct.inventario,
  Color: backendProduct.color,
  ProductBrand: backendProduct.marca,
  ProductSlug: backendProduct.slug,
  ProductSellerName: backendProduct.vendedor,
  ProductStatus: backendProduct.estado,
  ProductSold: backendProduct.vendidos,
  ProductSKU: backendProduct.sku,
  ProductImageUrl: backendProduct.images?.[0]?.url || '',
  ProductImages: backendProduct.images || [],
  ProductCupons: [],
}))

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendProductEntity = z.infer<typeof BackendProductEntitySchema>
export type BackendProductImage = z.infer<typeof BackendProductImageSchema>
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductDtoSchema>
export type BackendUpdateProductDto = z.infer<typeof BackendUpdateProductDtoSchema>
export type FrontendProduct = z.infer<typeof FrontendProductSchema>