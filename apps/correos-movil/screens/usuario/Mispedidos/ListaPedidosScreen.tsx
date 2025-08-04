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
  Alert,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useMyAuth } from '../../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';


const API_URL = process.env.EXPO_PUBLIC_API_URL;
const PINK = '#E6007E';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
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
  const limpiarFiltros = () => {
    setSearchQuery('');
    setFiltroFecha({ mes: null, anio: null });
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ListaPedidosScreen'>>();
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
    const fechaFormateada = fecha
      .toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
      .toLowerCase();

    const coincideFechaBusqueda = fechaFormateada.includes(searchQuery.toLowerCase());

    const coincideProducto = pedido.productos.some((p) =>
      p.producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const coincideFiltroFecha =
      (filtroFecha.mes === null || fecha.getMonth() === filtroFecha.mes) &&
      (filtroFecha.anio === null || fecha.getFullYear() === filtroFecha.anio);

    return (coincideFechaBusqueda || coincideProducto) && coincideFiltroFecha;
  });

  const abrirFiltroFecha = () => {
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Pedido }) => {
    const previewImage = item.productos?.[0]?.producto?.imagen;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('MisPedidosScreen', { pedido: item })}
      >
        <Image
          source={previewImage ? { uri: previewImage } : require('../../../assets/image.png')}
          style={styles.previewImage}
        />
        <View style={styles.cardDetails}>
          <Text style={styles.title}>
            Pedido del{' '}
            {
              new Date(item.fecha)
                .toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
            }
          </Text>
          <Text style={styles.detailsText}>
            Status:{' '}
            <Text
              style={{
                color: statusColors[item.status] || '#333',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              }}
            >
              {item.status}
            </Text>
          </Text>
          <Text style={styles.detailsText}>
            Productos:{' '}
            {item.productos.map(p => p.producto.nombre).join(', ')}
          </Text>

          <Text style={styles.detailsText}>
            Fecha: {new Date(item.fecha).toLocaleDateString('es-MX')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      <StatusBar barStyle="light-content" backgroundColor={PINK} />
      <SafeAreaView style={{ backgroundColor: PINK }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis pedidos</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por fecha o producto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity style={styles.filtroButton} onPress={abrirFiltroFecha}>
        <Text style={styles.filtroButtonText}>Filtrar por mes/año</Text>
      </TouchableOpacity>
      {(searchQuery !== '' || filtroFecha.mes !== null || filtroFecha.anio !== null) && (
        <TouchableOpacity style={styles.limpiarButton} onPress={limpiarFiltros}>
          <Text style={styles.limpiarButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      )}


      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por mes y año</Text>

            <Text style={styles.modalLabel}>Mes:</Text>
            <Picker
              selectedValue={mesSeleccionado}
              onValueChange={(itemValue: React.SetStateAction<number>) => setMesSeleccionado(itemValue)}
              style={styles.picker}
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
              onValueChange={(itemValue: React.SetStateAction<number>) => setAnioSeleccionado(itemValue)}
              style={styles.picker}
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
  container: {
    backgroundColor: '#f7f7f7',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight || 20,
    height: Platform.OS === 'ios' ? 70 : 60,
    justifyContent: 'space-between',
    backgroundColor: PINK,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  cardDetails: {
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  filtroButton: {
    backgroundColor: '#E6007E',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  filtroButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalLabel: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
    color: '#333',
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },

  picker: {
    width: '100%',
    height: 60,
    color: '#333',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  modalBtn: {
    flex: 1,
    backgroundColor: '#E6007E',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  limpiarButton: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },

  limpiarButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },


});
