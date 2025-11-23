// hooks/useProduct.ts
'use client';

import { useState, useEffect } from 'react';
import { FrontendProduct } from '@/schemas/products';
import { productsApiService } from '@/services/productsApi';

export const useProducts = () => {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los productos
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

  // Cargar productos por categoría
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

  // Buscar productos
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

  // Obtener producto individual
  const getProduct = async (id: number): Promise<FrontendProduct | null> => {
    try {
      return await productsApiService.getProductById(id);
    } catch (err) {
      console.error('Error getting product:', err);
      return null;
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

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

// Hook para productos destacados
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

// En hooks/useProduct.ts - AGREGAR esta función al final
export const useProductById = (productId: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Como tu API usa números, convertimos el string a número
        const productIdNumber = parseInt(productId);
        
        if (isNaN(productIdNumber)) {
          setError('ID de producto inválido');
          setLoading(false);
          return;
        }

        // Usamos tu servicio existente
        const productData = await productsApiService.getProductById(productIdNumber);
        
        if (productData) {
          setProduct(productData);
        } else {
          setError('Producto no encontrado');
        }
        
      } catch (err) {
        setError('Error al cargar el producto');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
};