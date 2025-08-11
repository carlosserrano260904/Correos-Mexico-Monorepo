import { z } from 'zod'

export const BackendProductEntitySchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  imagen: z.string().nullable(),
  inventario: z.number(),
  // Aceptar string o number y normalizar a number
  precio: z.union([z.string(), z.number()]).transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return isNaN(num) ? 0 : num;
  }),
  categoria: z.string().nullable(),
  color: z.string().nullable(),
});


/**
 * Schema que coincide EXACTAMENTE con tu CreateProductDto
 */
  export const BackendCreateProductDtoSchema = z.object({
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    inventario: z.number(),
    precio: z.number(),
    categoria: z.string().min(1),
    color: z.string().min(1),
    // imagen NO va aquí, se maneja como file upload separado
  })

/**
 * Schema que coincide EXACTAMENTE con tu UpdateProductDto
 */
export const BackendUpdateProductDtoSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  imagen: z.string().min(1), // UpdateDto SÍ incluye imagen
  inventario: z.number(),
  precio: z.number(),
  categoria: z.string().min(1),
  color: z.string().min(1),
})

/**
 * Schema para el frontend - campos del backend + campos extra para UI
 */
// REEMPLAZAR el FrontendProductSchema existente por este:

/**
 * Schema para el frontend - COMPATIBLE con ProductosProps existente
 */
export const FrontendProductSchema = z.object({
  // ===== CAMPOS REALES DEL BACKEND (mapeados) =====
  ProductID: z.number(),
  ProductName: z.string(),
  ProductDescription: z.string(),
  ProductImageUrl: z.string(),
  ProductStock: z.number(),
  productPrice: z.number(),
  ProductCategory: z.string(),
  Color: z.string().nullable(),
  
  // ===== CAMPOS EXTRA PARA COMPATIBILIDAD CON ProductosProps =====
  ProductSlug: z.string().optional().default(''),
  ProductBrand: z.string().optional().default('Sin marca'),
  ProductSellerName: z.string().optional().default('Tienda'),
  ProductStatus: z.boolean().optional().default(true),
  ProductSold: z.number().optional().default(0),
  
  // ✅ VARIANTS COMPATIBLE con el VariantSchema original
  variants: z.array(z.object({
    tipo: z.enum(['Color', 'Talla']),
    price: z.number().min(0), // ← price (no precio)
    valor: z.string(),
    inventario: z.number(),
    sku: z.string(), // ← agregar sku requerido
  })).optional().default([]),
  
  ProductCupons: z.array(z.number()).optional().default([]),
})

// Para mantener compatibilidad total
export type FrontendProduct = z.infer<typeof FrontendProductSchema>

// ✅ HACER QUE FrontendProduct SEA COMPATIBLE CON ProductosProps
export type ProductosPropsCompatible = FrontendProduct

// ===== TYPES INFERIDOS =====
export type BackendProductEntity = z.infer<typeof BackendProductEntitySchema>
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductDtoSchema>  
export type BackendUpdateProductDto = z.infer<typeof BackendUpdateProductDtoSchema>

// Para mantener compatibilidad con tu código existente
export type SimpleProduct = FrontendProduct

