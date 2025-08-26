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
 * Schema para la entidad Product real del backend (ACTUALIZADO)
 */
export const BackendProductEntitySchema = z.object({
  // === CAMPOS BÁSICOS ===
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number().or(z.string().transform((val) => parseFloat(val))), // Transformer de TypeORM puede devolver string
  categoria: z.string().nullable(),
  inventario: z.number(),
  color: z.string(),
  marca: z.string(),
  slug: z.string(),
  vendedor: z.string(),
  estado: z.boolean(),
  vendidos: z.number(),
  sku: z.string(),
  
  // === NUEVAS DIMENSIONES FÍSICAS (pueden no existir en la BD) ===
  altura: z.number().nullable().optional().catch(null), // Float nullable del backend - catch errors if column doesn't exist
  largo: z.number().nullable().optional().catch(null),  // Float nullable del backend - catch errors if column doesn't exist
  ancho: z.number().nullable().optional().catch(null),  // Float nullable del backend - catch errors if column doesn't exist
  peso: z.number().nullable().optional().catch(null),   // Float nullable del backend - catch errors if column doesn't exist
  
  // === CAMPO DE VENDEDOR ===
  idPerfil: z.number().nullable().optional(), // ID del perfil del vendedor
  
  // === RELACIONES (opcionales cuando vienen populadas) ===
  images: z.array(BackendProductImageSchema).optional().default([]),
  favoritos: z.array(z.any()).optional().default([]),
  carrito: z.array(z.any()).optional().default([]),
  reviews: z.array(z.any()).optional().default([]),
})

/**
 * Schema para CreateProductDto (ACTUALIZADO - matches backend exactly)
 */
export const BackendCreateProductDtoSchema = z.object({
  // === CAMPOS BÁSICOS REQUERIDOS ===
  nombre: z.string().min(1, 'Nombre es requerido').max(60),
  descripcion: z.string().min(1, 'Descripción es requerida'),
  precio: z.number().positive('Precio debe ser positivo'),
  inventario: z.number().int().min(0, 'Inventario debe ser positivo'),
  categoria: z.string().min(1, 'Categoría es requerida'),
  color: z.string().min(1, 'Color es requerido'),
  marca: z.string().min(1, 'Marca es requerida'),
  slug: z.string().min(1, 'Slug es requerido'),
  estado: z.boolean(),
  sku: z.string().min(1, 'SKU es requerido'),
  vendedor: z.string().min(1, 'Vendedor es requerido'),
  vendidos: z.number().int().min(0).optional().default(0),
  idPerfil: z.number().int(),
  
  // === DIMENSIONES FÍSICAS OPCIONALES ===
  altura: z.number().positive().optional(),
  largo: z.number().positive().optional(),
  ancho: z.number().positive().optional(),
  peso: z.number().positive().optional(),
})

/**
 * Schema para UpdateProductDto (ACTUALIZADO - todos opcionales)
 */
export const BackendUpdateProductDtoSchema = z.object({
  // === CAMPOS BÁSICOS OPCIONALES ===
  nombre: z.string().min(1).max(60).optional(),
  descripcion: z.string().min(1).optional(),
  precio: z.number().positive().optional(),
  categoria: z.string().optional(),
  inventario: z.number().int().min(0).optional(),
  color: z.string().optional(),
  marca: z.string().optional(),
  slug: z.string().optional(),
  estado: z.boolean().optional(),
  sku: z.string().optional(),
  vendedor: z.string().optional(),
  vendidos: z.number().int().min(0).optional(),
  idPerfil: z.number().int().optional(),
  
  // === DIMENSIONES FÍSICAS OPCIONALES ===
  altura: z.number().positive().optional(),
  largo: z.number().positive().optional(),
  ancho: z.number().positive().optional(),
  peso: z.number().positive().optional(),
})

// ============================================================
// 🎨 FRONTEND SCHEMAS (para tu UI)
// ============================================================

/**
 * Schema del producto para frontend/UI (ACTUALIZADO - mapeado desde backend)
 */
export const FrontendProductSchema = z.object({
  // === CAMPOS MAPEADOS DESDE BACKEND ===
  ProductID: z.number(), // id
  ProductName: z.string(), // nombre
  ProductDescription: z.string().nullable(), // descripcion - puede ser null del backend
  productPrice: z.number(), // precio
  ProductCategory: z.string().nullable(), // categoria
  ProductStock: z.number().int().min(0), // inventario
  Color: z.string(), // color
  ProductBrand: z.string().nullable(), // marca - puede ser null del backend
  ProductSlug: z.string(), // slug
  ProductSellerName: z.string().nullable(), // vendedor - puede ser null del backend
  ProductStatus: z.boolean(), // estado
  ProductSold: z.number().int().min(0), // vendidos
  ProductSKU: z.string(), // sku
  
  // === NUEVAS DIMENSIONES FÍSICAS ===
  ProductHeight: z.number().nullable().optional(), // altura
  ProductLength: z.number().nullable().optional(), // largo
  ProductWidth: z.number().nullable().optional(),  // ancho
  ProductWeight: z.number().nullable().optional(), // peso
  
  // === VENDEDOR ===
  ProductSellerId: z.number().nullable().optional(), // idPerfil
  
  // === IMÁGENES ===
  ProductImageUrl: z.string().optional(), // URL principal (primera imagen)
  ProductImages: z.array(z.object({
    id: z.number(),
    url: z.string(),
    orden: z.number(),
    productId: z.number(),
  })).optional().default([]), // Todas las imágenes
  
  // === CAMPOS EXTRA PARA UI ===
  ProductCupons: z.array(z.any()).optional().default([]),
  
  // === CAMPOS CALCULADOS PARA UI ===
  ProductVolume: z.number().optional(), // Calculado: altura * largo * ancho
  ProductDimensions: z.string().optional(), // Texto: "30 x 25 x 15 cm"
  ProductWeightDisplay: z.string().optional(), // Texto: "2.5 kg"
})

/**
 * Schema para transformar de backend a frontend (ACTUALIZADO)
 */
export const ProductTransformSchema = BackendProductEntitySchema.transform((backendProduct) => {
  // Helper para calcular volumen
  const calculateVolume = (height?: number | null, length?: number | null, width?: number | null): number | undefined => {
    if (height && length && width) {
      return height * length * width;
    }
    return undefined;
  };
  
  // Helper para formatear dimensiones
  const formatDimensions = (height?: number | null, length?: number | null, width?: number | null): string | undefined => {
    const dims = [height, length, width].filter(d => d !== null && d !== undefined);
    if (dims.length === 3) {
      return `${height} x ${length} x ${width} cm`;
    }
    return undefined;
  };
  
  // Helper para formatear peso
  const formatWeight = (weight?: number | null): string | undefined => {
    return weight ? `${weight} kg` : undefined;
  };
  
  return {
    // === CAMPOS BÁSICOS ===
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
    
    // === DIMENSIONES FÍSICAS ===
    ProductHeight: backendProduct.altura,
    ProductLength: backendProduct.largo,
    ProductWidth: backendProduct.ancho,
    ProductWeight: backendProduct.peso,
    
    // === VENDEDOR ===
    ProductSellerId: backendProduct.idPerfil,
    
    // === IMÁGENES ===
    ProductImageUrl: backendProduct.images?.[0]?.url || '',
    ProductImages: backendProduct.images || [],
    
    // === CAMPOS EXTRA PARA UI ===
    ProductCupons: [],
    
    // === CAMPOS CALCULADOS ===
    ProductVolume: calculateVolume(backendProduct.altura, backendProduct.largo, backendProduct.ancho),
    ProductDimensions: formatDimensions(backendProduct.altura, backendProduct.largo, backendProduct.ancho),
    ProductWeightDisplay: formatWeight(backendProduct.peso),
  };
})

// ============================================================
// 📝 TIPOS TYPESCRIPT
// ============================================================

export type BackendProductEntity = z.infer<typeof BackendProductEntitySchema>
export type BackendProductImage = z.infer<typeof BackendProductImageSchema>
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductDtoSchema>
export type BackendUpdateProductDto = z.infer<typeof BackendUpdateProductDtoSchema>
export type FrontendProduct = z.infer<typeof FrontendProductSchema>