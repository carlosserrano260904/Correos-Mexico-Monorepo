import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  SafeAreaView, 
  Platform, 
  Modal 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SeguimientoEnvioSimulado from './SeguimientoEnvioSimulado';

const PINK = '#E6007E';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  images?: { url: string }[];
}

interface ProductoEnPedido {
  cantidad: number;
  producto: Producto;
}

interface Direccion {
  nombre: string;
  calle: string;
  colonia_fraccionamiento: string;
  numero_interior: string | null;
  numero_exterior: number;
  numero_celular: string;
  codigo_postal: string;
  estado: string;
  municipio: string;
  mas_info: string;
}

interface Pedido {
  id: number;
  status: string;
  total: number;
  fecha: string;
  productos: ProductoEnPedido[];
  direccion: Direccion;
  paymentMethod?: {
    last4: string | null;
    brand: string | null;
  };
}

type MisPedidosScreenRouteProp = RouteProp<{ params: { pedido: Pedido } }, 'params'>;

export default function MisPedidosScreen() {
  const route = useRoute<MisPedidosScreenRouteProp>();
  const navigation = useNavigation();
  const { pedido } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Pedido del {new Date(pedido.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
          </Text>
        </View>
      </SafeAreaView>


      

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {pedido.productos.map((item) => (
            <View key={item.producto.id} style={styles.productCard}>
              <Image
                source={
                  item.producto.images && item.producto.images.length > 0
                    ? { uri: item.producto.images[0].url }
                    : require('../../../assets/image.png')
                }
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.producto.nombre}</Text>
                <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
                <Text style={styles.productPrice}>
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.producto.precio)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Detalles del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del pedido</Text>
          <Text>Fecha: <Text style={styles.bold}>{new Date(pedido.fecha).toLocaleDateString()}</Text></Text>
          <Text>Total: <Text style={styles.bold}>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pedido.total)}</Text></Text>
          <Text>Status: <Text style={styles.bold}>{pedido.status}</Text></Text>
          
        </View>


                {/* Números de guía por producto */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Número de guia de los productos:</Text>
  {pedido.productos.map((productoEnPedido) => (
    <Text key={productoEnPedido.id}>
      {productoEnPedido.producto.nombre}: <Text style={styles.bold}>{productoEnPedido.n_guia ?? 'N/A'}</Text>
    </Text>
  ))}
</View>


        {/* Dirección */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dirección de envío</Text>
        <Text>Calle: <Text style={styles.bold}>{pedido.calle ?? 'N/A'}</Text></Text>
        <Text>Núm. Interior: <Text style={styles.bold}>{pedido.numero_int ?? 'N/A'}</Text></Text>
        <Text>Núm. Exterior: <Text style={styles.bold}>{pedido.numero_exterior ?? 'N/A'}</Text></Text>
        <Text>CP: <Text style={styles.bold}>{pedido.cp ?? 'N/A'}</Text></Text>
        <Text>Ciudad: <Text style={styles.bold}>{pedido.ciudad ?? 'N/A'}</Text></Text>
        <Text>Nombre: <Text style={styles.bold}>{pedido.nombre ?? 'N/A'}</Text></Text>
      </View>


        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de pago</Text>
          <Text>Tarjeta: <Text style={styles.bold}>{pedido.paymentMethod?.brand ?? 'N/A'}</Text></Text>
          <Text>Últimos 4 dígitos: <Text style={styles.bold}>{pedido.paymentMethod?.last4 ?? 'N/A'}</Text></Text>
        </View>

        {/* Botón seguimiento */}
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.trackButtonText}>Ver seguimiento de envío</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal de seguimiento */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIcon}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <SeguimientoEnvioSimulado status={pedido.status} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    
    justifyContent: 'space-between',
  },
  backButton: { width: 24, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'black', fontWeight: 'bold', fontSize: 20, flex: 1, textAlign: 'left', marginLeft: 12 },

  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16, marginBottom: 8 },

  productCard: { flexDirection: 'row', marginBottom: 12, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 2 },
  productImage: { width: 80, height: 80 },
  productInfo: { flex: 1, padding: 8, justifyContent: 'center' },
  productName: { fontWeight: '600', fontSize: 16 },
  productQuantity: { color: '#555', fontSize: 14, marginTop: 2 },
  productPrice: { marginTop: 4, fontWeight: '700', fontSize: 15 },

  bold: { fontWeight: '600' },

  trackButton: {
    backgroundColor: PINK,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  trackButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeIcon: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
});
