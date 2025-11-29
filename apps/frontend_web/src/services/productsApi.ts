import { 
  BackendProduct, 
  FrontendProduct, 
  BackendCreateProductDto 
} from '@/schemas/products';

const bolsaImg = '/placeholder-bolsos.png';
const accesoriosImg = '/placeholder-accesorios.png';
const zapatosImg = '/placeholder-zapatos.png';
const tenisImg = '/placeholder-tenis.png';
const shortsImg = '/placeholder-shorts.png';
const vestidosImg = '/placeholder-vestidos.png';
const chamarrasImg = '/placeholder-chamarras.png';
const pantalonesImg = '/placeholder-pantalones.png';
const blusasImg = '/placeholder-blusas.png';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const DEFAULT_PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x300/cccccc/969696?text=Imagen+No+Disponible';

class ProductsApiService {
  private baseUrl = `${API_BASE_URL}/api/products`;
  private cache: FrontendProduct[] | null = null;
  private lastFetch: number = 0;
  private CACHE_DURATION = 30000; // cache de 30 segundos

  private validateImageUrl(url: string | null | undefined): string {
    // Si no hay URL, usar placeholder
    if (!url || url.trim() === '' || url === '""') {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }

    const cleanUrl = url.trim();

    // Verificar si es una URL válida
    try {
      new URL(cleanUrl);
      return cleanUrl;
    } catch {
      return DEFAULT_PLACEHOLDER_IMAGE;
    }
  }

  /**
   * Procesa el array de productos
   */
  private processProducts(data: any[]): FrontendProduct[] {
    if (!Array.isArray(data)) {
      console.warn(' No llego array:', typeof data);
      return [];
    }

    const validProducts = data
      .filter((product: any) => {
        const isValid = this.isValidProduct(product);
        if (!isValid) {
          console.warn('Pasando produc inva:', product?.id);
        }
        return isValid;
      })
      .map((product: any) => this.mapBackendToFrontend(product))
      .filter((product: FrontendProduct) => {
        const hasValidImage = product.ProductImageUrl && product.ProductImageUrl !== '';
        if (!hasValidImage) {
          console.warn('Producto trae imagen dañada:', product.ProductID, product.ProductName);
        }
        return hasValidImage;
      });

    return validProducts;
  }

  private mapBackendToFrontend(backendProduct: any): FrontendProduct {
    // Procesar colores
    const colors = backendProduct.color 
      ? backendProduct.color.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [];

    let imageUrl = DEFAULT_PLACEHOLDER_IMAGE;
    
    if (backendProduct.images && Array.isArray(backendProduct.images) && backendProduct.images.length > 0) {
      // Tomar la primera imagen del array - VERIFICAR BIEN LA ESTRUCTURA
      const firstImage = backendProduct.images[0];
      imageUrl = this.validateImageUrl(
        typeof firstImage === 'string' ? firstImage : firstImage?.url
      );
    } else if (backendProduct.imagen) {
      // Fallback a imagen individual
      imageUrl = this.validateImageUrl(backendProduct.imagen);
    }

    // DEBUG: Verificar qué imagen se está asignando
    console.log(`🖼️ Producto ${backendProduct.id}:`, {
      nombre: backendProduct.nombre,
      imagenAPI: backendProduct.imagen,
      imagesArray: backendProduct.images,
      imagenFinal: imageUrl
    });

    return {
      ProductID: backendProduct.id,
      ProductName: backendProduct.nombre,
      ProductDescription: backendProduct.descripcion,
      productPrice: backendProduct.precio,
      ProductImageUrl: imageUrl, // ← Esta es la imagen REAL de la API
      ProductCategory: backendProduct.categoria,
      productStockQuantity: backendProduct.inventario,
      ProductColors: colors,
      ProductBrand: backendProduct.marca || 'Sin marca',
      ProductWeight: backendProduct.peso,
      ProductDimensions: backendProduct.dimensiones,
      isActive: backendProduct.estado !== false,
      createdAt: backendProduct.createdAt ? new Date(backendProduct.createdAt) : new Date(),
      updatedAt: backendProduct.updatedAt ? new Date(backendProduct.updatedAt) : new Date(),
    };
  }

  private isValidProduct(product: any): boolean {
    return (
      product &&
      typeof product === 'object' &&
      product.id &&
      product.nombre &&
      typeof product.precio === 'number'
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
        'Accesorios': accesoriosImg,
      };

      const productsWithFallbackImages = validProducts.map(p => {
        // Si la imagen actual es el placeholder por defecto o está vacía, usar placeholder local
        const hasValidImage = p.ProductImageUrl && 
                             p.ProductImageUrl !== DEFAULT_PLACEHOLDER_IMAGE && 
                             p.ProductImageUrl !== '';
        
        if (!hasValidImage) {
          const localImagePath = p.ProductCategory && categoryMapping[p.ProductCategory];
          if (localImagePath) {
            console.log(`🔄 Usando placeholder local para producto sin imagen: ${p.ProductName}`);
            return {
              ...p,
              ProductImageUrl: localImagePath,
            };
          }
        }
        
        // Mantener la imagen original de la API
        return p;
      });

      // ✅ NO reemplazar todos los productos, solo los que necesitan fallback
      validProducts = productsWithFallbackImages;

      // Guardar en cache
      this.cache = validProducts;
      this.lastFetch = Date.now();

      // DEBUG: Verificar imágenes finales
      console.log('🔍 Imágenes finales de productos:');
      validProducts.forEach((p, i) => {
        console.log(`${i + 1}. ${p.ProductName}: ${p.ProductImageUrl}`);
      });

      return validProducts;

    } catch (error) {
      console.error(' Error fetching products:', error);
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