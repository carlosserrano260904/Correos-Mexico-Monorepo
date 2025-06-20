import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { idUser } from '../../../api/profile';
import { obtenerMisCompras } from '../../../api/miscompras';
import { MisComprasType } from '../../../schemas/schemas';

export default function MisCompras() {
  const [misCompras, setMisCompras] = useState<MisComprasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerMisCompras(idUser);
        setMisCompras(data);
      } catch (err) {
        console.log('No se ha podido cargar mis compras', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const comprasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return misCompras;
    return misCompras.filter(tx => {
      const dateStr = new Date(tx.diaTransaccion)
        .toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        .toLowerCase();
      const matchDate = dateStr.includes(term);
      const matchProduct = tx.contenidos.some(item =>
        item.producto.nombre.toLowerCase().includes(term)
      );
      return matchDate || matchProduct;
    });
  }, [misCompras, searchTerm]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Solo barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => Alert.alert('Filtro', 'Aún no hay filtros avanzados')}
        >
          <Icon name="filter-variant" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Lista de compras */}
      <ScrollView style={styles.container}>
        {comprasFiltradas.map(tx => (
          <View key={tx.id} style={styles.compraCard}>
            <Text style={styles.fecha}>
              {new Date(tx.diaTransaccion).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.total}>Total: ${tx.total}</Text>

            {tx.contenidos.map(item => (
              <View key={item.id} style={styles.productCard}>
                <Image
                  source={{ uri: item.producto.imagen }}
                  style={styles.imagen}
                />
                <View style={styles.detalles}>
                  <Text style={styles.nombre}>{item.producto.nombre}</Text>
                  <Text style={styles.descripcion}>
                    {item.producto.descripcion}
                  </Text>
                  <Text style={styles.texto}>
                    Cantidad: {item.cantidad}
                  </Text>
                  <Text style={styles.texto}>Precio: ${item.precio}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        {comprasFiltradas.length === 0 && (
          <Text style={styles.empty}>No hay compras que coincidan.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#DE1484',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  filterBtn: {
    marginLeft: 8,
    padding: 4,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f3f3f3',
  },
  compraCard: { marginBottom: 20 },
  fecha: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  total: { fontSize: 14, marginBottom: 12 },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  detalles: { flex: 1, justifyContent: 'center' },
  nombre: { fontSize: 14, fontWeight: '600' },
  descripcion: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  texto: { fontSize: 12, color: '#555' },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 32,
  },
});
