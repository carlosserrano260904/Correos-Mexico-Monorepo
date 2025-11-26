// hooks/useProduct.ts
import { useState, useEffect } from 'react'; // ⬅️ REMOVER useCallback
import { FrontendProduct } from '@/schemas/products';
import { productsApiService } from '@/services/productsApi';

export const useProducts = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ❌ ELIMINAR useCallback - funciones normales
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApiService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApiService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApiService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar productos');
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: number): Promise<FrontendProduct | null> => {
    try {
      return await productsApiService.getProductById(id);
    } catch (err) {
      console.error('Error getting product:', err);
      return null;
    }
  };

  // ✅ CORREGIDO: Eliminar loadProducts de las dependencias
  useEffect(() => {
    loadProducts();
  }, []); // ⬅️ Array vacío, sin loadProducts

  return {
    products,
    loading,
    error,
    loadProducts,
    loadProductsByCategory,
    searchProducts,
    getProduct,
    refetch: loadProducts,
  };
};

export const useFeaturedProducts = (limit: number = 8) => {
  const [featuredProducts, setFeaturedProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApiService.getFeaturedProducts(limit);
        setFeaturedProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos destacados');
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [limit]);

  return { featuredProducts, loading, error };
};

export const useProductById = (id: string | number) => {
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsApiService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  return { product, loading, error };
};