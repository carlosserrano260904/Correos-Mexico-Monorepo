// schemas/products.ts
import { z } from 'zod';

// schemas/products.ts
export const BackendProductSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  precio: z.number(),
  imagen: z.string().nullable().optional(),
  categoria: z.string().nullable(),
  inventario: z.number(),
  color: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  peso: z.number().nullable().optional(),
  dimensiones: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const FrontendProductSchema = z.object({
  ProductID: z.number(),
  ProductName: z.string(),
  ProductDescription: z.string(),
  productPrice: z.number(),
  ProductImageUrl: z.string().nullable().optional(),
  ProductCategory: z.string().nullable(),
  productStockQuantity: z.number(),
  ProductColors: z.array(z.string()),
  ProductBrand: z.string().nullable(),
  ProductWeight: z.number().nullable(),
  ProductDimensions: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Esquema para crear producto
export const BackendCreateProductSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  categoria: z.string().nullable().optional(),
  inventario: z.number().min(0, "El inventario debe ser mayor o igual a 0"),
  color: z.string().nullable().optional(),
  marca: z.string().nullable().optional(),
  peso: z.number().nullable().optional(),
  dimensiones: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});



// Tipos
export type BackendProduct = z.infer<typeof BackendProductSchema>;
export type FrontendProduct = z.infer<typeof FrontendProductSchema>;
export type BackendCreateProductDto = z.infer<typeof BackendCreateProductSchema>;