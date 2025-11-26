// hooks/useFavorites.ts
import { useEffect } from 'react' // ⬅️ REMOVER useCallback
import { useFavoritesStore } from '../stores/useFavoritesStore'
import { useAuth } from './useAuth' 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const getImageOrden0 = (producto: any): string => {
  const imgs = producto?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img0 = imgs.find((x: any) => Number(x?.orden) === 0);
    return img0?.url || imgs[0]?.url || '/placeholder.png';
  }
  return producto?.ProductImageUrl || producto?.imagen || '/placeholder.png';
};

export const useFavorites = () => {
  const store = useFavoritesStore()
  const { user, isAuthenticated } = useAuth() 

  // 1. SINCRONIZAR AL CARGAR (Backend -> Store)
  useEffect(() => {
    const fetchServerFavorites = async () => {
      if (!isAuthenticated || !user?.id) return;

      try {
        const response = await fetch(`${API_BASE_URL}/favoritos/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          
          // TRADUCCIÓN DE DATOS: Backend (NestJS) -> Frontend (Zustand)
          const mappedFavorites = Array.isArray(data) ? data.map((item: any) => ({
             ProductID: item.producto.id,
             ProductName: item.producto.nombre,
             ProductBrand: item.producto.marca || 'Marca',
             ProductImageUrl: getImageOrden0(item.producto),
             productPrice: Number(item.producto.precio),
             // Guardamos el ID de la relación favorito por si se necesita para borrar
             favoriteId: item.id 
          })) : [];

          // Actualizamos el store de golpe
          store.setFavorites(mappedFavorites);
        }
      } catch (error) {
        console.error("Error sincronizando favoritos:", error);
      }
    };

    fetchServerFavorites();
  }, [isAuthenticated, user?.id, store]); // ⬅️ AGREGAR store a las dependencias

  // 2. AGREGAR (Wrapper que conecta API + Store)
  const handleAddToFavorites = async (rawProduct: any) => {
    console.log("Producto recibido al dar like:", rawProduct);

    // 1. TRADUCCIÓN (El Mapper)
    const productForStore = {
        ProductID: rawProduct.id || rawProduct.ProductID,
        ProductName: rawProduct.nombre || rawProduct.ProductName || 'Producto sin nombre',
        ProductBrand: rawProduct.marca || rawProduct.ProductBrand || 'Correos',
        ProductImageUrl: getImageOrden0(rawProduct), 
        productPrice: Number(rawProduct.precio || rawProduct.productPrice || 0),
        favoriteId: null
    };

    // 2. Guardar en ZUSTAND (Visualmente inmediato)
    store.addToFavorites(productForStore);

    // 3. Guardar en BACKEND
    if (isAuthenticated && user?.id) {
      try {
        await fetch(`${API_BASE_URL}/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: productForStore.ProductID
          })
        });
      } catch (error) {
        console.error("Error guardando en servidor", error);
      }
    }
  };
  
  return {
    // State
    Favorites: store.favorites,
    
    // Insert
    addToFavorites: handleAddToFavorites, // ⬅️ CAMBIAR a nuestra función personalizada
    
    // Delete
    removeFromFavorites: store.removeFromFavorites,
    clearFavorites: store.clearFavorites,
    
    // Read
    getFavorites: store.getFavorites,
    isFavorite: store.isFavorite,
    getFavorite: store.getFavorite,
    getTotalFavorites: store.getTotalFavorites
  }
}