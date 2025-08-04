import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, SafeAreaView, Platform, Modal } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SeguimientoEnvioSimulado from './SeguimientoEnvioSimulado';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
}

// Tipamos los parámetros de la ruta para obtener autocompletado y seguridad de tipos.
type MisPedidosScreenRouteProp = RouteProp<{ params: { pedido: Pedido } }, 'params'>;

export default function MisPedidosScreen() {
  const route = useRoute<MisPedidosScreenRouteProp>();
  const navigation = useNavigation();
  const { pedido } = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);

  return (

    <View style={styles.containerHeader}>

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
          <Text style={styles.headerTitle}>Pedido del {new Date(pedido.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>


      <ScrollView style={styles.container}>


        {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
          pedido.productos
            // Filtramos para asegurar que el producto y sus datos esenciales existan
            .filter((productoEnPedido: { producto: any; }) => productoEnPedido && productoEnPedido.producto)
            .map((productoEnPedido) => (
              // Usamos el ID del producto como key, es más estable que el índice
              <View key={productoEnPedido.producto.id} style={styles.productContainer}>
                <Image
                  // Usamos la imagen de la BD. Si no existe, usamos una local como fallback.
                  source={
                    productoEnPedido.producto.imagen
                      ? { uri: productoEnPedido.producto.imagen }
                      : require('../../../assets/image.png')
                  }
                  style={styles.productImage}
                />
                <View style={styles.productInfoContainer}>
                  {/* Mostramos el nombre del producto en lugar del ID */}
                  <Text style={styles.productTitle}>{productoEnPedido.producto.nombre}</Text>
                  <Text style={styles.productDetails}>Cantidad: {productoEnPedido.cantidad}</Text>
                  {/* Mostramos el precio de cada producto, formateado como moneda */}
                  <Text style={styles.productPrice}>
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(productoEnPedido.producto.precio)}
                  </Text>
                </View>
              </View>
            ))
        ) : (
          <Text style={styles.productDetails}>No hay detalles de productos para este pedido.</Text>
        )}

        <View style={styles.details}>
          <Text style={styles.detailsTitle}>Detalles del pedido</Text>
          <Text>Fecha: <Text style={styles.bold}>{new Date(pedido.fecha).toLocaleDateString()}</Text></Text>
          <Text>Total: <Text style={styles.bold}>{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pedido.total)}</Text></Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.detailsTitle}>Dirección de envío</Text>
          <Text>Nombre: <Text style={styles.bold}>{pedido.direccion.nombre}</Text></Text>
          <Text>Calle: <Text style={styles.bold}>{pedido.direccion.calle}</Text></Text>
          <Text>Colonia/Fracc.: <Text style={styles.bold}>{pedido.direccion.colonia_fraccionamiento}</Text></Text>
          <Text>Núm. Exterior: <Text style={styles.bold}>{pedido.direccion.numero_exterior}</Text></Text>
          <Text>Núm. Interior: <Text style={styles.bold}>{pedido.direccion.numero_interior ?? 'N/A'}</Text></Text>
          <Text>CP: <Text style={styles.bold}>{pedido.direccion.codigo_postal}</Text></Text>
          <Text>Municipio: <Text style={styles.bold}>{pedido.direccion.municipio}</Text></Text>
          <Text>Estado: <Text style={styles.bold}>{pedido.direccion.estado}</Text></Text>
          <Text>Teléfono: <Text style={styles.bold}>{pedido.direccion.numero_celular}</Text></Text>
          <Text>Más info: <Text style={styles.bold}>{pedido.direccion.mas_info ?? 'N/A'}</Text></Text>
        </View>


        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.trackButton}
        >
          <Text style={styles.trackButtonText}>Ver seguimiento de envío</Text>
        </TouchableOpacity>

      </ScrollView>


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

            {/* Aquí renderizamos el componente de seguimiento */}
            <SeguimientoEnvioSimulado status={pedido.status} />
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  containerHeader: {
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
  title: { fontSize: 22, fontWeight: '700', marginLeft: 16 },
  productContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  productTitle: { fontWeight: '600', fontSize: 16 },
  productDetails: { color: '#777', fontSize: 14 },
  productPrice: { marginTop: 4, fontWeight: '700', fontSize: 16 },


  details: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },


  detailsTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: '600' },
  seguimiento: { marginTop: 10 },
  backButton: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  trackButton: {
    backgroundColor: PINK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
