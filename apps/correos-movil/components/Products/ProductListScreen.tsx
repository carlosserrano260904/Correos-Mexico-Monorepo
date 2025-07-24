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
import Constants from 'expo-constants';
import { useMyAuth } from '../../context/AuthContext';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

export type Articulo = {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  color: string;
  categoria: string;
};

export type Favorito = {
  id: number;
  profileId: number;
  productId: number;
};

export type ProductListScreenProps = {
  productos: Articulo[];
  search?: string;
};

const ColorDisplay: React.FC<{ colores: string[] }> = ({ colores }) => {
  const max = 3;
  return (
    <View style={styles.contenedorColores}>
      {colores.slice(0, max).map((c, i) => (
        <View
          key={i}
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
  esFavorito: boolean;
  toggleFavorito: (productId: number) => void;
}> = ({ articulo, esFavorito, toggleFavorito }) => {
  const nav = useNavigation<any>();
  const idNum = parseInt(articulo.id, 10);
const colores = (articulo.color ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

  return (
    <View style={styles.tarjetaProducto}>
      <TouchableOpacity onPress={() => nav.navigate('ProductView', { id: idNum })}>
        <Image source={{ uri: articulo.imagen }} style={styles.imagenProductoCard} />
      </TouchableOpacity>

      <View style={styles.estadoProducto}>
        <ColorDisplay colores={colores} />
        <View style={styles.iconosAccion}>
          <TouchableOpacity onPress={() => toggleFavorito(idNum)}>
            <Heart
              size={24}
              color={esFavorito ? '#de1484' : 'gray'}
              fill={esFavorito ? '#de1484' : 'none'}
            />
          </TouchableOpacity>
          <ShoppingBag size={24} color="gray" />
        </View>
      </View>

      <View style={styles.datosProducto}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textoNombre}>
          {articulo.nombre}
        </Text>
        <Text style={styles.textoPrecio}>MXN {articulo.precio}</Text>
      </View>
    </View>
  );
};

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ productos, search = '' }) => {
  const [filtered, setFiltered] = useState<Articulo[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const { userId } = useMyAuth();

  useEffect(() => {
    if (!userId) return;

    fetch(`http://${IP}:3000/api/favoritos/${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Error al obtener favoritos');
        }
        return res.json();
      })
      .then(data => setFavoritos(data))
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    const searchText = search.toLowerCase().trim();
    const nuevos = productos.filter(p =>
      p.nombre.toLowerCase().includes(searchText)
    );
    setFiltered(nuevos);
  }, [productos, search]);

  const toggleFavorito = async (productId: number) => {
    if (!userId) {
      console.error('No hay usuario logueado para gestionar favoritos.');
      return;
    }

    const favoritoExistente = favoritos.find(f => f.productId === productId);

    if (favoritoExistente) {
      // --- ELIMINAR FAVORITO ---
      try {
        const res = await fetch(`http://${IP}:3000/api/favoritos/${favoritoExistente.id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Error al eliminar favorito');

        setFavoritos(prev => prev.filter(f => f.id !== favoritoExistente.id));
      } catch (e) {
        console.error('Error en DELETE:', e);
      }
    } else {
      // --- AÑADIR FAVORITO ---
      try {
        const res = await fetch(`http://${IP}:3000/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: userId, productId: productId }),
        });
        if (!res.ok) throw new Error('Error al añadir favorito');

        const nuevoFavorito = await res.json();
        setFavoritos(prev => [...prev, nuevoFavorito]);
      } catch (e) {
        console.error('Error en POST:', e);
      }
    }
  };

  const cols = Dimensions.get('window').width;
  const numCols = cols > 1024 ? 4 : cols > 768 ? 3 : 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const idNum = parseInt(item.id, 10);
          const esFavorito = favoritos.some(f => f.productId === idNum);
          return (
            <ProductoCard
              articulo={item}
              esFavorito={esFavorito}
              toggleFavorito={toggleFavorito}
            />
          );
        }}
        numColumns={numCols}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
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
    maxWidth: '48%'
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
