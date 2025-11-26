// src/utils/debugProductData.ts - HELPER TEMPORAL PARA DEBUG

// ✅ Interface para análisis de campos
interface FieldAnalysis {
  types: Set<string>;
  nullCount: number;
  undefinedCount: number;
  examples: unknown[];
}

// ✅ Interface para producto genérico de debug
interface DebugProduct {
  [key: string]: unknown;
  precio?: unknown;
  inventario?: unknown;
  color?: unknown;
}

/**
 * 🔍 Helper temporal para inspeccionar los datos exactos que vienen de tu backend
 * Úsalo temporalmente para ver qué estructura tienen realmente tus productos
 */
export function debugProductData(products: unknown[]): void {
  console.log('🔍 === INSPECCIÓN DETALLADA DE PRODUCTOS DEL BACKEND ===')
  console.log(`Total de productos: ${products.length}`)
  
  if (products.length === 0) {
    console.log('❌ No hay productos para inspeccionar')
    return
  }
  
  // ✅ CORREGIDO LÍNEA 17: Reemplazado any por DebugProduct
  const firstProduct = products[0] as DebugProduct
  console.log('\n📦 ANÁLISIS DEL PRIMER PRODUCTO:')
  console.log('Estructura completa:', JSON.stringify(firstProduct, null, 2))
  
  console.log('\n📊 TIPOS DE DATOS POR CAMPO:')
  Object.entries(firstProduct).forEach(([key, value]) => {
    console.log(`  ${key}: ${typeof value} = ${value}`)
  })
  
  // Buscar patrones en todos los productos
  console.log('\n🔍 ANÁLISIS DE TODOS LOS PRODUCTOS:')
  
  const fieldAnalysis: Record<string, FieldAnalysis> = {}
  
  // ✅ CORREGIDO LÍNEA 33: Reemplazado any por DebugProduct
  // ✅ CORREGIDO LÍNEA 36: Eliminado index no usado
  products.forEach((product) => {
    if (typeof product === 'object' && product !== null) {
      Object.entries(product as DebugProduct).forEach(([key, value]) => {
        if (!fieldAnalysis[key]) {
          fieldAnalysis[key] = {
            types: new Set(),
            nullCount: 0,
            undefinedCount: 0,
            examples: []
          }
        }
        
        const analysis = fieldAnalysis[key]
        analysis.types.add(typeof value)
        
        if (value === null) analysis.nullCount++
        if (value === undefined) analysis.undefinedCount++
        
        if (analysis.examples.length < 3 && value !== null && value !== undefined) {
          analysis.examples.push(value)
        }
      })
    }
  })
  
  // Mostrar análisis por campo
  Object.entries(fieldAnalysis).forEach(([field, analysis]) => {
    console.log(`\n  ${field}:`)
    console.log(`    Tipos encontrados: ${Array.from(analysis.types).join(', ')}`)
    console.log(`    Valores null: ${analysis.nullCount}`)
    console.log(`    Valores undefined: ${analysis.undefinedCount}`)
    console.log(`    Ejemplos: ${analysis.examples.slice(0, 3).map(ex => JSON.stringify(ex)).join(', ')}`)
  })
  
  // Identificar productos problemáticos
  console.log('\n🚨 PRODUCTOS CON POSIBLES PROBLEMAS:')
  
  products.forEach((product, index) => {
    const issues: string[] = []
    if (typeof product === 'object' && product !== null) {
      // ✅ CORREGIDO LÍNEA 38: Reemplazado any por DebugProduct
      const p = product as DebugProduct
      
      // Verificar precio
      if (typeof p.precio === 'string') {
        issues.push(`precio es string: "${p.precio}"`)
      }
      
      // Verificar inventario
      if (p.inventario === undefined) {
        issues.push('inventario es undefined')
      }
      
      // Verificar color
      if (p.color === undefined) {
        issues.push('color es undefined')
      }
      
      if (issues.length > 0) {
        console.log(`  Producto ${index + 1}: ${issues.join(', ')}`)
      }
    }
  })
  
  console.log('\n✅ === FIN DE INSPECCIÓN ===')
}

/**
 * 🛠️ Helper para probar el mapeo de un solo producto
 */
export function testSingleProductMapping(product: unknown): void {
  console.log('🧪 === PRUEBA DE MAPEO DE UN PRODUCTO ===')
  console.log('Producto original:', JSON.stringify(product, null, 2))
  
  try {
    // Aquí puedes importar y probar tu mapper
    // const mapped = mapBackendToFrontend(product)
    // console.log('✅ Mapeo exitoso:', mapped)
    console.log('ℹ️ Para probar mapeo, importa mapBackendToFrontend en este archivo')
  } catch (error) {
    console.error('❌ Error en mapeo:', error)
  }
}

/**
 * 🔧 Helper para limpiar datos inconsistentes (usa solo si es necesario)
 */
// ✅ CORREGIDO LÍNEA 76: Reemplazado any por DebugProduct
export function cleanProductData(product: DebugProduct): DebugProduct {
  const cleaned = { ...product }
  
  // Limpiar precio: convertir string a number
  if (typeof cleaned.precio === 'string') {
    const num = parseFloat(cleaned.precio)
    cleaned.precio = isNaN(num) ? 0 : num
  }
  
  // Agregar inventario si no existe
  if (cleaned.inventario === undefined || cleaned.inventario === null) {
    cleaned.inventario = 0
  }
  
  // Agregar color si no existe
  if (cleaned.color === undefined || cleaned.color === null) {
    cleaned.color = '#000000'
  }
  
  return cleaned
}

// Función para usar en tu servicio temporalmente
// ✅ CORREGIDO LÍNEA 122: Reemplazado any por DebugProduct
export function debugAndCleanProducts(products: unknown[]): DebugProduct[] {
  debugProductData(products)
  
  return products.map((product, index) => {
    try {
      return cleanProductData(product as DebugProduct)
    } catch (error) {
      console.error(`Error limpiando producto ${index}:`, error)
      return product as DebugProduct
    }
  })
}