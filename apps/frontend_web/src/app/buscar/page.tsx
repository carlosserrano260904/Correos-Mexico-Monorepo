// app/buscar/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plantilla } from "@/components/plantilla";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { IoHeartOutline, IoHeartSharp, IoSearchOutline } from "react-icons/io5";

interface Producto {
  ProductID: number;
  ProductName: string;
  productPrice: number;
  ProductImageUrl: string;
  ProductColors: string[];
  ProductDescription: string;
  ProductCategory: string;
  ProductStock: number;
}

// Componente principal que usa useSearchParams - envuelto en Suspense
function BuscarContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  
  const [todosLosProductos, setTodosLosProductos] = useState<Producto[]>([]);
  const [resultados, setResultados] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    cargarTodosLosProductos();
  }, []);

  // Filtrar productos cuando cambie la query
  useEffect(() => {
    if (query && todosLosProductos.length > 0) {
      filtrarProductos(query);
    } else if (todosLosProductos.length > 0) {
      setResultados([]);
    }
  }, [query, todosLosProductos]);

  const cargarTodosLosProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Usar tu API URL del .env
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Endpoint para obtener todos los productos (ajusta según tu API)
      const response = await fetch(`${apiUrl}/api/products`);
      
      if (!response.ok) {
        throw new Error("Error al cargar productos");
      }

      const data = await response.json();
      
      // Validar y limpiar los datos
      const productosLimpios = data.map((producto: any) => ({
        ProductID: producto.ProductID || producto.id || 0,
        ProductName: producto.ProductName || producto.name || 'Producto sin nombre',
        productPrice: producto.productPrice || producto.price || producto.ProductPrice || 0,
        ProductImageUrl: producto.ProductImageUrl || producto.imageUrl || producto.image || '/placeholder.jpg',
        ProductColors: producto.ProductColors || producto.colors || [],
        ProductDescription: producto.ProductDescription || producto.description || '',
        ProductCategory: producto.ProductCategory || producto.category || 'Sin categoría',
        ProductStock: producto.ProductStock || producto.stock || 0
      }));
      
      setTodosLosProductos(productosLimpios);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError("No se pudieron cargar los productos");
      setTodosLosProductos([]);
    } finally {
      setCargando(false);
    }
  };

  const filtrarProductos = (termino: string) => {
    const terminoLower = termino.toLowerCase().trim();
    
    const productosFiltrados = todosLosProductos.filter(producto => {
      // Validar que las propiedades existan antes de usar toLowerCase()
      const nombre = producto.ProductName?.toLowerCase() || '';
      const descripcion = producto.ProductDescription?.toLowerCase() || '';
      const categoria = producto.ProductCategory?.toLowerCase() || '';
      
      return (
        nombre.includes(terminoLower) ||
        descripcion.includes(terminoLower) ||
        categoria.includes(terminoLower)
      );
    });
    
    setResultados(productosFiltrados);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleAddToCart = (product: Producto) => {
    addToCart(product, 1);
  };

  const handleToggleFavorite = (product: Producto) => {
    if (isFavorite(product.ProductID)) {
      removeFromFavorites(product.ProductID);
    } else {
      addToFavorites(product);
    }
  };

  // Función segura para obtener texto
  const getSafeText = (text: string | undefined | null, fallback: string = '') => {
    return text || fallback;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header de búsqueda */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {query ? `Resultados para: "${query}"` : "Buscar productos"}
          </h1>
          
          {query && !cargando && (
            <p className="text-gray-600">
              {`Encontramos ${resultados.length} producto${resultados.length !== 1 ? 's' : ''} de ${todosLosProductos.length} totales`}
            </p>
          )}
        </div>

        {/* Estado de carga */}
        {cargando && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE1484]"></div>
            <span className="ml-3 text-gray-600">Cargando productos...</span>
          </div>
        )}

        {/* Error */}
        {error && !cargando && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={cargarTodosLosProductos}
              className="mt-3 px-4 py-2 bg-[#DE1484] text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && !error && query && resultados.length === 0 && (
          <div className="text-center py-12">
            <IoSearchOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-4">
              No hay resultados para "<strong>{query}</strong>". Intenta con otras palabras.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-[#DE1484] text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Ver todos los productos
              </Link>
              <button 
                onClick={() => cargarTodosLosProductos()}
                className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Recargar productos
              </button>
            </div>
          </div>
        )}

        {/* Grid de resultados */}
        {!cargando && resultados.length > 0 && (
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                🔍 <strong>Búsqueda activa:</strong> "{query}" - Mostrando {resultados.length} de {todosLosProductos.length} productos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resultados.map((producto) => (
                <div 
                  key={producto.ProductID} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Imagen del producto */}
                  <Link href={`/Producto/${producto.ProductID}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={getSafeText(producto.ProductImageUrl, '/placeholder.jpg')}
                        alt={getSafeText(producto.ProductName, 'Producto')}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback si la imagen no carga
                          (e.target as HTMLImageElement).src = '/placeholder.jpg';
                        }}
                      />
                      
                      {/* Botón favorito */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFavorite(producto);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                      >
                        {isFavorite(producto.ProductID) ? (
                          <IoHeartSharp className="w-5 h-5 text-[#DE1484]" />
                        ) : (
                          <IoHeartOutline className="w-5 h-5 text-gray-600" />
                        )}
                      </button>

                      {/* Badge de stock */}
                      {producto.ProductStock === 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Agotado
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Contenido del producto */}
                  <div className="p-4">
                    <Link href={`/Producto/${producto.ProductID}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#DE1484] transition-colors">
                        {resaltarTexto(getSafeText(producto.ProductName), query)}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {resaltarTexto(getSafeText(producto.ProductDescription), query)}
                    </p>

                    {/* Precio */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(producto.productPrice)}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {getSafeText(producto.ProductCategory, 'Sin categoría')}
                      </span>
                    </div>

                    {/* Colores disponibles */}
                    {producto.ProductColors && producto.ProductColors.length > 0 && (
                      <div className="flex items-center gap-1 mb-4">
                        <span className="text-xs text-gray-500 mr-2">Colores:</span>
                        {producto.ProductColors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color || '#ccc' }}
                            title={`Color: ${color || 'No especificado'}`}
                          />
                        ))}
                        {producto.ProductColors.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{producto.ProductColors.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Botón agregar al carrito */}
                    <button
                      onClick={() => handleAddToCart(producto)}
                      disabled={producto.ProductStock === 0}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        producto.ProductStock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#DE1484] hover:bg-pink-700 text-white'
                      }`}
                    >
                      {producto.ProductStock === 0 ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Sin término de búsqueda */}
        {!query && !cargando && todosLosProductos.length > 0 && (
          <div className="text-center py-12">
            <IoSearchOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Busca productos
            </h3>
            <p className="text-gray-600 mb-6">
              Escribe en la barra de búsqueda para encontrar entre {todosLosProductos.length} productos disponibles
            </p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-[#DE1484] text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Explorar todos los productos
            </Link>
          </div>
        )}

        {/* Productos cargados pero sin búsqueda */}
        {!query && !cargando && todosLosProductos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal que envuelve en Suspense
export default function BuscarPage() {
  return (
    <Plantilla>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE1484]"></div>
          <span className="ml-3 text-gray-600">Cargando búsqueda...</span>
        </div>
      }>
        <BuscarContent />
      </Suspense>
    </Plantilla>
  );
}

// Función para resaltar el texto de búsqueda en los resultados
function resaltarTexto(texto: string, query: string | null) {
  if (!query || !texto) return texto;
  
  const terminoLower = query.toLowerCase();
  const textoLower = texto.toLowerCase();
  
  if (!textoLower.includes(terminoLower)) {
    return texto;
  }
  
  const inicio = textoLower.indexOf(terminoLower);
  const fin = inicio + terminoLower.length;
  
  return (
    <>
      {texto.substring(0, inicio)}
      <mark className="bg-yellow-200 px-1 rounded">
        {texto.substring(inicio, fin)}
      </mark>
      {texto.substring(fin)}
    </>
  );
}