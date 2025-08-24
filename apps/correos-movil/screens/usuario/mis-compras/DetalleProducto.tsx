import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  StatusBar, Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
// Si tienes RootStackParamList tipado, úsalo aquí:
// import type { RouteProp } from '@react-navigation/native';
// const route = useRoute<RouteProp<RootStackParamList, 'DetalleProducto'>>();

const PINK = '#E6007E';

export default function DetalleProducto() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const {
    pedidoId,
    fecha,
    totalPedido,
    producto,
    cantidad,
    direccion,
    pago,
  } = route.params || {};

  const fechaStr = fecha
    ? new Date(fecha).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : '—';

  const moneda = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(n || 0);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PINK} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado del pedido */}
        <View style={styles.orderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Pedido realizado</Text>
            <Text style={styles.value}>{fechaStr}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>N.º de pedido</Text>
            <Text style={styles.value}>{pedidoId || '—'}</Text>
          </View>
        </View>

        {/* Producto */}
        <View style={styles.section}>
          <View style={styles.productContainer}>
            <Image
              source={{ uri: producto?.imagen || 'https://via.placeholder.com/160' }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{producto?.nombre || 'Producto'}</Text>
              {!!producto?.categoria && (
                <Text style={styles.sellerText}>Categoría: {producto.categoria}</Text>
              )}
              {!!producto?.descripcion && (
                <Text style={styles.sellerText} numberOfLines={2}>
                  {producto.descripcion}
                </Text>
              )}
              <Text style={styles.priceText}>{moneda(producto?.precio || 0)}</Text>
              <Text style={styles.sellerText}>Cantidad: {cantidad}</Text>
              <Text style={styles.sellerText}>
                Subtotal: {moneda((producto?.precio || 0) * (cantidad || 1))}
              </Text>
            </View>
          </View>

          {['Comprar nuevamente', 'Ver detalles de la factura'].map((text, idx) => (
            <TouchableOpacity key={idx} style={styles.actionButton}>
              <Text style={styles.actionText}>{text}</Text>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Método de pago (opcional si lo mandas) */}
        {(pago?.brand || pago?.last4) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de pago</Text>
            <Text style={styles.labelText}>
              {pago?.brand?.toUpperCase()} que termina en {pago?.last4}
            </Text>
          </View>
        )}

        {/* Dirección (opcional si la mandas) */}
        {!!direccion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enviar a</Text>
            <Text style={styles.labelText}>
              {direccion.nombre ? `${direccion.nombre}\n` : ''}
              {direccion.calle}
              {direccion.numero_exterior ? ` #${direccion.numero_exterior}` : ''}
              {direccion.numero_int ? ` Int. ${direccion.numero_int}` : ''}
              {'\n'}
              {direccion.colonia_fraccionamiento}
              {'\n'}
              {direccion.municipio}, {direccion.estado} {direccion.cp}
              {'\n'}
              México
            </Text>
          </View>
        )}

        {/* Resumen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.labelText}>Productos:</Text>
            <Text style={styles.labelText}>{moneda(producto?.precio || 0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.labelText}>Envío:</Text>
            <Text style={styles.labelText}>{moneda(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.labelText}>Subtotal:</Text>
            <Text style={styles.labelText}>{moneda((producto?.precio || 0) * (cantidad || 1))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total del pedido:</Text>
            <Text style={styles.totalText}>{moneda(totalPedido || 0)}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 100 : 100,
    paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight || 20,
    backgroundColor: PINK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: { width: 24, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center' },

  scrollContainer: { paddingBottom: 40, backgroundColor: '#f5f5f5', paddingHorizontal: 16 },
  orderContainer: {
    padding: 16, backgroundColor: '#fff', borderRadius: 10, borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0', marginHorizontal: 0, marginVertical: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  section: {
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff', marginTop: 12, borderRadius: 10,
  },
  productContainer: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: '#555' },
  value: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  labelText: { fontSize: 15, color: '#444', marginBottom: 6 },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productDetails: { flex: 1, justifyContent: 'space-between' },
  productTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  sellerText: { fontSize: 14, color: '#666' },
  priceText: { fontSize: 16, color: '#111', fontWeight: '600', marginTop: 4 },
  actionButton: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#eee',
  },
  actionText: { fontSize: 15, color: '#333' },
  sectionTitle: { fontWeight: 'bold', fontSize: 17, marginBottom: 10, color: '#111' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
});
