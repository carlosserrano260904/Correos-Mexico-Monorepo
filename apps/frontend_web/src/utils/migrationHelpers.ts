// utils/migrationHelpers.ts - Helpers para migrar de interfaces a schemas

import { 
  ProductoComponent,
  CuponFrontend,
  OrdenComponent,
  ItemCart,
  UserAddressDelivery,
  PaymentMethod
} from '@/schemas/components';

// ============================================================
// 🔄 MIGRATION HELPERS - Interfaces Antiguas → Schemas Zod
// ============================================================

/**
 * 🎯 Convierte ProductosProps (interface antigua) a ProductoComponent (schema Zod)
 * TEMPORAL - para migración gradual
 */
export function migrateProductosPropsToComponent(oldProduct: any): ProductoComponent {
  console.log('🔄 Migrando ProductosProps antigua a ProductoComponent');
  
  // Mapear campos con nombres diferentes o estructuras distintas
  const migrated = {
    // Campos básicos - mapeo directo
    ProductID: oldProduct.ProductID,
    ProductName: oldProduct.ProductName,
    ProductDescription: oldProduct.ProductDescription,
    ProductImageUrl: oldProduct.ProductImageUrl || 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
    productPrice: oldProduct.productPrice,
    ProductBrand: oldProduct.ProductBrand,
    ProductStatus: oldProduct.ProductStatus,
    ProductStock: oldProduct.ProductStock,
    ProductCategory: oldProduct.ProductCategory,
    ProductSellerName: oldProduct.ProductSellerName,
    ProductSold: oldProduct.ProductSold,
    ProductSlug: oldProduct.ProductSlug,
    Color: oldProduct.Color || '#000000',
    ProductSKU: oldProduct.ProductSKU || `SKU-${Date.now()}`,
    
    // Arrays - con defaults seguros
    ProductImages: oldProduct.ProductImages || [],
    ProductCupons: oldProduct.ProductCupons || [],
    
    // Campos nuevos - undefined si no existen
    ProductHeight: oldProduct.ProductHeight,
    ProductLength: oldProduct.ProductLength,
    ProductWidth: oldProduct.ProductWidth,
    ProductWeight: oldProduct.ProductWeight,
    ProductSellerId: oldProduct.ProductSellerId || oldProduct.idPerfil,
    
    // Campos calculados - se generan automáticamente si hay dimensiones
    ProductVolume: oldProduct.ProductVolume || (
      oldProduct.ProductHeight && oldProduct.ProductLength && oldProduct.ProductWidth
        ? oldProduct.ProductHeight * oldProduct.ProductLength * oldProduct.ProductWidth
        : undefined
    ),
    ProductDimensions: oldProduct.ProductDimensions || (
      oldProduct.ProductHeight && oldProduct.ProductLength && oldProduct.ProductWidth
        ? `${oldProduct.ProductHeight} × ${oldProduct.ProductLength} × ${oldProduct.ProductWidth} cm`
        : undefined
    ),
    ProductWeightDisplay: oldProduct.ProductWeightDisplay || (
      oldProduct.ProductWeight ? `${oldProduct.ProductWeight} kg` : undefined
    ),
    
    // Props del componente
    variant: oldProduct.variant || 'full',
  };
  
  console.log('✅ Migración completada');
  return migrated as ProductoComponent;
}

/**
 * 🎯 Convierte CuponesPropsFront antigua a CuponFrontend
 */
export function migrateCuponPropsToSchema(oldCupon: any): CuponFrontend {
  console.log('🔄 Migrando CuponesPropsFront a CuponFrontend');
  
  return {
    CuponID: oldCupon.CuponID,
    CuponCode: oldCupon.CuponCode,
    TimesUsed: oldCupon.TimesUsed || 0,
    CuponStatus: oldCupon.CuponStatus || 1,
    EndDate: oldCupon.EndDate,
    variant: oldCupon.variant || 'full',
  };
}

/**
 * 🎯 Convierte OrdenesProps antigua a OrdenComponent
 */
export function migrateOrdenPropsToSchema(oldOrden: any): OrdenComponent {
  console.log('🔄 Migrando OrdenesProps a Orden');
  
  return {
    OrderID: oldOrden.OrderID,
    OrderInfo: oldOrden.OrderInfo || [],
    NoProducts: oldOrden.NoProducts || 0,
    OrderStatus: oldOrden.OrderStatus || 2,
    OrderTotal: oldOrden.OrderTotal || 0,
    OrderDate: oldOrden.OrderDate,
    PaymentMethod: oldOrden.PaymentMethod || 'No especificado',
    ClientName: oldOrden.ClientName,
    Email: oldOrden.Email,
    PhoneNumber: oldOrden.PhoneNumber || 0,
    PackageStatus: oldOrden.PackageStatus || 'Orden procesada',
  };
}

// ============================================================
// 🔧 HELPERS PARA VALIDACIÓN DURANTE LA MIGRACIÓN
// ============================================================

/**
 * 🎯 Valida si un objeto puede ser migrado a ProductoComponent
 */
export function canMigrateToProductoComponent(obj: any): boolean {
  const requiredFields = [
    'ProductID',
    'ProductName', 
    'ProductDescription',
    'productPrice',
    'ProductBrand',
    'ProductStatus',
    'ProductStock',
    'ProductCategory',
    'ProductSellerName'
  ];
  
  return requiredFields.every(field => obj.hasOwnProperty(field) && obj[field] !== undefined);
}

/**
 * 🎯 Limpia y normaliza datos antes de la migración
 */
export function cleanDataForMigration(obj: any): any {
  const cleaned = { ...obj };
  
  // Limpiar strings vacíos
  Object.keys(cleaned).forEach(key => {
    if (typeof cleaned[key] === 'string' && cleaned[key].trim() === '') {
      cleaned[key] = undefined;
    }
  });
  
  // Normalizar arrays vacíos
  if (cleaned.ProductImages && !Array.isArray(cleaned.ProductImages)) {
    cleaned.ProductImages = [];
  }
  if (cleaned.ProductCupons && !Array.isArray(cleaned.ProductCupons)) {
    cleaned.ProductCupons = [];
  }
  
  // Normalizar precios
  if (typeof cleaned.productPrice === 'string') {
    cleaned.productPrice = parseFloat(cleaned.productPrice) || 0;
  }
  
  // Normalizar números
  ['ProductStock', 'ProductSold', 'ProductID'].forEach(field => {
    if (typeof cleaned[field] === 'string') {
      cleaned[field] = parseInt(cleaned[field]) || 0;
    }
  });
  
  return cleaned;
}

// ============================================================
// 📊 HELPERS PARA DEBUGGING DURANTE LA MIGRACIÓN
// ============================================================

/**
 * 🎯 Compara objeto antes y después de la migración
 */
export function debugMigration(before: any, after: any, type: string): void {
  console.log(`🔍 === DEBUG MIGRACIÓN ${type.toUpperCase()} ===`);
  
  // Campos que cambiaron
  const changedFields: string[] = [];
  const addedFields: string[] = [];
  
  Object.keys(after).forEach(key => {
    if (!(key in before)) {
      addedFields.push(key);
    } else if (before[key] !== after[key]) {
      changedFields.push(key);
    }
  });
  
  if (changedFields.length > 0) {
    console.log('📝 Campos modificados:', changedFields);
    changedFields.forEach(field => {
      console.log(`   ${field}: ${before[field]} → ${after[field]}`);
    });
  }
  
  if (addedFields.length > 0) {
    console.log('➕ Campos agregados:', addedFields);
  }
  
  console.log('✅ Migración completada exitosamente');
}

/**
 * 🎯 Reporta estadísticas de migración
 */
export function reportMigrationStats(migrations: { type: string; count: number }[]): void {
  console.log('📊 === ESTADÍSTICAS DE MIGRACIÓN ===');
  
  const total = migrations.reduce((sum, m) => sum + m.count, 0);
  
  migrations.forEach(({ type, count }) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
    console.log(`   ${type}: ${count} (${percentage}%)`);
  });
  
  console.log(`📈 Total migrado: ${total} elementos`);
}

// ============================================================
// 🎯 HELPER PRINCIPAL PARA MIGRACIÓN MASIVA
// ============================================================

/**
 * 🎯 Migra un array de objetos usando el mapper apropiado
 */
export function migrateArrayToSchemas<T>(
  items: any[],
  type: 'producto' | 'cupon' | 'orden'
): T[] {
  console.log(`🔄 Iniciando migración masiva de ${items.length} ${type}s`);
  
  const migrated: T[] = [];
  const errors: string[] = [];
  
  items.forEach((item, index) => {
    try {
      let result: any;
      
      switch (type) {
        case 'producto':
          if (canMigrateToProductoComponent(item)) {
            const cleaned = cleanDataForMigration(item);
            result = migrateProductosPropsToComponent(cleaned);
          } else {
            throw new Error(`Item ${index} no tiene los campos requeridos`);
          }
          break;
          
        case 'cupon':
          result = migrateCuponPropsToSchema(item);
          break;
          
        case 'orden':
          result = migrateOrdenPropsToSchema(item);
          break;
          
        default:
          throw new Error(`Tipo de migración no soportado: ${type}`);
      }
      
      migrated.push(result);
      
    } catch (error) {
      const errorMsg = `Error migrando ${type} ${index}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  });
  
  // Reportar resultados
  console.log(`✅ Migración completada: ${migrated.length}/${items.length} exitosos`);
  
  if (errors.length > 0) {
    console.warn(`⚠️ ${errors.length} errores durante la migración:`);
    errors.forEach(err => console.warn(`   ${err}`));
  }
  
  return migrated;
}