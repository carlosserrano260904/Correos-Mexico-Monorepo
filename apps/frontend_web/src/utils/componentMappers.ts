// utils/componentMappers.ts - Mappers para componentes primitivos

import { 
  ProductoComponentSchema,
  CuponFrontendSchema,
  BackendOrdenSchema,
  OrdenComponentSchema,
  ItemCartSchema,
  UserAddressDeliverySchema,
  PaymentMethodSchema,
  type ProductoComponent,
  type CuponFrontend,
  type BackendOrden,
  type OrdenComponent,
  type ItemCart,
  type UserAddressDelivery,
  type PaymentMethod
} from '@/schemas/components';
import { FrontendProduct } from '@/schemas/products';

// ============================================================
// 🔄 MAPPERS PARA PRODUCTOS
// ============================================================

/**
 * 🎯 Convierte FrontendProduct a ProductoComponent para el componente Producto
 */
export function mapFrontendProductToComponent(
  product: FrontendProduct, 
  variant: 'full' | 'compact' = 'full'
): ProductoComponent & { ProductImages: any[]; ProductCupons: any[] } {
  console.log('🔄 Mapeando FrontendProduct a ProductoComponent:', product.ProductName || 'Sin nombre');
  
  try {
    const mapped = {
      // Campos básicos del producto con valores por defecto seguros
      ProductID: product.ProductID || 0,
      ProductName: product.ProductName || 'Producto sin nombre',
      ProductDescription: product.ProductDescription || 'Sin descripción',
      ProductImageUrl: product.ProductImageUrl || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
      productPrice: product.productPrice || 0,
      ProductBrand: product.ProductBrand || 'Sin marca',
      ProductStatus: product.ProductStatus ?? true,
      ProductStock: product.ProductStock || 0,
      ProductCategory: product.ProductCategory || 'Sin categoría',
      ProductSellerName: product.ProductSellerName || 'Sin vendedor',
      ProductSold: product.ProductSold || 0,
      ProductSlug: product.ProductSlug || 'sin-slug',
      Color: product.Color || '#000000',
      ProductSKU: product.ProductSKU || `SKU-${Date.now()}`,
      
      // Arrays de relaciones
      ProductImages: product.ProductImages || [],
      ProductCupons: product.ProductCupons || [],
      
      // Campos físicos nuevos (pueden ser undefined/null)
      ProductHeight: product.ProductHeight,
      ProductLength: product.ProductLength,
      ProductWidth: product.ProductWidth,
      ProductWeight: product.ProductWeight,
      ProductSellerId: product.ProductSellerId,
      
      // Campos calculados
      ProductVolume: product.ProductVolume,
      ProductDimensions: product.ProductDimensions,
      ProductWeightDisplay: product.ProductWeightDisplay,
      
      // Props del componente
      variant,
    };
    
    // Validar con Zod y asegurar campos requeridos
    const validated = ProductoComponentSchema.parse(mapped);
    
    console.log('✅ Mapeo validado exitosamente');
    console.log('📋 Validated object keys:', Object.keys(validated));
    console.log('📋 ProductImages present:', 'ProductImages' in validated);
    console.log('📋 ProductCupons present:', 'ProductCupons' in validated);
    
    return validated;
  } catch (error) {
    console.error('❌ Error en mapFrontendProductToComponent:', error);
    console.error('Producto que causó el error:', product);
    throw error; // Re-lanzar para que el componente pueda usar el fallback
  }
}

/**
 * 🎯 Convierte array de FrontendProduct a array de ProductoComponent
 */
export function mapFrontendProductsToComponents(
  products: FrontendProduct[],
  variant: 'full' | 'compact' = 'full'
): ProductoComponent[] {
  console.log(`🔄 Mapeando ${products.length} productos a componentes`);
  
  return products.map(product => 
    mapFrontendProductToComponent(product, variant)
  );
}

// ============================================================
// 🎫 MAPPERS PARA CUPONES
// ============================================================

/**
 * 🎯 Mapper básico para cupones del backend a frontend
 */
export function mapBackendCuponToFrontend(
  backendCupon: any, // Desde tu backend
  variant: 'full' | 'compact' = 'full'
): CuponFrontend {
  console.log('🔄 Mapeando cupón del backend:', backendCupon.CuponCode);
  
  const mapped = {
    CuponID: backendCupon.id || backendCupon.CuponID,
    CuponCode: backendCupon.codigo || backendCupon.CuponCode,
    TimesUsed: backendCupon.vecesUsado || backendCupon.TimesUsed || 0,
    CuponStatus: backendCupon.estado || backendCupon.CuponStatus || 1,
    EndDate: backendCupon.fechaVencimiento || backendCupon.EndDate,
    variant,
  };
  
  const validated = CuponFrontendSchema.parse(mapped);
  console.log('✅ Cupón validado exitosamente');
  
  return validated;
}

// ============================================================
// 📦 MAPPERS PARA ÓRDENES
// ============================================================

/**
 * 🎯 Mapper básico para órdenes del backend
 */
export function mapBackendOrdenToFrontend(backendOrden: any): OrdenComponent {
  console.log('🔄 Mapeando orden del backend:', backendOrden.OrderID);
  
  const mapped = {
    OrderID: backendOrden.id || backendOrden.OrderID,
    OrderInfo: backendOrden.productos || backendOrden.OrderInfo || [],
    NoProducts: backendOrden.numeroProductos || backendOrden.NoProducts || 0,
    OrderStatus: backendOrden.estado || backendOrden.OrderStatus || 2,
    OrderTotal: backendOrden.total || backendOrden.OrderTotal || 0,
    OrderDate: backendOrden.fechaCreacion || backendOrden.OrderDate,
    PaymentMethod: backendOrden.metodoPago || backendOrden.PaymentMethod || 'No especificado',
    ClientName: backendOrden.nombreCliente || backendOrden.ClientName,
    Email: backendOrden.emailCliente || backendOrden.Email,
    PhoneNumber: backendOrden.telefonoCliente || backendOrden.PhoneNumber || 0,
    PackageStatus: backendOrden.estadoPaquete || backendOrden.PackageStatus || 'Orden procesada',
  };
  
  const validated = OrdenComponentSchema.parse(mapped);
  console.log('✅ Orden validada exitosamente');
  
  return validated;
}

// ============================================================
// 🛒 MAPPERS PARA CARRITO
// ============================================================

/**
 * 🎯 Convierte FrontendProduct a ItemCart para el carrito
 */
export function mapFrontendProductToCartItem(
  product: FrontendProduct,
  quantity: number = 1
): ItemCart {
  console.log('🔄 Convirtiendo producto a item de carrito:', product.ProductName);
  
  const mapped = {
    ProductImageUrl: product.ProductImageUrl || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
    ProductName: product.ProductName,
    productPrice: product.productPrice,
    prodcutQuantity: quantity, // Mantiene el typo por compatibilidad
  };
  
  const validated = ItemCartSchema.parse(mapped);
  console.log('✅ Item de carrito validado exitosamente');
  
  return validated;
}

// ============================================================
// 📍 MAPPERS PARA DIRECCIONES Y PAGOS
// ============================================================

/**
 * 🎯 Mapper para direcciones de entrega
 */
export function mapBackendAddressToFrontend(backendAddress: any): UserAddressDelivery {
  console.log('🔄 Mapeando dirección del backend');
  
  const mapped = {
    Nombre: backendAddress.nombre || backendAddress.Nombre,
    Apellido: backendAddress.apellido || backendAddress.Apellido,
    Calle: backendAddress.calle || backendAddress.Calle,
    Numero: backendAddress.numero || backendAddress.Numero,
    CodigoPostal: backendAddress.codigoPostal || backendAddress.CodigoPostal,
    Estado: backendAddress.estado || backendAddress.Estado,
    Municipio: backendAddress.municipio || backendAddress.Municipio,
    Ciudad: backendAddress.ciudad || backendAddress.Ciudad,
    Colonia: backendAddress.colonia || backendAddress.Colonia,
    NumeroDeTelefono: backendAddress.telefono || backendAddress.NumeroDeTelefono,
    InstruccionesExtra: backendAddress.instrucciones || backendAddress.InstruccionesExtra || '',
  };
  
  const validated = UserAddressDeliverySchema.parse(mapped);
  console.log('✅ Dirección validada exitosamente');
  
  return validated;
}

/**
 * 🎯 Mapper para métodos de pago
 */
export function mapBackendPaymentToFrontend(backendPayment: any): PaymentMethod {
  console.log('🔄 Mapeando método de pago del backend');
  
  const mapped = {
    id: backendPayment.id || backendPayment.paymentId || 0,
    NombreDeTarjeta: backendPayment.nombreTarjeta || backendPayment.NombreDeTarjeta,
    NumeroDeTarjeta: backendPayment.numeroTarjeta || backendPayment.NumeroDeTarjeta,
    FechaVencimiento: backendPayment.fechaVencimiento || backendPayment.FechaVencimiento,
    CodigoSeguridad: backendPayment.codigoSeguridad || backendPayment.CodigoSeguridad,
    TipoTarjeta: backendPayment.tipoTarjeta || backendPayment.TipoTarjeta || 'Otro',
    Banco: backendPayment.banco || backendPayment.Banco,
  };
  
  const validated = PaymentMethodSchema.parse(mapped);
  console.log('✅ Método de pago validado exitosamente');
  
  return validated;
}

// ============================================================
// 🔄 MAPPERS BIDIRECCIONALES
// ============================================================

/**
 * 🎯 Convierte UserAddressDelivery a formato para backend
 */
export function mapFrontendAddressToBackend(address: UserAddressDelivery): any {
  console.log('🔄 Convirtiendo dirección de frontend a backend');
  
  return {
    nombre: address.Nombre,
    apellido: address.Apellido,
    calle: address.Calle,
    numero: address.Numero,
    codigoPostal: address.CodigoPostal,
    estado: address.Estado,
    municipio: address.Municipio,
    ciudad: address.Ciudad,
    colonia: address.Colonia,
    telefono: address.NumeroDeTelefono,
    instrucciones: address.InstruccionesExtra,
  };
}

/**
 * 🎯 Convierte PaymentMethod a formato para backend
 */
export function mapFrontendPaymentToBackend(payment: PaymentMethod): any {
  console.log('🔄 Convirtiendo método de pago de frontend a backend');
  
  return {
    nombreTarjeta: payment.NombreDeTarjeta,
    numeroTarjeta: payment.NumeroDeTarjeta,
    fechaVencimiento: payment.FechaVencimiento,
    codigoSeguridad: payment.CodigoSeguridad,
    tipoTarjeta: payment.TipoTarjeta,
    banco: payment.Banco,
  };
}

// ============================================================
// 🛠️ HELPERS Y UTILIDADES
// ============================================================

/**
 * 🎯 Validador genérico para cualquier schema de componente
 */
export function validateComponentData<T>(schema: any, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('❌ Error de validación en componente:', error);
    throw new Error(`Error de validación: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 🎯 Helper para obtener imagen por defecto
 */
export function getDefaultImage(): string {
  return 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
}

// Los helpers se movieron a @/schemas/components para evitar duplicación

// ============================================================
// 📊 MAPPERS PARA ANALYTICS Y REPORTS
// ============================================================

/**
 * 🎯 Convierte datos de productos para analytics
 */
export function mapProductsForAnalytics(products: FrontendProduct[]): any[] {
  return products.map(product => ({
    id: product.ProductID,
    name: product.ProductName,
    category: product.ProductCategory,
    price: product.productPrice,
    stock: product.ProductStock,
    sold: product.ProductSold,
    status: product.ProductStatus,
    revenue: product.productPrice * product.ProductSold,
    sellerId: product.ProductSellerId,
  }));
}