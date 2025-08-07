import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useMyAuth } from '../../context/AuthContext';

const IP = process.env.EXPO_PUBLIC_API_URL;

export interface Articulo {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string[];
    precio: number;
    categoria: string;
    color: string;
}

interface ProductRecommendedProps {
    productos: Articulo[];
    likeTrigger?: number;
}

const ProductRecommended: React.FC<ProductRecommendedProps> = ({ productos = [], likeTrigger }) => {
    const [items, setItems] = useState<Articulo[]>(productos);

    useEffect(() => {
        // Si productos es null o undefined, usa array vacío
        setItems(productos ?? []);
        // Si necesitas hacer fetch aquí, hazlo usando likeTrigger como dependencia
        // Ejemplo:
        // fetchRecommended().then(data => setItems(data));
    }, [productos, likeTrigger]);

    return (
        <React.Fragment>
            {items.length === 0 ? (
                <View style={{ alignItems: 'center', padding: 16 }}>
                    <Text>No hay productos recomendados.</Text>
                </View>
            ) : (
                items.map(item => (
                    <View key={item.id} style={{ marginBottom: 12 }}>
                        <Text>{item.nombre}</Text>
                        {/* Renderiza más detalles aquí */}
                    </View>
                ))
            )}
        </React.Fragment>
    );
};

export type ProductListScreenProps = {
  productos: Articulo[];
};

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
  const idNum = parseInt(articulo.id, 10);
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
          source={{ uri: articulo.imagen[0] }}
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
          MXN $ {(parseFloat(articulo.precio) || 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ productos, search = '' }) => {
  const { userId } = useMyAuth();
  const [filtered, setFiltered] = useState<Articulo[]>([]);
  const [favoritos, setFavoritos] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!userId) return;

    fetch(`${IP}/api/favoritos/${userId}`)
      .then(r => {
        if (r.status === 404) {
          return [];
        }
        return r.json();
      })
      .then((data: Array<{ id: number; producto: { id: number } }>) => {
        if (Array.isArray(data)) {
          const favoritosMap = data.reduce(
            (acc, fav) => {
              if (fav && fav.producto && fav.producto.id) {
                acc[fav.producto.id] = fav.id;
              }
              return acc;
            },
            {} as Record<number, number>,
          );
          setFavoritos(favoritosMap);
        }
      })
      .catch(err => console.error('Error al obtener favoritos:', err));
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

  useEffect(() => {
    const searchText = search.toLowerCase().trim();
    const nuevos = productos.filter(p =>
      p.nombre.toLowerCase().includes(searchText)
    );
    setFiltered(nuevos);
  }, [productos, search]);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        horizontal
        renderItem={({ item }) => (
          <ProductoCard
            articulo={item}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            isInCart={cartItems.hasOwnProperty(parseInt(item.id, 10))}
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
    width: 160, // Ancho fijo para las tarjetas
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

export default ProductListScreen;
