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
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { idUser } from '../../../api/profile';
import { obtenerMisCompras } from '../../../api/miscompras';
import { MisComprasType } from '../../../schemas/schemas';

export default function MisCompras() {
  const [misCompras, setMisCompras] = useState<MisComprasType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // 1) Extraer categorías dinámicamente de los productos en misCompras
  const categories = useMemo(() => {
    const cats = misCompras
      .flatMap(tx =>
        tx.contenidos
          .map(item => item.producto.categoria ?? '')
          .filter(c => c.trim().length > 0)
      );
    return Array.from(new Set(cats));
  }, [misCompras]);

  // 2) Filtrado: búsqueda, categoría y orden
  const comprasFiltradas = useMemo(() => {
    let result = [...misCompras];
    const term = searchTerm.trim().toLowerCase();

    // Búsqueda por fecha o nombre de producto
    if (term) {
      result = result.filter(tx => {
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
    }

    // Filtrado por categoría
    if (selectedCategory) {
      result = result
        .map(tx => ({
          ...tx,
          contenidos: tx.contenidos.filter(
            item => item.producto.categoria === selectedCategory
          ),
        }))
        .filter(tx => tx.contenidos.length > 0);
    }

    // Ordenar por fecha
    result.sort((a, b) => {
      const tA = new Date(a.diaTransaccion).getTime();
      const tB = new Date(b.diaTransaccion).getTime();
      return sortOrder === 'recent' ? tB - tA : tA - tB;
    });

    return result;
  }, [misCompras, searchTerm, selectedCategory, sortOrder]);

  // Cargar datos al montar
  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerMisCompras(idUser);
        setMisCompras(data);
      } catch (err) {
        console.error('No se ha podido cargar mis compras', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Búsqueda + botón de filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por fecha o producto"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilters(v => !v)}
        >
          <Icon name="filter-variant" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Panel de filtros avanzados */}
      {showFilters && (
        <View style={styles.advancedFilters}>
          {/* Orden */}
          <View style={styles.sortContainer}>
            <Text style={styles.filterLabel}>Ordenar:</Text>
            <TouchableOpacity
              onPress={() => setSortOrder('recent')}
              style={[
                styles.sortBtn,
                sortOrder === 'recent' && styles.activeSortBtn,
              ]}
            >
              <Text
                style={sortOrder === 'recent' ? styles.activeSortText : {}}
              >
                Más reciente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortOrder('oldest')}
              style={[
                styles.sortBtn,
                sortOrder === 'oldest' && styles.activeSortBtn,
              ]}
            >
              <Text
                style={sortOrder === 'oldest' ? styles.activeSortText : {}}
              >
                Más antiguo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categorías */}
          <View style={styles.categoryContainer}>
            <Text style={styles.filterLabel}>Categoría:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setSelectedCategory('')}
                style={[
                  styles.categoryBtn,
                  !selectedCategory && styles.activeCategoryBtn,
                ]}
              >
                <Text
                  style={!selectedCategory ? styles.activeCategoryText : {}}
                >
                  Todas
                </Text>
              </TouchableOpacity>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryBtn,
                    selectedCategory === cat && styles.activeCategoryBtn,
                  ]}
                >
                  <Text
                    style={
                      selectedCategory === cat
                        ? styles.activeCategoryText
                        : {}
                    }
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

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
                  <Text style={styles.texto}>
                    Categoría: {item.producto.categoria}
                  </Text>
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
  safe: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
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
  advancedFilters: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  activeSortBtn: {
    borderColor: '#DE1484',
  },
  activeSortText: {
    color: '#DE1484',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  activeCategoryBtn: {
    borderColor: '#DE1484',
  },
  activeCategoryText: {
    color: '#DE1484',
    fontWeight: '600',
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
