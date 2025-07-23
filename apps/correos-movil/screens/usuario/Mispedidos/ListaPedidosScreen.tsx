import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useMyAuth } from '../../../context/AuthContext';


const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
  ListaPedidosScreen: { userId: string }; // Definimos que esta pantalla recibe un userId
};

// Colores para los estados del pedido, para una mejor visualización
const statusColors: { [key: string]: string } = {
  pendiente: '#f0ad4e', // Naranja
  empaquetado: '#5bc0de', // Azul claro
  enviado: '#0275d8', // Azul
  completado: '#5cb85c', // Verde
};

export default function ListaPedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ListaPedidosScreen'>>();
  const { userId } = useMyAuth();
  

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (!userId) {
          throw new Error('No se proporcionó un ID de usuario.');
        }

        if (!API_URL) {
          throw new Error('La URL de la API no está configurada. Revisa tus variables de entorno.');
        }

        const response = await fetch(`${API_URL}/api/api/pedido/user/${userId}`);
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`La respuesta del servidor no fue exitosa. Status: ${response.status}. Cuerpo: ${errorBody}`);
        }
        const data = await response.json();
        console.log('Datos de pedidos recibidos:', JSON.stringify(data, null, 2));
        setPedidos(data);
      } catch (err: any) {
        console.error('Error al cargar pedidos:', err);
        setError(err.message || 'No se pudieron cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [userId]); // El efecto se ejecutará si el userId cambia

  const renderItem = ({ item }: { item: Pedido }) => {
    // Tomamos la imagen del primer producto como vista previa
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
          <Text style={styles.title}>Pedido #{item.id}</Text>
          <Text style={styles.detailsText}>
            Status: <Text style={{ color: statusColors[item.status] || '#333', fontWeight: 'bold', textTransform: 'capitalize' }}>{item.status}</Text>
          </Text>
          <Text style={styles.detailsText}>
            Total: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.total)}
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
      </View>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Aún no tienes pedidos.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginLeft: 16 },
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
    backgroundColor: '#e0e0e0', // Un color de fondo mientras carga la imagen
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
});
