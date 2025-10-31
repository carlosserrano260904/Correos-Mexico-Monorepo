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
  if (typeof articulo.color === 'string' && (articulo.color as string).length > 0) {
    colorArray = (articulo.color as string).split(',');
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

      {/* ICONOS FLOTANTES - COMO LA OTRA CARD */}
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

        <TouchableOpacity style={styles.botonIcono}>
          <ShoppingBag
            size={20}
            color={isInCart ? '#de1484' : '#555'}
            fill={isInCart ? '#de1484' : 'none'}
          />
        </TouchableOpacity>
      </View>

      {/* COLORES DEBAJO DE LA IMAGEN */}
      {colores.length > 0 && (
        <View style={styles.contenedorColoresInferior}>
          <ColorDisplay colores={colores} />
        </View>
      )}

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
      if (response.status === 404) {
        setFavoritos({});
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor al obtener favoritos: ${response.status} ${errorText}`);
      }
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
      } else {
        console.error('La respuesta de la API de favoritos no es un arreglo:', data);
      }
    } catch (err) {
      console.warn('Error al obtener favoritos:', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [userId, likeTrigger]);

  // Cargar carrito
  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        const r = await fetch(`${IP}/api/carrito/${userId}`);
        if (r.status === 404) {
          setCartItems({});
          return;
        }
        if (!r.ok) {
          const errorText = await r.text();
          throw new Error(`Error al obtener el carrito - ${r.status}: ${errorText}`);
        }
        const data: Array<{ producto: { id: number } }> = await r.json();
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
        } else {
          console.error('La respuesta de la API de carrito no es un arreglo:', data);
        }
      } catch (err) {
        console.error('Error al obtener el carrito:', err);
      }
    };
    fetchCart();
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
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 10,
  },
  
  // NUEVOS ESTILOS MODERNOS COMO LA OTRA CARD
  tarjetaProducto: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginVertical: 8,
    maxWidth: '48%',
  },

  imagenProductoCard: { 
    width: '100%', 
    height: 160, 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  // ICONOS FLOTANTES EN LA ESQUINA SUPERIOR DERECHA
  estadoProducto: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },

  botonIcono: {
    backgroundColor: '#ffffffcc',
    borderRadius: 50,
    padding: 6,
    marginLeft: 5,
  },

  // COLORES DEBAJO DE LA IMAGEN
  contenedorColoresInferior: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },

  datosProducto: { 
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  textoNombre: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#222',
    marginBottom: 4,
  },

  textoPrecio: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#de1484',
  },

  // ESTILOS PARA COLORES (se mantienen igual)
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