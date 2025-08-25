import React, { useState, useEffect } from 'react';
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
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

export type Articulo = {
  id: string;
  nombre: string;
  precio: string;
  imagen?: string | string[];
  image?: string;
  images?: string[];
  color?: string[];
  categoria?: string;
};

export type ProductListScreenProps = {
  productos: Articulo[];
  search?: string;
  likeTrigger?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
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
}> = ({ articulo, favoritos = {}, toggleFavorito, isInCart }) => {
  const nav = useNavigation<any>();
  const idNum = parseInt(articulo.id, 10);
  const isLiked = favoritos && favoritos.hasOwnProperty(idNum);

  let colorArray: string[] = [];
  if (typeof articulo.color === 'string' && articulo.color.length > 0) {
    colorArray = articulo.color.split(',');
  } else if (Array.isArray(articulo.color)) {
    colorArray = articulo.color;
  }
  const colores = [...new Set(colorArray.map(s => (s || '').trim()).filter(Boolean))];

  // 🔹 Fallback chain para la imagen
  const imageUri =
    (Array.isArray(articulo.imagen) && articulo.imagen[0]) ||
    articulo.images?.[0] ||
    articulo.image ||
    (typeof articulo.imagen === 'string' ? articulo.imagen : null) ||
    DEFAULT_IMAGE;

  return (
    <View style={styles.tarjetaProducto}>
      <TouchableOpacity onPress={() => nav.navigate('ProductView', { id: idNum })}>
        <Image
          source={{ uri: imageUri.trim() }}
          style={styles.imagenProductoCard}
          resizeMode="cover"
          onError={(e) =>
            console.log('ERROR IMG CARD =>', imageUri, e.nativeEvent.error)
          }
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

export const ProductListScreen: React.FC<ProductListScreenProps> = ({
  productos,
  search = '',
  likeTrigger,
  onRefresh,
  refreshing,
}) => {
  const { userId } = useMyAuth();
  const [filtered, setFiltered] = useState<Articulo[]>([]);
  const [favoritos, setFavoritos] = useState<Record<number, number>>({});
  const [cartItems, setCartItems] = useState<Record<number, boolean>>({});

  // Cargar favoritos
  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${IP}/api/favoritos/${userId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        const favoritosMap = data.reduce(
          (acc, fav) => {
            if (fav?.producto?.id) {
              acc[fav.producto.id] = fav.id;
            }
            return acc;
          },
          {} as Record<number, number>
        );
        setFavoritos(favoritosMap);
      }
    } catch (err) {
      console.error('Error al obtener favoritos:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId, likeTrigger]);

  // Cargar carrito
  useEffect(() => {
    if (!userId) return;
    fetch(`${IP}/api/carrito/${userId}`)
      .then(r => {
        if (r.status === 404) return [];
        if (!r.ok) throw new Error('Error al obtener el carrito');
        return r.json();
      })
      .then((data: Array<{ producto: { id: number } }>) => {
        if (Array.isArray(data)) {
          const cartMap = data.reduce(
            (acc, item) => {
              if (item?.producto?.id) {
                acc[item.producto.id] = true;
              }
              return acc;
            },
            {} as Record<number, boolean>
          );
          setCartItems(cartMap);
        }
      })
      .catch(err => console.error('Error al obtener el carrito:', err));
  }, [userId]);

  // Filtrar productos
  useEffect(() => {
    const searchText = search.toLowerCase().trim();
    const nuevos = productos.filter(p =>
      p.nombre.toLowerCase().includes(searchText)
    );
    setFiltered(nuevos);
  }, [productos, search]);

  // Toggle favoritos
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
        const next = { ...prev };
        delete next[productoId];
        return next;
      });

      try {
        const r = await fetch(`${IP}/api/favoritos/${favoritoId}`, { method: 'DELETE' });
        if (!r.ok) {
          console.error('Error al eliminar el favorito, revirtiendo estado.');
          setFavoritos(originalFavoritos);
        }
      } catch (error) {
        console.error('Error de red al eliminar favorito, revirtiendo estado:', error);
        setFavoritos(originalFavoritos);
      }
    } else {
      try {
        const r = await fetch(`${IP}/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: userId, productId: productoId }),
        });

        if (!r.ok) {
          const body = await r.text();
          throw new Error(`Error al agregar favorito - ${r.status}: ${body}`);
        }

        const nuevo = await r.json();
        setFavoritos(prev => ({ ...prev, [productoId]: nuevo.id }));
      } catch (error) {
        console.error('No se pudo agregar el favorito:', error);
      }
    }
  };

  // Número de columnas responsive
  const cols = Dimensions.get('window').width;
  const numCols = cols > 1024 ? 4 : cols > 768 ? 3 : 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductoCard
            articulo={item}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            isInCart={cartItems.hasOwnProperty(parseInt(item.id, 10))}
          />
        )}
        numColumns={numCols}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  tarjetaProducto: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    maxWidth: '48%',
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
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProductListScreen;
