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

export type Articulo = {
  id: string;
  nombre: string;
  precio: string;
  imagen: string;
  color: string;
  categoria: string;
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
  liked: number[];
  toggleLike: (id: number) => void;
}> = ({ articulo, liked, toggleLike }) => {
  const nav = useNavigation<any>();
  const idNum = parseInt(articulo.id, 10);
  const isLiked = liked.includes(idNum);
  const colores = articulo.color.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <View style={styles.tarjetaProducto}>
      <TouchableOpacity onPress={() => nav.navigate('ProductView', { id: idNum })}>
        <Image source={{ uri: articulo.imagen }} style={styles.imagenProductoCard} />
      </TouchableOpacity>

      <View style={styles.estadoProducto}>
        <ColorDisplay colores={colores} />
        <View style={styles.iconosAccion}>
          <TouchableOpacity onPress={() => toggleLike(idNum)}>
            <Heart size={24} color={isLiked ? '#de1484' : 'gray'} fill={isLiked ? '#de1484' : 'none'} />
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
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    fetch('http://192.168.1.69:3000/api/likes/usuario/1')
      .then(r => r.json())
      .then(data => setLiked(data.map((l: any) => l.producto.id)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const searchText = search.toLowerCase().trim();
    const nuevos = productos.filter(p =>
      p.nombre.toLowerCase().includes(searchText)
    );
    setFiltered(nuevos);
  }, [productos, search]);

  const toggleLike = async (id: number) => {
    const url = `http://192.168.1.69:3000/api/likes/1/${id}`;
    try {
      const method = liked.includes(id) ? 'DELETE' : 'POST';
      await fetch(url, { method });
      setLiked(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } catch (e) {
      console.error(e);
    }
  };

  const cols = Dimensions.get('window').width;
  const numCols = cols > 1024 ? 4 : cols > 768 ? 3 : 2;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductoCard articulo={item} liked={liked} toggleLike={toggleLike} />
        )}
        numColumns={numCols}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContentContainer}
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
  },
  imagenProductoCard: { width: '100%', height: 150, backgroundColor: '#f0f0f0' },
  estadoProducto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  iconosAccion: { flexDirection: 'row' },
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
