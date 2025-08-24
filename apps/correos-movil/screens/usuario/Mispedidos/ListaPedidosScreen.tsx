import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMyAuth } from '../../../context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const PINK = '#fff';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  images?: { url: string }[];
}

interface ProductoEnPedido {
  cantidad: number;
  producto: Producto;
}

interface Pedido {
  id: number;
  status: string;
  total: number;
  fecha: string;
  productos: ProductoEnPedido[];
}

type RootStackParamList = {
  MisPedidosScreen: { pedido: Pedido };
  ListaPedidosScreen: { userId: string };
};

const statusColors: { [key: string]: string } = {
  pendiente: '#f0ad4e',
  empaquetado: '#5bc0de',
  enviado: '#0275d8',
  completado: '#5cb85c',
};

export default function ListaPedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroFecha, setFiltroFecha] = useState<{ mes: number | null; anio: number | null }>({
    mes: null,
    anio: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState<number>(new Date().getFullYear());

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { userId } = useMyAuth();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (!userId) throw new Error('No se proporcionó un ID de usuario.');
        if (!API_URL) throw new Error('La URL de la API no está configurada.');

        const response = await fetch(`${API_URL}/api/api/pedido/user/${userId}`);
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Status: ${response.status}. Cuerpo: ${errorBody}`);
        }

        const data = await response.json();
        setPedidos(data);
      } catch (err: any) {
        setError(err.message || 'No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [userId]);

  const filtrarPedidos = pedidos.filter((pedido) => {
    const fecha = new Date(pedido.fecha);
    const coincideBusqueda =
      pedido.productos.some((p) => p.producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      new Date(pedido.fecha).toLocaleDateString('es-MX').includes(searchQuery);
    const coincideFiltroFecha =
      (filtroFecha.mes === null || fecha.getMonth() === filtroFecha.mes) &&
      (filtroFecha.anio === null || fecha.getFullYear() === filtroFecha.anio);
    return coincideBusqueda && coincideFiltroFecha;
  });

  const limpiarFiltros = () => {
    setSearchQuery('');
    setFiltroFecha({ mes: null, anio: null });
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('MisPedidosScreen', { pedido: item })}
      activeOpacity={0.8}
    >
      <View style={[styles.statusBar, { backgroundColor: statusColors[item.status] || '#ccc' }]} />
      <View style={styles.cardContent}>
        <FlatList
          data={item.productos}
          horizontal
          keyExtractor={(p) => p.producto.id.toString()}
          renderItem={({ item: prod }) => (
            <Image
              source={
                prod.producto.images?.[0]?.url
                  ? { uri: prod.producto.images[0].url }
                  : require('../../../assets/image.png')
              }
              style={styles.productImage}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>Pedido del  {new Date(item.fecha).toLocaleDateString()}</Text>
          <Text style={styles.cardStatus}>{item.status.toUpperCase()}</Text>
          <Text numberOfLines={2} style={styles.products}>
            {item.productos.map((p) => p.producto.nombre).join(', ')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E6007E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PINK} />
      <SafeAreaView style={{ backgroundColor: PINK }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Pedidos</Text>
        </View>
      </SafeAreaView>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por fecha o producto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Botones de filtro */}
      <TouchableOpacity style={styles.filtroButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.filtroButtonText}>Filtrar por mes/año</Text>
      </TouchableOpacity>
      {(searchQuery !== '' || filtroFecha.mes !== null || filtroFecha.anio !== null) && (
        <TouchableOpacity style={styles.limpiarButton} onPress={limpiarFiltros}>
          <Text style={styles.limpiarButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}

      {/* Modal de filtros */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por mes y año</Text>
            <Text style={styles.modalLabel}>Mes:</Text>
            <Picker
              selectedValue={mesSeleccionado}
              onValueChange={(itemValue) => setMesSeleccionado(itemValue)}
            >
              {[
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
              ].map((mes, index) => (
                <Picker.Item key={index} label={mes} value={index} />
              ))}
            </Picker>
            <Text style={styles.modalLabel}>Año:</Text>
            <Picker
              selectedValue={anioSeleccionado}
              onValueChange={(itemValue) => setAnioSeleccionado(itemValue)}
            >
              {[2024, 2025, 2026].map((anio) => (
                <Picker.Item key={anio} label={anio.toString()} value={anio} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setFiltroFecha({ mes: mesSeleccionado, anio: anioSeleccionado });
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalBtnText}>Aplicar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={filtrarPedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron pedidos.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  backButton: { width: 24, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  filtroButton: {
    backgroundColor: '#E6007E',
    paddingVertical: 10,
    borderRadius: 50,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  filtroButtonText: { color: '#fff', fontWeight: '600', textTransform: 'uppercase' },
  limpiarButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  limpiarButtonText: { color: '#333', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16, textAlign: 'center' },
  emptyText: { color: '#666', fontSize: 16, textAlign: 'center' },

  /* Cards */
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  statusBar: { height: 6, width: '100%' },
  cardContent: { padding: 12 },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 8, backgroundColor: '#f0f0f0' },
  cardInfo: { marginTop: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardStatus: { fontWeight: '600', color: '#555', marginBottom: 4 },
  products: { color: '#555', fontSize: 14 },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  modalLabel: { fontSize: 14, marginBottom: 4 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBtn: { flex: 1, backgroundColor: '#E6007E', paddingVertical: 10, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
