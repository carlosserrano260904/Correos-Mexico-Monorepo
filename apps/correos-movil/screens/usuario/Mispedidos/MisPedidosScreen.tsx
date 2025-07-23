import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SeguimientoEnvioSimulado from './SeguimientoEnvioSimulado';

// Es una buena práctica definir o importar los tipos de datos que el componente espera.
// Estas interfaces deben coincidir con las de ListaPedidosScreen.tsx para consistencia.
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

// Tipamos los parámetros de la ruta para obtener autocompletado y seguridad de tipos.
type MisPedidosScreenRouteProp = RouteProp<{ params: { pedido: Pedido } }, 'params'>;

export default function MisPedidosScreen() {
  const route = useRoute<MisPedidosScreenRouteProp>();
  const navigation = useNavigation();
  const { pedido } = route.params; // Gracias al tipado, 'pedido' ahora tiene la estructura correcta.

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Pedido #{pedido.id}</Text>
      </View>

      {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
        pedido.productos
          // Filtramos para asegurar que el producto y sus datos esenciales existan
          .filter((productoEnPedido) => productoEnPedido && productoEnPedido.producto)
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

      <View style={styles.seguimiento}>
        <SeguimientoEnvioSimulado status={pedido.status} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 30 },
  title: { fontSize: 22, fontWeight: '700', marginLeft: 16 },
  productContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productInfoContainer: {
    marginLeft: 12, // Espacio entre la imagen y el texto
    flex: 1, // Permite que el contenedor de texto ocupe el espacio restante
  },
  productTitle: { fontWeight: '600', fontSize: 16 },
  productDetails: { color: '#777', fontSize: 14 },
  productPrice: { marginTop: 4, fontWeight: '700', fontSize: 16 },
  details: { marginBottom: 16 },
  detailsTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: '600' },
  seguimiento: { marginTop: 10 },
});
