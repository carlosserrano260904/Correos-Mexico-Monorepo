import React, { useEffect, useState, useCallback } from 'react';
import { obtenerDirecciones } from '../../../api/direcciones';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  background: '#F5F5F5',
  border: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

interface Direccion {
  calle: string;
  colonia_fraccionamiento: string;
  numero_exterior: number | null;
  numero_interior: number | null;
  municipio: string;
  estado: string;
  codigo_postal: string;
}

interface PuntoRecogida {
  id: number;
  nombre: string;
  lat: number;
  lng: number;
  direccion?: string;
  horario?: string;
}

const PantallaResumen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [puntoRecogida, setPuntoRecogida] = useState<PuntoRecogida | null>(null);
  const [modoEnvio, setModoEnvio] = useState<'domicilio' | 'puntoRecogida' | null>(null);
  const [tarjeta, setTarjeta] = useState<{ last4: string; brand: string } | null>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no encontrado');

      const response = await axios.get(`${BASE_URL}/api/carrito/${userId}`);
      const data = response.data;

      const formatted = data
        .filter((item: any) => item?.producto && typeof item.cantidad !== 'undefined')
        .map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.producto.nombre ?? 'Sin nombre',
          price: Number(item.precio_unitario ?? item.producto.precio ?? 0),
          quantity: Number(item.cantidad ?? 1),
          image: item.producto.imagen ?? 'https://via.placeholder.com/120x120.png?text=Producto',
          color: item.producto.color ?? 'No especificado',
        }));

      setCart(formatted);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadShippingInfo = async () => {
    try {
      const modo = await AsyncStorage.getItem('modoEnvio');
      setModoEnvio(modo as 'domicilio' | 'puntoRecogida' | null);

      if (modo === 'puntoRecogida') {
        const punto = await AsyncStorage.getItem('puntoRecogidaSeleccionado');
        if (punto) {
          const data: PuntoRecogida = JSON.parse(punto);
          setPuntoRecogida(data);
        }
      } else {
        const seleccionada = await AsyncStorage.getItem('direccionSeleccionada');
        if (seleccionada) {
          setDireccion(JSON.parse(seleccionada));
        } else {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
            const direcciones = await obtenerDirecciones(Number(userId));
            if (direcciones.length > 0) {
              setDireccion(direcciones[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar información de envío:', error);
    }
  };

  const loadUltimaTarjeta = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const perfilRes = await axios.get(`${BASE_URL}/api/profile/${userId}`);
      const profileId = perfilRes.data?.id;
      if (!profileId) return;

      const tarjetasRes = await axios.get(`${BASE_URL}/api/cards/${profileId}`);
      const tarjetas = tarjetasRes.data;

      if (tarjetas && tarjetas.length > 0) {
        const ultima = tarjetas[tarjetas.length - 1];
        setTarjeta({ brand: ultima.brand, last4: ultima.last4 });
      }
    } catch (error) {
      console.error('Error al cargar tarjeta:', error);
    }
  };

  const handleToggleProductDetails = useCallback(
    (idx: number) => {
      setExpandedIdx(expandedIdx === idx ? null : idx);
    },
    [expandedIdx]
  );

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  useEffect(() => {
    if (isFocused) {
      const loadData = async () => {
        await Promise.all([
          loadCart(),
          loadShippingInfo(),
          loadUltimaTarjeta(),
        ]);
      };
      loadData();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {modoEnvio === 'puntoRecogida' ? '📍 Punto de recogida' : '🏠 Envío a domicilio'}
          </Text>
          {modoEnvio === 'puntoRecogida' && puntoRecogida ? (
            <>
              <Text style={styles.addressTitle}>{puntoRecogida.nombre}</Text>
              <Text style={styles.addressText}>{puntoRecogida.direccion}</Text>
              <Text style={styles.addressDetail}>Oficina de Correos de México</Text>
              <Text style={styles.addressDetail}>Horario: {puntoRecogida.horario}</Text>
            </>
          ) : direccion ? (
            <>
              <Text style={styles.addressTitle}>Dirección de entrega</Text>
              <Text style={styles.addressText}>{direccion.calle}, {direccion.colonia_fraccionamiento}</Text>
              <Text style={styles.addressDetail}>N° {direccion.numero_exterior} {direccion.numero_interior ? `Int. ${direccion.numero_interior}` : ''}</Text>
              <Text style={styles.addressDetail}>{direccion.codigo_postal}, {direccion.municipio}, {direccion.estado}</Text>
            </>
          ) : (
            <Text style={styles.addressText}>No se ha seleccionado dirección</Text>
          )}
        </View>

        {tarjeta && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💳 Método de pago</Text>
            <Text>{tarjeta.brand.toUpperCase()} •••• {tarjeta.last4}</Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48, color: '#D1D5DB' }}>🛒</Text>
            <Text style={{ color: '#6B7280', marginTop: 8 }}>Tu carrito está vacío</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {cart.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.productCard} onPress={() => handleToggleProductDetails(idx)}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc}>Color: {item.color}</Text>
                    <Text style={styles.desc}>Cantidad: {item.quantity}</Text>
                    <Text style={styles.price}>MXN {(item.price).toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>

                {expandedIdx === idx && (
                  <View style={styles.expanded}>
                    <Text style={styles.detail}>Subtotal: MXN {(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>MXN {calculateTotal().toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.confirmBtn}>
              <Text style={styles.confirmText}>Confirmar compra</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16 },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  infoTitle: { fontWeight: '600', marginBottom: 8, color: Colors.primary },
  addressTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: Colors.dark },
  addressText: { fontSize: 15, marginBottom: 4, color: Colors.textPrimary },
  addressDetail: { fontSize: 14, color: Colors.textSecondary, marginBottom: 2 },
  list: { paddingVertical: 12 },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    alignItems: 'center',
  },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: Colors.lightGray },
  name: { fontWeight: '600', fontSize: 16, color: Colors.dark },
  desc: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  price: { marginTop: 4, fontWeight: 'bold', color: Colors.primary },
  expanded: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginTop: -10,
    marginBottom: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  detail: { fontSize: 14, color: Colors.textPrimary },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  confirmBtn: {
    backgroundColor: Colors.primary,
    marginTop: 20,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmText: { color: Colors.white, fontWeight: '600', fontSize: 16 },
  loadingContainer: { marginTop: 80, alignItems: 'center' },
  emptyContainer: { marginTop: 60, alignItems: 'center' },
});

export default PantallaResumen;
