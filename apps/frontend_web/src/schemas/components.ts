// schemas/components.ts - Schemas Zod para componentes primitivos

import { z } from 'zod';

// ============================================================
// 🎯 ESQUEMAS BÁSICOS Y TIPOS COMUNES
// ============================================================

export const TipoVarianteSchema = z.enum(['Color', 'Talla']);

export const CategoriaSchema = z.enum([
  'Joyeria y Bisuteria',
  'Ropa', 
  'Hogar',
  'Alimentos y bebidas',
  'Belleza y cuidado personal',
  'Cocina',
  'Electronica',
  'Herramienta',
  'Artesanal'
]);

export const PackageStatusSchema = z.enum([
  'Orden procesada',
  'Pago confirmado',
  'Paquete enviado', 
  'Paquete en camino',
  'Paquete entregado'
]);

export const OrderStatusSchema = z.enum([
  'Completado',
  'Pendiente',
  'Cancelado'
]);

// ============================================================
// 📦 SCHEMAS PARA PRODUCTOS Y ÓRDENES
// ============================================================

/**
 * Schema para información básica de producto en orden
 */
export const ProductoOrdenSchema = z.object({
  ProductID: z.number(),
  ProductImageUrl: z.string(),
  ProductName: z.string(),
  ProductBrand: z.string(),
  productPrice: z.number(),
  ProductQuantity: z.number(),
});

/**
 * Schema para órdenes del backend (con transformación)
 */
export const BackendOrdenSchema = z.object({
  OrderID: z.number(),
  OrderInfo: z.array(ProductoOrdenSchema),
  NoProducts: z.number(),
  OrderStatus: z.number().transform((val) => {
    switch(val) {
      case 1: return 'Completado';
      case 2: return 'Pendiente';
      case 3: return 'Cancelado';
      default: return 'Desconocido';
    }
  }),
  OrderTotal: z.number(),
  OrderDate: z.string(),
  PaymentMethod: z.string(),
  ClientName: z.string(),
  Email: z.string().email(),
  PhoneNumber: z.number(),
  PackageStatus: PackageStatusSchema,
});

/**
 * Schema para componente Orden (sin transformación para props)
 */
export const OrdenComponentSchema = z.object({
  OrderID: z.number(),
  OrderInfo: z.array(ProductoOrdenSchema),
  NoProducts: z.number(),
  OrderStatus: z.number(), // Sin transformar para el componente
  OrderTotal: z.number(),
  OrderDate: z.string(),
  PaymentMethod: z.string(),
  ClientName: z.string(),
  Email: z.string().email(),
  PhoneNumber: z.number(),
  PackageStatus: PackageStatusSchema,
});

// ============================================================
// 🎫 SCHEMAS PARA CUPONES Y DESCUENTOS
// ============================================================

/**
 * Schema para cupones completos
 */
export const CuponSchema = z.object({
  CuponID: z.number(),
  CuponCode: z.string(),
  TimesUsed: z.number(),
  CuponStatus: z.number(),
  Discount: z.number(),
  EndDate: z.string(),
  CuponProductsId: z.array(z.number()),
});

/**
 * Schema para cupones en frontend (vista simplificada)
 */
export const CuponFrontendSchema = z.object({
  CuponID: z.number(),
  CuponCode: z.string(),
  TimesUsed: z.number(),
  CuponStatus: z.number(),
  EndDate: z.string(),
  variant: z.enum(['full', 'compact']).optional().default('full'),
});

/**
 * Schema para descuentos completos
 */
export const DescuentoSchema = z.object({
  DescuentoID: z.number(),
  DescuentoName: z.string(),
  TimesUsed: z.number(),
  DescuentoStatus: z.number(),
  DiscountAmount: z.number(),
  EndDate: z.string(),
  DescuentoProductsId: z.array(z.number()),
});

/**
 * Schema para descuentos en frontend
 */
export const DescuentoFrontendSchema = z.object({
  DescuentoID: z.number(),
  DescuentoName: z.string(),
  TimesUsed: z.number(),
  DescuentoStatus: z.number(),
  EndDate: z.string(),
  variant: z.enum(['full', 'compact']).optional().default('full'),
});

// ============================================================
// 🛒 SCHEMAS PARA CARRITO Y CHECKOUT
// ============================================================

/**
 * Schema para sumatoria de orden
 */
export const SumatoriaOrdenSchema = z.object({
  subtotal: z.number(),
  envio: z.union([z.number(), z.string()]),
  Total: z.number(),
});

/**
 * Schema para dirección de entrega
 */
export const UserAddressDeliverySchema = z.object({
  Nombre: z.string().min(1, 'Nombre es requerido'),
  Apellido: z.string().min(1, 'Apellido es requerido'),
  Calle: z.string().min(1, 'Calle es requerida'),
  Numero: z.string().min(1, 'Número es requerido'),
  CodigoPostal: z.string().min(5, 'Código postal debe tener al menos 5 dígitos'),
  Estado: z.string().min(1, 'Estado es requerido'),
  Municipio: z.string().min(1, 'Municipio es requerido'),
  Ciudad: z.string().min(1, 'Ciudad es requerida'),
  Colonia: z.string().min(1, 'Colonia es requerida'),
  NumeroDeTelefono: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  InstruccionesExtra: z.string().optional().default(''),
});

/**
 * Schema para método de pago
 */
export const PaymentMethodSchema = z.object({
  id: z.number(),
  NombreDeTarjeta: z.string().min(1, 'Nombre en tarjeta es requerido'),
  NumeroDeTarjeta: z.string().min(16, 'Número de tarjeta inválido'),
  FechaVencimiento: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato de fecha inválido (MM/YY)'),
  CodigoSeguridad: z.string().min(3).max(4),
  TipoTarjeta: z.enum(['Visa', 'MasterCard', 'American Express', 'Otro']),
  Banco: z.string().min(1, 'Banco es requerido'),
});

/**
 * Schema para item del carrito
 */
export const ItemCartSchema = z.object({
  ProductImageUrl: z.string(),
  ProductName: z.string(),
  productPrice: z.number(),
  prodcutQuantity: z.number().optional().default(1), // Nota: mantiene typo original por compatibilidad
});

// ============================================================
// 📋 SCHEMAS PARA FORMULARIOS
// ============================================================

/**
 * Schema para formulario de producto
 */
export const FormularioProductoSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  slug: z.string().min(1, 'Slug es requerido'),
  descripcion: z.string().min(1, 'Descripción es requerida'),
  categoria: CategoriaSchema.or(z.literal('')),
  marca: z.string().min(1, 'Marca es requerida'),
  tipo: TipoVarianteSchema.or(z.literal('')),
  valor: z.string().min(1, 'Valor es requerido'),
  inventario: z.number().int().min(0),
  imagenes: z.array(z.instanceof(File)),
  sku: z.string().min(1, 'SKU es requerido'),
});

// ============================================================
// 🎨 SCHEMAS PARA CARDS Y COMPONENTES UI
// ============================================================

/**
 * Schema para cards de resumen
 */
export const CardResumenSchema = z.object({
  icon: z.any(), // React.ElementType es difícil de validar con Zod
  Card_titulo: z.string(),
  Card_valor: z.union([z.number(), z.string()]),
  Card_cambio: z.number(),
  Card_activo: z.boolean(),
  onClick: z.function(),
});

/**
 * Schema para product cards
 */
export const ProductCardSchema = z.object({
  ProductID: z.number(),
  ProductImage: z.string(),
  ProductColors: z.array(z.string()),
  ProductName: z.string(),
  ProductPrice: z.number(),
  onClick: z.function().optional(),
});

/**
 * Schema para collection cards
 */
export const CollectionCardSchema = z.object({
  ProductID: z.number(),
  ProductImage: z.string(),
  ProductName: z.string(),
  onClick: z.function().optional(),
});

/**
 * Schema para categorías
 */
export const CategorySchema = z.object({
  imageSrc: z.string(),
  label: z.string(),
});

/**
 * Schema para carousel de categorías
 */
export const CategoriesCarouselSchema = z.object({
  categories: z.array(CategorySchema),
});

// ============================================================
// 📝 TIPOS TYPESCRIPT DERIVADOS
// ============================================================

export type TipoVariante = z.infer<typeof TipoVarianteSchema>;
export type Categoria = z.infer<typeof CategoriaSchema>;
export type PackageStatus = z.infer<typeof PackageStatusSchema>;

export type ProductoOrden = z.infer<typeof ProductoOrdenSchema>;
export type BackendOrden = z.infer<typeof BackendOrdenSchema>;
export type OrdenComponent = z.infer<typeof OrdenComponentSchema>;

export type Cupon = z.infer<typeof CuponSchema>;
export type CuponFrontend = z.infer<typeof CuponFrontendSchema>;
export type Descuento = z.infer<typeof DescuentoSchema>;
export type DescuentoFrontend = z.infer<typeof DescuentoFrontendSchema>;

export type SumatoriaOrden = z.infer<typeof SumatoriaOrdenSchema>;
export type UserAddressDelivery = z.infer<typeof UserAddressDeliverySchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type ItemCart = z.infer<typeof ItemCartSchema>;

export type FormularioProducto = z.infer<typeof FormularioProductoSchema>;

export type CardResumen = z.infer<typeof CardResumenSchema>;
export type ProductCard = z.infer<typeof ProductCardSchema>;
export type CollectionCard = z.infer<typeof CollectionCardSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type CategoriesCarousel = z.infer<typeof CategoriesCarouselSchema>;

// ============================================================
// 🛠️ HELPER FUNCTIONS - Exportadas desde el schema
// ============================================================

/**
 * 🎯 Helper para obtener clases CSS de badge de status
 */
export function getStatusBadgeClass(status: number | boolean): string {
  if (typeof status === 'boolean') {
    return status 
      ? 'text-green-400 bg-green-100' 
      : 'text-gray-400 bg-gray-100';
  }
  
  switch (status) {
    case 1:
      return 'text-green-400 bg-green-100'; // Activo
    case 2:
      return 'text-orange-400 bg-orange-100'; // Pendiente/Borrado
    case 3:
      return 'text-red-400 bg-red-100'; // Inactivo/Caducado
    default:
      return 'text-gray-400 bg-gray-100';
  }
}

/**
 * 🎯 Helper para obtener texto de status
 */
export function getStatusText(status: number | boolean): string {
  if (typeof status === 'boolean') {
    return status ? 'Activo' : 'Inactivo';
  }
  
  const statusMap: Record<number, string> = {
    1: 'Activo',
    2: 'Borrado', // Para cupones
    3: 'Caducado', // Para cupones
  };
  
  return statusMap[status] || 'Desconocido';
}

/**
 * 🎯 Helper para formatear precios
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price);
}

/**
 * 🎯 Helper para formatear fechas
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// ============================================================
// 🔧 SCHEMAS DE VALIDACIÓN PARA COMPONENTES
// ============================================================

/**
 * Schema para props de componentes con variant
 */
export const ComponentVariantSchema = z.object({
  variant: z.enum(['full', 'compact']).optional().default('full'),
});

/**
 * Schema para props de componentes clickeables
 */
export const ClickableComponentSchema = z.object({
  onClick: z.function().optional(),
});

/**
 * Schema para props de componentes con children
 */
export const ComponentWithChildrenSchema = z.object({
  children: z.any(), // React.ReactNode
  className: z.string().optional(),
});

// ============================================================
// 🧪 SCHEMAS DE TRANSFORMACIÓN
// ============================================================

/**
 * Schema para transformar status numérico a texto
 */
export const StatusTransformSchema = z.number().transform((status) => {
  const statusMap: Record<number, string> = {
    1: 'Activo',
    2: 'Inactivo', 
    3: 'Archivado',
  };
  return statusMap[status] || 'Desconocido';
});

/**
 * Schema para transformar boolean a texto de estado
 */
export const BooleanStatusTransformSchema = z.boolean().transform((status) => 
  status ? 'Activo' : 'Archivado'
);

// ============================================================
// 🎯 SCHEMAS ESPECÍFICOS PARA TUS COMPONENTES PRIMITIVOS
// ============================================================

/**
 * Schema específico para el componente Producto
 * (usando el FrontendProduct como base pero con campos opcionales para el componente)
 */
export const ProductoComponentSchema = z.object({
  // Campos básicos requeridos
  ProductID: z.number(),
  ProductName: z.string(),
  ProductDescription: z.string().nullable().optional(),
  ProductImageUrl: z.string().optional(),
  productPrice: z.number(),
  ProductBrand: z.string().nullable().optional(),
  ProductStatus: z.boolean(),
  ProductStock: z.number(),
  ProductCategory: z.string().nullable().optional(),
  ProductSellerName: z.string().nullable().optional(),
  ProductSold: z.number(),
  ProductSlug: z.string(),
  Color: z.string(),
  ProductSKU: z.string(),
  
  // Arrays requeridos
  ProductImages: z.array(z.object({
    id: z.number(),
    url: z.string(),
    orden: z.number(),
    productId: z.number(),
  })).default([]),
  ProductCupons: z.array(z.any()).default([]),
  
  // Campos físicos opcionales (nuevos)
  ProductHeight: z.number().nullable().optional(),
  ProductLength: z.number().nullable().optional(),
  ProductWidth: z.number().nullable().optional(),
  ProductWeight: z.number().nullable().optional(),
  ProductSellerId: z.number().nullable().optional(),
  
  // Campos calculados opcionales
  ProductVolume: z.number().optional(),
  ProductDimensions: z.string().optional(),
  ProductWeightDisplay: z.string().optional(),
  
  // Props del componente
  variant: z.enum(['full', 'compact']).optional().default('full'),
});

export type ProductoComponent = z.infer<typeof ProductoComponentSchema>;