import React, { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MisComprasType, RootStackParamList } from '../../../schemas/schemas';
import { moderateScale } from 'react-native-size-matters';
import AppHeader from '../../../components/common/AppHeader';
import Loader from '../../../components/common/Loader';

// ⬇️ usa los pedidos (asegúrate que PedidoBackend incluya producto.images?: {url:string}[])
import { obtenerPedidosPorUsuario, PedidoBackend } from '../../../api/miscompras';

const PINK = '#E6007E';
const PLACEHOLDER = 'https://via.placeholder.com/120x120.png?text=Producto';

type MisComprasScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'MisCompras'
>;

export default function MisCompras() {
  const [misCompras, setMisCompras] = useState<MisComprasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const navigation = useNavigation<MisComprasScreenNavigationProp>();
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = misCompras
      .flatMap(tx =>
        tx.contenidos
          .map(item => item.producto.categoria ?? '')
          .filter(c => c.trim().length > 0)
      );
    return Array.from(new Set(cats));
  }, [misCompras]);

  const comprasFiltradas = useMemo(() => {
    let result = [...misCompras];
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter(tx => {
        const dateStr = new Date(tx.diaTransaccion)
          .toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
          .toLowerCase();
        const matchDate = dateStr.includes(term);
        const matchProduct = tx.contenidos.some(item =>
          (item.producto.nombre || '').toLowerCase().includes(term)
        );
        return matchDate || matchProduct;
      });

      // reordenar: primero los que coinciden
      result = result.map(tx => {
        const pOk = tx.contenidos.filter(i =>
          (i.producto.nombre || '').toLowerCase().includes(term)
        );
        const pNo = tx.contenidos.filter(
          i => !(i.producto.nombre || '').toLowerCase().includes(term)
        );
        return { ...tx, contenidos: [...pOk, ...pNo] };
      });
    }

    if (selectedCategory) {
      result = result
        .map(tx => ({
          ...tx,
          contenidos: tx.contenidos.filter(i => i.producto.categoria === selectedCategory),
        }))
        .filter(tx => tx.contenidos.length > 0);
    }

    result.sort((a, b) => {
      const tA = new Date(a.diaTransaccion).getTime();
      const tB = new Date(b.diaTransaccion).getTime();
      return sortOrder === 'recent' ? tB - tA : tA - tB;
    });

    return result;
  }, [misCompras, searchTerm, selectedCategory, sortOrder]);

  // ⬇️ Mapeo PedidoBackend -> MisComprasType (agarrando la imagen de producto.images[0].url)
  const mapPedidosToMisCompras = (pedidos: PedidoBackend[]): MisComprasType[] => {
    return pedidos.map(p => ({
      id: String(p.id),
      diaTransaccion: p.fecha,
      contenidos: (p.productos || []).map(pp => {
        const firstImg =
          pp.producto?.images?.[0]?.url ??
          pp.producto?.imagen ??
          PLACEHOLDER;

        return {
          id: String(pp.id),
          cantidad: Number(pp.cantidad),
          producto: {
            id: String(pp.producto?.id ?? ''),
            nombre: pp.producto?.nombre ?? '',
            descripcion: pp.producto?.descripcion ?? '',
            categoria: pp.producto?.categoria ?? '',
            imagen: firstImg,
            precio: Number(pp.producto?.precio ?? 0),
          },
        };
      }),
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem('userId');
        if (storedId) {
          const pedidos = await obtenerPedidosPorUsuario(+storedId);
          const mapped = mapPedidosToMisCompras(pedidos);
          setMisCompras(mapped);
          setError(null);
        }
      } catch (err) {
        console.error('No se ha podido cargar mis pedidos', err);
        setError('No se pudo cargar la información. Intenta más tarde.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader message="Cargando tus compras..." />;

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const formatoMoneda = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n || 0);

  return (
    <>
      <AppHeader title="Mis Compras" onBack={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por fecha o producto"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
            accessible
            accessibilityLabel="Buscar compras por fecha o producto"
          />
        </View>
      </View>

      <View style={styles.advancedFilters}>
        <View style={styles.sortContainer}>
          <Text style={styles.filterLabel}>Ordenar:</Text>
          <TouchableOpacity
            onPress={() => setSortOrder('recent')}
            style={[styles.sortBtn, sortOrder === 'recent' && styles.activeSortBtn]}
            accessibilityRole="button"
            accessible
            accessibilityState={{ selected: sortOrder === 'recent' }}
          >
            <Text style={sortOrder === 'recent' ? styles.activeSortText : {}}>Más reciente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOrder('oldest')}
            style={[styles.sortBtn, sortOrder === 'oldest' && styles.activeSortBtn]}
            accessibilityRole="button"
            accessible
            accessibilityState={{ selected: sortOrder === 'oldest' }}
          >
            <Text style={sortOrder === 'oldest' ? styles.activeSortText : {}}>Más antiguo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.filterLabel}>Categoría:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => setSelectedCategory('')}
              style={[styles.categoryBtn, !selectedCategory && styles.activeCategoryBtn]}
              accessibilityRole="button"
              accessible
              accessibilityState={{ selected: selectedCategory === '' }}
            >
              <Text style={!selectedCategory ? styles.activeCategoryText : {}}>Todas</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.categoryBtn, selectedCategory === cat && styles.activeCategoryBtn]}
                accessibilityRole="button"
                accessible
                accessibilityState={{ selected: selectedCategory === cat }}
              >
                <Text style={selectedCategory === cat ? styles.activeCategoryText : {}}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.container}>
        {comprasFiltradas.map(tx => {
          const totalPedido = tx.contenidos.reduce(
            (sum, item) => sum + Number(item.producto.precio) * item.cantidad,
            0
          );

          return (
            <View key={tx.id} style={styles.compraCard}>
              <Text style={styles.fecha}>
                {new Date(tx.diaTransaccion).toLocaleDateString('es-MX', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>

              <Text style={styles.texto}>Total: {formatoMoneda(totalPedido)}</Text>

              {tx.contenidos.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.productCard}
                  onPress={() =>
                    navigation.navigate('DetalleProducto', {
                      pedidoId: tx.id,
                      fecha: tx.diaTransaccion,
                      totalPedido,
                      producto: {
                        nombre: item.producto.nombre,
                        descripcion: item.producto.descripcion,
                        categoria: item.producto.categoria,
                        imagen: item.producto.imagen || PLACEHOLDER,
                        precio: Number(item.producto.precio),
                      },
                      cantidad: item.cantidad,
                    })
                  }
                  accessibilityRole="button"
                  accessible
                >
                  <Image
                    source={{ uri: item.producto.imagen || PLACEHOLDER }}
                    style={styles.imagen}
                  />
                  <View style={styles.detalles}>
                    <Text style={styles.nombre}>{item.producto.nombre}</Text>
                    <Text style={styles.descripcion}>{item.producto.descripcion}</Text>
                    <Text style={styles.texto}>Cantidad: {item.cantidad}</Text>
                    <Text style={styles.texto}>
                      Precio: {formatoMoneda(Number(item.producto.precio))}
                    </Text>
                    <Text style={styles.texto}>Categoría: {item.producto.categoria}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {comprasFiltradas.length === 0 && (
          <Text style={styles.empty}>No hay compras que coincidan.</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: PINK, fontSize: 16, paddingHorizontal: 20, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', backgroundColor: PINK, alignItems: 'center', padding: moderateScale(26) },
  searchBox: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, alignItems: 'center', height: 36 },
  searchInput: { flex: 1, marginLeft: 6, fontSize: 14, color: '#333' },
  advancedFilters: { backgroundColor: '#fafafa', paddingHorizontal: 12, paddingVertical: 8, borderBottomColor: '#ddd', borderBottomWidth: 1 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginRight: 8 },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
  activeSortBtn: { borderColor: PINK },
  activeSortText: { color: PINK, fontWeight: '600' },
  categoryContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#ccc', marginRight: 8 },
  activeCategoryBtn: { borderColor: PINK },
  activeCategoryText: { color: PINK, fontWeight: '600' },
  container: { flex: 1, padding: 12, backgroundColor: '#f3f3f3' },
  compraCard: { marginBottom: 20 },
  fecha: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
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
  imagen: { width: 80, height: 80, borderRadius: 10 },
  detalles: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  nombre: { fontSize: 16, fontWeight: 'bold' },
  descripcion: { fontSize: 14, color: '#555' },
  texto: { fontSize: 14, marginTop: 4 },
  empty: { marginTop: 40, textAlign: 'center', fontSize: 16, color: '#999' },
});
