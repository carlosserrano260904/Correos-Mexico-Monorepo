import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { obtenerDirecciones } from '../../../api/direcciones';

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

// ===== DEMO: Forzar éxito de pago =====
const FORCE_PAYMENT_SUCCESS = true;

interface CartItem {
  id: string;           // id del item en el carrito (backend carrito)
  productId: number;    // id del producto real (para DTO)
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

interface Direccion {
  id?: number;
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

interface Card {
  stripeCardId: string;
  brand: string;
  last4: string;
}

type CreatePedidoDto = {
  profileId: number;
  status: string;
  estatus_pago?: string;
  total?: number;
  direccionId?: number;
  calle?: string | null;
  numero_int?: string | null;
  numero_exterior?: string | null;
  cp?: string | null;
  ciudad?: string | null;
  nombre?: string | null;
  last4?: string | null;
  brand?: string | null;
  productos: { producto_id: number; cantidad: number }[];
};

const PantallaResumen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [puntoRecogida, setPuntoRecogida] = useState<PuntoRecogida | null>(null);
  const [modoEnvio, setModoEnvio] = useState<'domicilio' | 'puntoRecogida' | null>(null);
  const [tarjeta, setTarjeta] = useState<Card | null>(null);

  const [isPaying, setIsPaying] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Helpers
  const apiBase = () =>
    Constants.expoConfig?.extra?.IP_LOCAL
      ? `http://${Constants.expoConfig.extra.IP_LOCAL}:3000/api`
      : BASE_URL;

  // Animación de spinner
  useEffect(() => {
    if (!isPaying) return;
    const loop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
      spinValue.setValue(0);
    };
  }, [isPaying, spinValue]);

  const rotation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no encontrado');

      const response = await axios.get(`${BASE_URL}/api/carrito/${userId}`);
      const data = response.data;

      const formatted: CartItem[] = data
        .filter((item: any) => item?.producto && typeof item.cantidad !== 'undefined')
        .map((item: any) => ({
          id: item.id?.toString() || '',
          productId: Number(item.producto?.id ?? 0), // ⬅️ importante para DTO
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
        return;
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const direcciones = await obtenerDirecciones(Number(userId));

      const seleccionadaId = await AsyncStorage.getItem('direccionSeleccionadaId');
      if (seleccionadaId) {
        const idNum = Number(seleccionadaId);
        const match = direcciones.find((d: any) => d.id === idNum);
        if (match) {
          setDireccion(match);
          return;
        }
      }

      if (direcciones && direcciones.length > 0) {
        setDireccion(direcciones[0]);
      }
    } catch (error) {
      console.error('Error al cargar información de envío:', error);
    }
  };

  const loadTarjetaSeleccionada = async () => {
    try {
      const seleccionada = await AsyncStorage.getItem('tarjetaSeleccionada');
      if (seleccionada) {
        setTarjeta(JSON.parse(seleccionada));
      }
    } catch (error) {
      console.error('Error al cargar tarjeta seleccionada:', error);
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

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  // Construye el payload CreatePedidoDto con lo disponible en pantalla/AsyncStorage
  const buildPedidoPayload = async (): Promise<CreatePedidoDto> => {
    const profileIdStr = await AsyncStorage.getItem('userId');
    const profileId = Number(profileIdStr);

    return {
      profileId,
      status: 'CREADO',               // o 'PAGADO' si prefieres crear después de cobrar
      estatus_pago: 'pendiente',
      total: calculateTotal(),        // el backend recalcula, pero lo enviamos

      // Envío (solo si es domicilio; para punto de recogida puedes omitir direccionId)
      direccionId: modoEnvio === 'domicilio' ? direccion?.id : undefined,

      // Copia de dirección (no sensible)
      calle: direccion?.calle ?? null,
      numero_int: direccion?.numero_interior != null ? String(direccion.numero_interior) : null,
      numero_exterior: direccion?.numero_exterior != null ? String(direccion.numero_exterior) : null,
      cp: direccion?.codigo_postal ?? null,
      ciudad: direccion?.municipio ?? null,

      // Datos visibles de tarjeta
      nombre: null,                   // si no lo capturas, déjalo null
      last4: tarjeta?.last4 ?? null,
      brand: tarjeta?.brand ?? null,

      // Productos
      productos: cart.map(i => ({
        producto_id: i.productId,
        cantidad: i.quantity,
      })),
    };
  };

  const confirmarCompra = async () => {
    try {
      const profileId = await AsyncStorage.getItem('userId');
      if (!profileId || !tarjeta?.stripeCardId) {
        Alert.alert('Error', 'No se encontró tarjeta o usuario.');
        return;
      }

      setIsPaying(true);

      const url = apiBase();

      // 1) Crear pedido
      const pedidoPayload = await buildPedidoPayload();
      console.log('[POST /pedidos] =>', pedidoPayload);
      const { data: pedidoResp } = await axios.post(`${url}/api/api/pedido`, pedidoPayload);

      const pedidoId: number | undefined =
        pedidoResp?.id ?? pedidoResp?.pedido?.id ?? pedidoResp?.data?.id;

      // 2) Cobrar
      const total = calculateTotal();
      let ok = false;

      try {
        const res = await axios.post(`${url}/pagos/confirmar`, {
          profileId,
          total,
          stripeCardId: tarjeta.stripeCardId,
          pedidoId, // si tu endpoint lo admite, se enlaza el pago al pedido
        });
        ok = res?.data?.status?.toLowerCase?.() === 'success';
      } catch (err) {
        console.log('Fallo en request real de pago.');
      }

      if (FORCE_PAYMENT_SUCCESS) ok = true;

      await sleep(900);
      setIsPaying(false);

      if (ok) {
        // (Opcional) Marca pagado en el pedido si tienes endpoint PATCH:
        // if (pedidoId) await axios.patch(`${url}/pedidos/${pedidoId}`, { status: 'PAGADO', estatus_pago: 'pagado' });

        // Navega a éxito y limpia el stack
        // @ts-ignore
        navigation.reset({ index: 0, routes: [{ name: 'PagoExitosoScreen' }] });
      } else {
        Alert.alert('Error', 'El pago no se pudo completar.');
      }
    } catch (error: any) {
      console.error('Error en confirmación de compra:', error?.response?.data || error.message);
      setIsPaying(false);
      Alert.alert('Error', 'Ocurrió un error al procesar la compra.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      const loadData = async () => {
        await Promise.all([loadCart(), loadShippingInfo(), loadTarjetaSeleccionada()]);
      };
      loadData();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
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
              <Text style={styles.addressDetail}>
                N° {direccion.numero_exterior} {direccion.numero_interior ? `Int. ${direccion.numero_interior}` : ''}
              </Text>
              <Text style={styles.addressDetail}>
                {direccion.codigo_postal}, {direccion.municipio}, {direccion.estado}
              </Text>
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
                    <Text style={styles.price}>MXN {item.price.toFixed(2)}</Text>
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

            <TouchableOpacity
              style={[styles.confirmBtn, isPaying && { opacity: 0.7 }]}
              onPress={confirmarCompra}
              disabled={isPaying}
              activeOpacity={0.8}
            >
              {isPaying ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.confirmText}>Confirmar compra</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de procesamiento */}
      <Modal visible={isPaying} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: rotation }] }]} />
            <Text style={styles.modalText}>Procesando pago…</Text>
          </View>
        </View>
      </Modal>
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

  // Modal & spinner
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    elevation: 6,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#e8e8e8',
    borderTopColor: Colors.primary,
    marginBottom: 12,
  },
  modalText: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default PantallaResumen;
