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
}> = ({ articulo, favoritos, toggleFavorito, isInCart }) => {
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
        <ColorDisplay colores={colores} />
        <View style={styles.iconosAccion}>
          <TouchableOpacity onPress={() => toggleFavorito(idNum)}>
            <Heart size={24} color={isLiked ? '#ffffffff' : 'gray'} fill={isLiked ? '#de1484' : 'none'} />
          </TouchableOpacity>
          <ShoppingBag
            size={24}
            color={isInCart ? '#ffffffff' : 'gray'}
            fill={isInCart ? '#de1484' : 'none'}
          />
        </View>
      </View>

      <View style={styles.datosProducto}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textoNombre}>
          {articulo.nombre}
        </Text>
        <Text style={styles.textoPrecio}>
          MXN $ {formatPrice(articulo.precio || 0)}
        </Text>
      </View>
    </View>
  );
};

export const ProductCategoryList: React.FC<ProductCategoryListProps> = ({ products, categoria }) => {
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
      if (!response.ok) {
        throw new Error('Failed to fetch favorites from the server.');
      }
      const data = await response.json();
      const favoritosMap = (Array.isArray(data) ? data : []).reduce(
        (acc, fav) => {
          if (fav && fav.producto && fav.producto.id) {
            acc[fav.producto.id] = fav.id;
          }
          return acc;
        },
        {} as Record<number, number>,
      );
      setFavoritos(favoritosMap);
    } catch (err) {
      console.warn('Error al obtener favoritos:', err);
    }
  };

  const toggleFavorito = async (productoId: number) => {
    if (!userId) {
      console.log('Usuario no loggeado, no se puede marcar como favorito.');
      return;
    }

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
        const url = `${IP}/api/favoritos/${favoritoId}`;
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) {
          console.error('Error al eliminar el favorito, revirtiendo estado.');
          setFavoritos(originalFavoritos);
        }
      } catch (error) {
        console.error('Error de red al eliminar favorito, revirtiendo estado:', error);
        setFavoritos(originalFavoritos);
      }
    } else {
      try {
        const url = `${IP}/api/favoritos`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: userId, productId: productoId }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Error al agregar favorito - Status: ${response.status}, Body: ${errorBody}`);
        }

        const nuevoFavorito = await response.json();
        setFavoritos(prev => ({ ...prev, [productoId]: nuevoFavorito.id }));
      } catch (error) {
        console.error('No se pudo agregar el favorito:', error);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(`${IP}/api/carrito/${userId}`)
      .then(r => {
        if (r.status === 404) {
          return [];
        }
        if (!r.ok) throw new Error('Error al obtener el carrito');
        return r.json();
      })
      .then((data: Array<{ producto: { id: number } }>) => {
        if (Array.isArray(data)) {
          const cartMap = data.reduce(
            (acc, item) => {
              if (item && item.producto && item.producto.id) {
                acc[item.producto.id] = true;
              }
              return acc;
            },
            {} as Record<number, boolean>,
          );
          setCartItems(cartMap);
        }
      })
      .catch(err => console.error('Error al obtener el carrito:', err));
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
  container: { flex: 1, backgroundColor: '#fff' },
  tarjetaProducto: {
    width: 160,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  imagenProductoCard: { width: '100%', height: 150, backgroundColor: '#f0f0f0' },
  estadoProducto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  iconosAccion: { flexDirection: 'row', gap: 10 },
  datosProducto: { padding: 8 },
  textoNombre: { fontSize: 14, marginBottom: 4 },
  textoPrecio: { fontSize: 16, fontWeight: 'bold' },
  contenedorColores: { flexDirection: 'row', alignItems: 'center' },
  circuloColor: { width: 14, height: 14, borderRadius: 7, marginRight: 4 },
  contadorRestante: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    minWidth: 24,
  },
  textoContador: { fontSize: 10, fontWeight: '600', color: '#666' },
  listContentContainer: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProductCategoryList;