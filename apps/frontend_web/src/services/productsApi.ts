// services/productsApi.ts
import { 
  FrontendProduct, 
  BackendCreateProductDto 
} from '@/schemas/products';

const bolsaImg = '/placeholder-bolsos.png';
const accesoriosImg = '/placeholder-accesorios.png';
const tenisImg = '/placeholder-tenis.png';
const vestidosImg = '/placeholder-vestidos.png';
const chamarrasImg = '/placeholder-chamarras.png';
const pantalonesImg = '/placeholder-pantalones.png';
// ❌ COMENTADO: Variables no usadas
// const zapatosImg = '/placeholder-zapatos.png';
// const shortsImg = '/placeholder-shorts.png';
// const blusasImg = '/placeholder-blusas.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const DEFAULT_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/cccccc/969696?text=Imagen+No+Disponible';

// ✅ Interface para producto del backend
interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string | null;
  images?: Array<{ url: string }>;
  categoria?: string | null;
  inventario: number;
  color?: string | null;
  marca?: string | null;
  peso?: number | null;
  dimensiones?: string | null;
  estado?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class ProductsApiService {
  private baseUrl = `${API_BASE_URL}/api/products`;
  private cache: FrontendProduct[] | null = null;
  private lastFetch: number = 0;
  private CACHE_DURATION = 30000; //cache

  private validateImageUrl(url: string | null | undefined): string {
    // Si no hay URL, usar placeholder
    if (!url || url.trim() === '' || url === '""') {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }

    const cleanUrl = url.trim();

    return cleanUrl;
  }

  /**
   * Procesa el array de productos
   */
  // ✅ CORREGIDO LÍNEA 40: Reemplazado any por unknown
  private processProducts(data: unknown[]): FrontendProduct[] {
    if (!Array.isArray(data)) {
      console.warn(' No llego array:', typeof data);
      return [];
    }

    const validProducts = data
      // ✅ CORREGIDO LÍNEA 47: Reemplazado any por unknown
      .filter((product: unknown) => {
        const isValid = this.isValidProduct(product);
        if (!isValid) {
          console.warn('Pasando produc inva:', (product as BackendProduct)?.id);
        }
        return isValid;
      })
      // ✅ CORREGIDO LÍNEA 54: Reemplazado any por unknown
      .map((product: unknown) => this.mapBackendToFrontend(product))
      .filter((product: FrontendProduct) => {
        const hasValidImage = product.ProductImageUrl && product.ProductImageUrl !== '';
        if (!hasValidImage) {
          console.warn('Producto trae imagen dañada:', product.ProductID, product.ProductName);
        }
        return hasValidImage;
      });

    return validProducts;
  }

  // ✅ CORREGIDO LÍNEA 66: Reemplazado any por unknown
  private mapBackendToFrontend(backendProduct: unknown): FrontendProduct {
    // Convertir a tipo BackendProduct
    const product = backendProduct as BackendProduct;
    
    // Procesar colores
    const colors = product.color 
      ? product.color.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [];

    let imageUrl = DEFAULT_PLACEHOLDER_IMAGE;
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      // Tomar la primera imagen del array
      imageUrl = this.validateImageUrl(product.images[0]?.url);
    } else if (product.imagen) {
      // Fallback a imagen individual
      imageUrl = this.validateImageUrl(product.imagen);
    }

    return {
      ProductID: product.id,
      ProductName: product.nombre,
      ProductDescription: product.descripcion,
      productPrice: product.precio,
      ProductImageUrl: imageUrl,
      ProductCategory: product.categoria || null,
      productStockQuantity: product.inventario,
      ProductColors: colors,
      ProductBrand: product.marca || 'Sin marca',
      ProductWeight: product.peso || null,
      ProductDimensions: product.dimensiones || null,
      isActive: product.estado !== false,
      createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    };
  }

  // ✅ CORREGIDO LÍNEA 100: Reemplazado any por unknown
  private isValidProduct(product: unknown): boolean {
    if (!product || typeof product !== 'object') {
      return false;
    }

    const p = product as BackendProduct;
    
    return (
      p.id !== undefined &&
      p.nombre !== undefined &&
      typeof p.precio === 'number'
    );
  }

  /**
   * Obtener todos los productos CON CACHE
   */
  async getAllProducts(): Promise<FrontendProduct[]> {
    if (this.cache && Date.now() - this.lastFetch < this.CACHE_DURATION) {
      console.log(' Using cached products');
      return this.cache;
    }

    try {
      console.log(' Fetching fresh products from:', this.baseUrl);
      
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'force-cache',
      });

      if (!response.ok) {
        console.error(` HTTP Error: ${response.status} ${response.statusText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📦 Received ${Array.isArray(data) ? data.length : 'non-array'} products`);
      
      let validProducts = this.processProducts(data);
      console.log(`Mapped ${validProducts.length} valid products`);

      const categoryMapping: Record<string, string> = {
        'Productos destacados': bolsaImg, 
        'Ropa, moda y calzado': vestidosImg, 
        'FONART': chamarrasImg,
        'Calzado': tenisImg,
        'Ropa': pantalonesImg,
        'Accesorios': accesoriosImg, // Agregado si esta categoría existe
        // Asegúrate de que los nombres de categoría sean EXACTOS
      };

      const productsWithLocalImages = validProducts.map(p => {
    const localImagePath = p.ProductCategory && categoryMapping[p.ProductCategory];
    
    if (localImagePath) {
        return {
            ...p,
          ProductImageUrl: localImagePath,
        };
      }
      return p; 
    });

      // Reemplazamos la lista de la API con la lista modificada
      validProducts = productsWithLocalImages;

      // Guardar en cache
      this.cache = validProducts;
      this.lastFetch = Date.now();

      return validProducts;

    } catch (error) {
      console.error(' Error fetching products:', error);
      // Devolver cache aunque sea viejo si hay error
      return this.cache || [];
    }
  }

  /**
   * Limpiar cache (útil para testing)
   */
  clearCache(): void {
    this.cache = null;
    this.lastFetch = 0;
    console.log('🗑️ Cache cleared');
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(id: number): Promise<FrontendProduct | null> {
    try {
      console.log(`🔄 Fetching product ${id} from: ${this.baseUrl}/${id}`);
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`⚠️ Product ${id} not found`);
          return null;
        }
        throw new Error(`Error ${response.status}: Producto no encontrado`);
      }

      const data = await response.json();
      
      if (!this.isValidProduct(data)) {
        console.warn('⚠️ Invalid product data received:', data);
        return null;
      }

      const mappedProduct = this.mapBackendToFrontend(data);
      console.log(`✅ Successfully mapped product: ${mappedProduct.ProductName}`);
      return mappedProduct;

    } catch (error) {
      console.error(`❌ Error fetching product ${id}:`, error);
      return null;
    }
  }

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(category: string): Promise<FrontendProduct[]> {
    try {
      console.log(`🔄 Fetching products for category: ${category}`);
      
      // Primero intentar con cache
      const allProducts = await this.getAllProducts();
      
      // Filtrar por categoría
      const categoryProducts = allProducts.filter(product => 
        product.ProductCategory?.toLowerCase().includes(category.toLowerCase())
      );

      console.log(`✅ Found ${categoryProducts.length} products for category: ${category}`);
      return categoryProducts;

    } catch (error) {
      console.error(`❌ Error fetching products for category ${category}:`, error);
      return [];
    }
  }

  /**
   * Buscar productos
   */
  async searchProducts(query: string): Promise<FrontendProduct[]> {
    try {
      if (!query.trim()) {
        return [];
      }

      console.log(`🔍 Searching products for: "${query}"`);
      
      // Usar cache para búsqueda
      const allProducts = await this.getAllProducts();
      
      const searchResults = allProducts.filter(product =>
        product.ProductName.toLowerCase().includes(query.toLowerCase()) ||
        product.ProductDescription.toLowerCase().includes(query.toLowerCase()) ||
        product.ProductCategory?.toLowerCase().includes(query.toLowerCase())
      );

      console.log(`✅ Found ${searchResults.length} products for search: "${query}"`);
      return searchResults;

    } catch (error) {
      console.error(`❌ Error searching products for "${query}":`, error);
      return [];
    }
  }

  /**
   * Obtener productos destacados
   */
  async getFeaturedProducts(limit: number = 8): Promise<FrontendProduct[]> {
    try {
      console.log(`⭐ Fetching ${limit} featured products`);
      
      // Usar cache
      const allProducts = await this.getAllProducts();
      
      // Ordenar por algún criterio (ej: más vendidos, mejor rating, etc.)
      // Por ahora, tomar los primeros 'limit' productos
      const featuredProducts = allProducts.slice(0, limit);

      console.log(`✅ Found ${featuredProducts.length} featured products`);
      return featuredProducts;

    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Obtener productos recientes
   */
  async getRecentProducts(limit: number = 6): Promise<FrontendProduct[]> {
    try {
      const allProducts = await this.getAllProducts();
      
      // Ordenar por fecha de creación (más recientes primero)
      const recentProducts = allProducts
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, limit);

      console.log(`🆕 Found ${recentProducts.length} recent products`);
      return recentProducts;

    } catch (error) {
      console.error('❌ Error fetching recent products:', error);
      return [];
    }
  }

  /**
   * Crear nuevo producto (para vendedores)
   */
  async createProduct(productData: BackendCreateProductDto): Promise<FrontendProduct | null> {
    try {
      console.log('🆕 Creating new product:', productData);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Create product error: ${response.status}`, errorText);
        throw new Error(`Error ${response.status}: No se pudo crear el producto`);
      }

      const data = await response.json();
      
      if (!this.isValidProduct(data)) {
        console.warn('⚠️ Invalid product data after creation:', data);
        return null;
      }

      // Limpiar cache después de crear producto
      this.clearCache();

      const mappedProduct = this.mapBackendToFrontend(data);
      console.log(`✅ Product created successfully: ${mappedProduct.ProductName}`);
      return mappedProduct;

    } catch (error) {
      console.error('❌ Error creating product:', error);
      throw new Error('No se pudo crear el producto');
    }
  }

  /**
   * Health check del servicio
   */
  async healthCheck(): Promise<{ status: boolean; message: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'HEAD',
        cache: 'no-store',
      });
      
      return {
        status: response.ok,
        message: response.ok ? 'API conectada correctamente' : `Error: ${response.status}`
      };
    } catch (error) {
      return {
        status: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Obtener estadísticas del servicio
   */
  async getServiceStats(): Promise<{ totalProducts: number; categories: string[] }> {
    try {
      const products = await this.getAllProducts();
      const categories = [...new Set(products.map(p => p.ProductCategory).filter(Boolean))] as string[];
      
      return {
        totalProducts: products.length,
        categories
      };
    } catch (error) {
      console.error('❌ Error getting service stats:', error);
      return { totalProducts: 0, categories: [] };
    }
  }

  /**
   * Obtener estado del cache
   */
  getCacheStats(): { hasCache: boolean; cacheAge: number; cacheSize: number } {
    const now = Date.now();
    return {
      hasCache: this.cache !== null,
      cacheAge: this.lastFetch ? now - this.lastFetch : 0,
      cacheSize: this.cache ? this.cache.length : 0
    };
  }
}

// Exportar instancia única
export const productsApiService = new ProductsApiService();

// Exportar funciones auxiliares para uso directo
export const productService = {
  // Obtener todos los productos
  getAll: () => productsApiService.getAllProducts(),
  
  // Obtener producto por ID
  getById: (id: number) => productsApiService.getProductById(id),
  
  // Obtener por categoría
  getByCategory: (category: string) => productsApiService.getProductsByCategory(category),
  
  // Buscar productos
  search: (query: string) => productsApiService.searchProducts(query),
  
  // Productos destacados
  getFeatured: (limit?: number) => productsApiService.getFeaturedProducts(limit),
  
  // Productos recientes
  getRecent: (limit?: number) => productsApiService.getRecentProducts(limit),
  
  // Health check
  healthCheck: () => productsApiService.healthCheck(),
  
  // Estadísticas
  getStats: () => productsApiService.getServiceStats(),
  
  // Cache
  clearCache: () => productsApiService.clearCache(),
  getCacheStats: () => productsApiService.getCacheStats(),
};