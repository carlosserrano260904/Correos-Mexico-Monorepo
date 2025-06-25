//MisCompras.tsx
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
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { idUser } from '../../../api/profile';
import { obtenerMisCompras } from '../../../api/miscompras';
import { MisComprasType } from '../../../schemas/schemas';

export default function MisCompras() {
  const navigation = useNavigation();
  const [misCompras, setMisCompras] = useState<MisComprasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<'reciente' | 'antiguo'>('reciente');

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerMisCompras(idUser);
        setMisCompras(data);
      } catch (err) {
        Alert.alert('Error', 'No se ha podido cargar tus compras');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtrar productos y luego ordenar según inserción original
  const comprasVisibles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // Mapear compras y filtrar contenidos por término
    const filtradas = misCompras
      .map(compra => {
        // Si no hay término, mantener todos los contenidos
        if (!term) return compra;
        // Filtrar contenidos que coinciden con búsqueda
        const contenidos = compra.contenidos.filter(item =>
          item.producto.nombre.toLowerCase().includes(term)
        );
        return contenidos.length > 0
          ? { ...compra, contenidos }
          : null;
      })
      .filter(Boolean) as MisComprasType[];

    // Orden: antiguo = original, reciente = invertido
    return order === 'reciente' ? filtradas.slice().reverse() : filtradas;
  }, [misCompras, searchTerm, order]);

  // Calcular total global sumando precio * cantidad de contenidos visibles
  const totalGeneral = useMemo(() => {
    return comprasVisibles.reduce((acc, compra) => {
      const subtotal = compra.contenidos.reduce(
        (sum, item) => sum + Number(item.precio) * Number(item.cantidad),
        0
      );
      return acc + subtotal;
    }, 0);
  }, [comprasVisibles]);

  const mostrarFiltro = () => {
    Alert.alert('Ordenar', '', [
      { text: 'Más antiguo', onPress: () => setOrder('antiguo') },
      { text: 'Más reciente', onPress: () => setOrder('reciente') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#DE1484" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Compras</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos"
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={mostrarFiltro}>
          <Icon name="filter-variant" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>Total: ${totalGeneral}</Text>
        <Text style={styles.summaryText}>
          Orden: {order === 'reciente' ? 'Más reciente' : 'Más antiguo'}
        </Text>
      </View>

      <ScrollView style={styles.container}>
        {comprasVisibles.length > 0 ? (
          comprasVisibles.map((tx, idx) => {
            const subtotal = tx.contenidos.reduce(
              (s, item) => s + Number(item.precio) * Number(item.cantidad),
              0
            );
            return (
              <View key={tx.id} style={styles.compraCard}>
                <Text style={styles.compraTitle}>Compra #{idx + 1}</Text>
                <Text style={styles.compraTotal}>Total: ${subtotal}</Text>
                {tx.contenidos.map(item => (
                  <View key={item.id} style={styles.productCard}>
                    <Image
                      source={{ uri: item.producto.imagen }}
                      style={styles.image}
                    />
                    <View style={styles.details}>
                      <Text style={styles.productName}>
                        {item.producto.nombre}
                      </Text>
                      <Text style={styles.productDesc}>
                        {item.producto.descripcion}
                      </Text>
                      <Text style={styles.productInfo}>
                        Cant: {item.cantidad}
                      </Text>
                      <Text style={styles.productInfo}>
                        Precio: ${item.precio}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })
        ) : (
          <Text style={styles.empty}>No hay compras que coincidan.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DE1484',
    padding: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
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
  searchInput: { flex: 1, marginLeft: 6, fontSize: 14, color: '#333' },
  filterBtn: { marginLeft: 8 },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryText: { fontSize: 14, fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#f3f3f3', padding: 12 },
  compraCard: { marginBottom: 20 },
  compraTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  compraTotal: { fontSize: 14, marginBottom: 12 },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  details: { flex: 1, justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '600' },
  productDesc: { fontSize: 12, color: '#888', marginBottom: 4 },
  productInfo: { fontSize: 12, color: '#555' },
  empty: { textAlign: 'center', color: '#777', marginTop: 32 },
});
