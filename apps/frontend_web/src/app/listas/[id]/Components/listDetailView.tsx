'use client';
import React, { useState, useEffect } from 'react';
import { useLists } from '@/hooks/useLists';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface ListDetailViewProps {
  listId: number;
}

export const ListDetailView: React.FC<ListDetailViewProps> = ({ listId }) => {
  const { 
    getList, 
    getListProducts, 
    removeProductFromList, 
    deleteList,
    updateListName 
  } = useLists();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Marcar como montado solo en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Solo obtener datos después del montaje
  const lista = isMounted ? getList(listId) : null;
  const products = isMounted ? getListProducts(listId) : [];

  // Mostrar loading durante hydratación
  if (!isMounted) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button className="flex items-center gap-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (!lista) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Lista no encontrada</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 text-pink-600 hover:underline"
        >
          Volver
        </button>
      </div>
    );
  }

  const handleRemoveProduct = (productId: number, productName: string) => {
    const confirm = window.confirm(`¿Quieres quitar "${productName}" de esta lista?`);
    if (confirm) {
      removeProductFromList(listId, productId);
    }
  };

  const handleEditListName = () => {
    const newName = prompt('Nuevo nombre de la lista:', lista.ListaName);
    if (newName && newName.trim() !== lista.ListaName) {
      updateListName(listId, newName.trim());
    }
  };

  const handleDeleteList = () => {
    const confirm = window.confirm(`¿Estás seguro de que quieres eliminar la lista "${lista.ListaName}"?`);
    if (confirm) {
      deleteList(listId);
      router.push('/favoritos');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{lista.ListaName}</h1>
            <p className="text-sm text-gray-500">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleEditListName}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Editar nombre
          </button>
          <button
            onClick={handleDeleteList}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4 inline mr-1" />
            Eliminar lista
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Esta lista está vacía</p>
          <p className="text-sm mt-2">Agrega productos desde tus favoritos o desde cualquier producto</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={product.ProductImageUrl}
                  alt={product.ProductName}
                  className="w-fit h-fit object-cover object-center"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.ProductName}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.ProductBrand}</p>
                <p className="text-lg font-bold text-gray-900 mb-3">
                  {formatPrice(product.productPrice)}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.ProductStatus 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.ProductStatus ? 'Disponible' : 'No disponible'}
                  </span>
                  <button
                    onClick={() => handleRemoveProduct(product.ProductID, product.ProductName)}
                    className="text-red-600 hover:text-red-800 text-sm p-1 hover:bg-red-50 rounded"
                    title="Quitar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};