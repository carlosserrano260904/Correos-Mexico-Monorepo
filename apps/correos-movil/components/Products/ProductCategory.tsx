import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useMyAuth } from '../../context/AuthContext';

const IP = process.env.EXPO_PUBLIC_API_URL;

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Componente PremiumBagIcon corregido
const PremiumBagIcon: React.FC<{ isFilled: boolean }> = ({ isFilled }) => (
  <View style={styles.premiumBagContainer}>
    {/* Capa de fondo - ícono completo */}
    <View style={styles.bagBackground}>
      <ShoppingBag
        size={24} // Aumentado a 24 para que sea más visible
        color={isFilled ? '#de1484' : 'transparent'}
        fill={isFilled ? '#de1484' : 'none'}
      />
    </View>
    
    {/* Capa de contorno - siempre visible pero con color diferente */}
    <View style={styles.bagForeground}>
      <ShoppingBag
        size={24} // Aumentado a 24 para que sea más visible
        color={isFilled ? '#555' : '#555'}
        fill="none"
        strokeWidth={isFilled ? 2.5 : 1.8} // Más grueso cuando está lleno
      />
    </View>
  </View>
);

export interface Articulo {
  id: number;
  nombre: string;
  descripcion: string;
  image: { url: string };
  precio: number;
  categoria: string;
  color: string;
}

interface ProductCategoryListProps {
  products: Articulo[];
  categoria: string;
}

const ColorDisplay: React.FC<{ colores: string[] }> = ({ colores }) => {
  const max = 3;
  return (
    <View style={styles.contenedorColores}>
      {colores.slice(0, max).map((c) => (
        <View
          key={c}
          style={[
            styles.circuloColor,
            { backgroundColor: c, borderWidth: c.toLowerCase() === '#fff' ? 1 : 0 },
          ]}
        />
      ))}
      {colores.length > max && (
        <View style={styles.contadorRestante}>
          <Text style={styles.textoContador}>+{colores.length - max}</Text>
        </View>
      )}
    </View>
  );
};

const ProductoCard: React.FC<{
  articulo: Articulo;
  favoritos: Record<number, number>;
  toggleFavorito: (id: number) => void;
  isInCart: boolean;
  toggleCart: (id: number) => void;
}> = ({ articulo, favoritos, toggleFavorito, isInCart, toggleCart }) => {
  const nav = useNavigation<any>();
  const idNum = articulo.id;
  const isLiked = favoritos.hasOwnProperty(idNum);

  let colorArray: string[] = [];
  if (typeof articulo.color === 'string' && articulo.color.length > 0) {
    colorArray = articulo.color.split(',');
  } else if (Array.isArray(articulo.color)) {
    colorArray = articulo.color;
  }
  const colores = [...new Set(colorArray.map(s => (s || '').trim()).filter(Boolean))];

  return (
    <View style={styles.tarjetaProducto}>
      <TouchableOpacity onPress={() => nav.navigate('ProductView', { id: idNum })}>
        <Image
          source={{ uri: articulo.image?.url || DEFAULT_IMAGE }}
          style={styles.imagenProductoCard}
        />
      </TouchableOpacity>

      <View style={styles.estadoProducto}>
        <TouchableOpacity
          style={styles.botonIcono}
          onPress={() => toggleFavorito(idNum)}
        >
          <Heart
            size={20}
            color={isLiked ? '#de1484' : '#555'}
            fill={isLiked ? '#de1484' : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonIcono}
          onPress={() => toggleCart(idNum)}
        >
          <PremiumBagIcon isFilled={isInCart} />
        </TouchableOpacity>
      </View>

      <View style={styles.datosProducto}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textoNombre}>
          {articulo.nombre}
        </Text>
        
        <Text style={styles.textoPrecio}>
          ${formatPrice(articulo.precio || 0)} MXN
        </Text>
      </View>
    </View>
  );
};

export const ProductCategoryList: React.FC<ProductCategoryListProps> = ({
  products,
  categoria,
}) => {
  const { userId } = useMyAuth();
  const [favoritos, setFavoritos] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({});

  const fetchFavorites = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${IP}/api/favoritos/${userId}`);
      if (response.status === 404) {
        setFavoritos({});
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      const favoritosMap = (Array.isArray(data) ? data : []).reduce(
        (acc, fav) => {
          if (fav && fav.producto && fav.producto.id) {
            acc[fav.producto.id] = fav.id;
          }
          return acc;
        },
        {} as Record<number, number>
      );
      setFavoritos(favoritosMap);
    } catch (err) {
      console.warn('Error al obtener favoritos:', err);
    }
  };

  const fetchCartItems = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`${IP}/api/carrito/${userId}`);
      if (response.status === 404) {
        setCartItems({});
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const data = await response.json();
      const cartMap = (Array.isArray(data) ? data : []).reduce(
        (acc, item) => {
          if (item && item.producto && item.producto.id) {
            acc[item.producto.id] = true;
          }
          return acc;
        },
        {} as Record<number, boolean>
      );
      setCartItems(cartMap);
    } catch (err) {
      console.warn('Error al obtener el carrito:', err);
    }
  };

  const toggleFavorito = async (productoId: number) => {
    if (!userId) return console.log('Usuario no loggeado');

    const esFavorito = favoritos.hasOwnProperty(productoId);
    const originalFavoritos = { ...favoritos };

    if (esFavorito) {
      const favoritoId = favoritos[productoId];
      setFavoritos(prev => {
        const newState = { ...prev };
        delete newState[productoId];
        return newState;
      });
      try {
        const response = await fetch(`${IP}/api/favoritos/${favoritoId}`, {
          method: 'DELETE',
        });
        if (!response.ok) setFavoritos(originalFavoritos);
      } catch {
        setFavoritos(originalFavoritos);
      }
    } else {
      try {
        const response = await fetch(`${IP}/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: userId, productId: productoId }),
        });
        if (!response.ok) throw new Error('Error al agregar favorito');
        const nuevoFavorito = await response.json();
        setFavoritos(prev => ({ ...prev, [productoId]: nuevoFavorito.id }));
      } catch (error) {
        console.error('No se pudo agregar el favorito:', error);
      }
    }
  };

  const toggleCart = async (productoId: number) => {
    if (!userId) {
      console.log('Usuario no loggeado');
      return;
    }

    const isInCart = cartItems.hasOwnProperty(productoId);
    const originalCartItems = { ...cartItems };

    if (isInCart) {
      // Remover del carrito
      setCartItems(prev => {
        const newState = { ...prev };
        delete newState[productoId];
        return newState;
      });
      
      try {
        const response = await fetch(`${IP}/api/carrito/${userId}`);
        if (response.ok) {
          const cartData = await response.json();
          const cartItem = cartData.find((item: any) => item.producto.id === productoId);
          if (cartItem) {
            const deleteResponse = await fetch(`${IP}/api/carrito/${cartItem.id}`, {
              method: 'DELETE',
            });
            if (!deleteResponse.ok) setCartItems(originalCartItems);
          }
        }
      } catch {
        setCartItems(originalCartItems);
      }
    } else {
      // Agregar al carrito
      try {
        const response = await fetch(`${IP}/api/carrito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            profileId: userId, 
            productId: productoId,
            cantidad: 1
          }),
        });
        
        if (!response.ok) throw new Error('Error al agregar al carrito');
        
        setCartItems(prev => ({ ...prev, [productoId]: true }));
      } catch (error) {
        console.error('No se pudo agregar al carrito:', error);
        setCartItems(originalCartItems);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchCartItems();
  }, [userId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={products.filter(p => p.categoria === categoria)}
        keyExtractor={item => item.id.toString()}
        horizontal
        renderItem={({ item }) => (
          <ProductoCard
            articulo={item}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            isInCart={cartItems.hasOwnProperty(item.id)}
            toggleCart={toggleCart}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },

  tarjetaProducto: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 8,
  },

  imagenProductoCard: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  estadoProducto: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },

  botonIcono: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    padding: 8, // Aumentado el padding para que quepa el ícono más grande
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // Tamaño fijo para consistencia
    height: 40, // Tamaño fijo para consistencia
  },

  // Estilos para el PremiumBagIcon
  premiumBagContainer: {
    position: 'relative',
    width: 24, // Ajustado al tamaño del ícono
    height: 24, // Ajustado al tamaño del ícono
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bagForeground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  datosProducto: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  textoNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  textoDescripcion: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },

  textoPrecio: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#de1484',
    marginTop: 4,
  },

  contenedorColores: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  circuloColor: { 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    marginRight: 4 
  },
  
  contadorRestante: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    minWidth: 24,
  },
  
  textoContador: { 
    fontSize: 10, 
    fontWeight: '600', 
    color: '#666' 
  },

  listContentContainer: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProductCategoryList;