import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import SeguimientoEnvioSimulado from './SeguimientoEnvioSimulado';

export default function MisPedidosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { pedido } = route.params;

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
          .filter((prod) => prod && prod.producto_id != null && prod.cantidad != null)
          .map((prod, index) => (
            <View key={index} style={styles.productContainer}>
              <Image source={require('../../../assets/image.png')} style={styles.productImage} />
              <View>
                <Text style={styles.productTitle}>Producto #{prod.producto_id}</Text>
                <Text style={styles.productDetails}>Cantidad: {prod.cantidad}</Text>
                <Text style={styles.productPrice}>MXN {pedido.total}</Text>
              </View>
            </View>
          ))
      ) : (
        <Text style={styles.productDetails}>No hay detalles de productos para este pedido.</Text>
      )}


      <View style={styles.details}>
        <Text style={styles.detailsTitle}>Detalles del pedido</Text>
        <Text>Fecha: <Text style={styles.bold}>{new Date(pedido.fecha).toLocaleDateString()}</Text></Text>
        <Text>Total: <Text style={styles.bold}>MXN {pedido.total}</Text></Text>
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
  title: { fontSize: 22, fontWeight: '700', marginLeft: 10 },
  productContainer: { flexDirection: 'row', gap: 10, marginBottom: 16, alignItems: 'center' },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productTitle: { fontWeight: '600', fontSize: 16 },
  productDetails: { color: '#777', fontSize: 14 },
  productPrice: { marginTop: 4, fontWeight: '700', fontSize: 16 },
  details: { marginBottom: 16 },
  detailsTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
  bold: { fontWeight: '600' },
  seguimiento: { marginTop: 10 },
});
