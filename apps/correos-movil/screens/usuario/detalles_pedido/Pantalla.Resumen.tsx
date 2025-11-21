// apps/correos-movil/screens/usuario/carrito/Pantalla.Resumen.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { obtenerDirecciones } from '../../../api/direcciones';
import { ChevronLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/** Normaliza base de API para que SIEMPRE termine en /api (sin duplicar) */
const apiBase = () =>
  Constants?.expoConfig?.extra?.IP_LOCAL
    ? `http://${Constants.expoConfig.extra.IP_LOCAL}:3000/api`
    : `${BASE_URL}/api`;

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
  id: string;           // ID del registro en tabla carrito (no el producto)
  productId: number;    // ID real del producto
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
  id?: number | string;
  nombre: string;
  lat: number;
  lng: number;
  direccion?: string;     // línea completa si viene así
  calle?: string;
  colonia?: string;
  municipio?: string;
  estado?: string;
  cp?: string | number;
  telefono?: string;
  horario?: string;       // texto final
  horarios_raw?: any;     // objeto/array en crudo (si llega)
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

const CACHE_KEY = 'cart_cache_v1';
// Cambia a true si quieres forzar éxito mientras pruebas UI
const FORCE_PAYMENT_SUCCESS = false;

/** Convierte un objeto/array de horarios en un string legible */
function buildHorarioString(src: any): string | undefined {
  if (!src) return undefined;

  // Caso: objeto por días
  if (typeof src === 'object' && !Array.isArray(src)) {
    const map = (k: string) => src[k] ?? src[k.toLowerCase()] ?? src[k.toUpperCase()];
    const di = (d: string, label: string) => {
      const v = map(d);
      return v ? `${label}: ${typeof v === 'string' ? v : JSON.stringify(v)}` : null;
    };
    const partes = [
      di('lunes', 'Lun'),
      di('martes', 'Mar'),
      di('miércoles', 'Mié') ?? di('miercoles', 'Mié'),
      di('jueves', 'Jue'),
      di('viernes', 'Vie'),
      di('sábado', 'Sáb') ?? di('sabado', 'Sáb'),
      di('domingo', 'Dom'),
    ].filter(Boolean) as string[];
    if (partes.length) return partes.join(' · ');
  }

  // Caso: arreglo tipo [{day:'Lun', open:'9:00', close:'18:00'}, ...]
  if (Array.isArray(src)) {
    const parts = src
      .map((h: any) => {
        const day = h.day ?? h.dia ?? h.nombre ?? '';
        const open = h.open ?? h.apertura ?? h.inicio ?? '';
        const close = h.close ?? h.cierre ?? h.fin ?? '';
        if (!day || !open || !close) return null;
        return `${day}: ${open}–${close}`;
      })
      .filter(Boolean);
    if (parts.length) return parts.join(' · ');
  }

  // Caso: string plano
  if (typeof src === 'string' && src.trim()) return src.trim();

  return undefined;
}

/** Normaliza un objeto genérico de oficina a nuestro shape */
function normalizePuntoRecogida(src: any): PuntoRecogida {
  if (!src || typeof src !== 'object') {
    return { nombre: 'Oficina de Correos de México', lat: 0, lng: 0, direccion: '', horario: '' };
  }

  const lat = Number(
    src.lat ?? src.latitud ?? src.latitude ?? src.coordenadas?.latitude ?? 0
  );
  const lng = Number(
    src.lng ?? src.longitud ?? src.longitude ?? src.coordenadas?.longitude ?? 0
  );

  const nombre =
    src.nombre ??
    src.nombre_cuo ??
    src.nombre_oficina ??
    src.officeName ??
    'Oficina de Correos de México';

  const calle = src.calle ?? src.street ?? src.vialidad ?? src.vialidad_principal;
  const colonia =
    src.colonia ?? src.asentamiento ?? src.neighborhood ?? src.colonia_fraccionamiento;
  const municipio = src.municipio ?? src.localidad ?? src.city ?? src.municipio_delegacion;
  const estado = src.estado ?? src.state ?? src.entidad_federativa;
  const cp = src.cp ?? src.codigo_postal ?? src.postalCode;
  const direccion =
    src.direccion ?? src.domicilio ?? src.address ??
    [calle, colonia, municipio, estado, cp].filter(Boolean).join(', ');

  const telefono = src.telefono ?? src.phone ?? src.tel;

  const horarioPlano =
    src.horario ??
    src.horario_atencion ??
    src.horario_atn ??
    src.horarios ??
    src.schedule ??
    src.openingHours;
  const horario =
    (typeof horarioPlano === 'string' && horarioPlano.trim()
      ? horarioPlano.trim()
      : buildHorarioString(horarioPlano)) ?? '';

  return {
    id: src.id ?? src.id_oficina ?? src.officeId,
    nombre,
    lat,
    lng,
    direccion,
    calle,
    colonia,
    municipio,
    estado,
    cp,
    telefono,
    horario,
    horarios_raw: typeof horarioPlano === 'object' ? horarioPlano : undefined,
  };
}

// ---------- helper: imagen priorizando orden 0 (con fallbacks) ----------
const getImageOrden0 = (producto: any): string => {
  const imgs = producto?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img0 = imgs.find((x: any) => Number(x?.orden) === 0) || imgs[0];
    const url = (img0?.url ?? producto?.imagen ?? '').toString().trim();
    return url || 'https://via.placeholder.com/120x120.png?text=Producto';
  }
  if (producto?.imagen) return String(producto.imagen).trim();
  return 'https://via.placeholder.com/120x120.png?text=Producto';
};

const PantallaResumen = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const [direccion, setDireccion] = useState<Direccion | null>(null);
  const [puntoRecogida, setPuntoRecogida] = useState<PuntoRecogida | null>(null);
  const [modoEnvio, setModoEnvio] = useState<'domicilio' | 'puntoRecogida' | null>(null);
  const [tarjeta, setTarjeta] = useState<Card | null>(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // spinner animado
  const spinValue = useRef(new Animated.Value(0)).current;
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
  const rotation = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const handleBack = useCallback(() => {
    navigation.navigate('Carrito');
  }, [navigation]);

  // === LOADERS ===
  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('Usuario no encontrado');

      const API = apiBase();
      let data: any[] = [];
      try {
        const response = await axios.get(`${API}/carrito/${userId}`);
        data = Array.isArray(response.data) ? response.data : [];
      } catch (e: any) {
        if (!(axios.isAxiosError(e) && e.response?.status === 404)) throw e;
      }

      const formatted: CartItem[] = data
        .filter((item: any) => item?.producto && typeof item.cantidad !== 'undefined')
        .map((item: any) => ({
          id: item.id?.toString() || '',
          productId: Number(item.producto?.id ?? 0),
          name: item.producto?.nombre ?? 'Sin nombre',
          price: Number(item.precio_unitario ?? item.producto?.precio ?? 0),
          quantity: Number(item.cantidad ?? 1),
          image: getImageOrden0(item.producto),
          color: item.producto?.color ?? 'No especificado',
        }));

      setCart(formatted);
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      setCart([]); // UI de vacío
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
        setPuntoRecogida(punto ? normalizePuntoRecogida(JSON.parse(punto)) : null);
        return;
      }

      // domicilio
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
      if (direcciones && direcciones.length > 0) setDireccion(direcciones[0]);
    } catch (error) {
      console.log('Error al cargar info de envío:', error);
    }
  };

  const loadTarjetaSeleccionada = async () => {
    try {
      const seleccionada = await AsyncStorage.getItem('tarjetaSeleccionada');
      if (seleccionada) setTarjeta(JSON.parse(seleccionada));
    } catch (error) {
      console.log('Error al cargar tarjeta seleccionada:', error);
    }
  };

  const getSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Construye el payload CreatePedidoDto con lo disponible en pantalla/AsyncStorage
  const buildPedidoPayload = async (): Promise<CreatePedidoDto> => {
    const profileIdStr = await AsyncStorage.getItem('userId');
    const profileId = Number(profileIdStr);
    return {
      profileId,
      status: 'CREADO',
      estatus_pago: 'pendiente',
      total: getSubtotal(),
      direccionId: modoEnvio === 'domicilio' ? direccion?.id : undefined,
      calle: direccion?.calle ?? null,
      numero_int: direccion?.numero_interior != null ? String(direccion.numero_interior) : null,
      numero_exterior: direccion?.numero_exterior != null ? String(direccion.numero_exterior) : null,
      cp: direccion?.codigo_postal ?? null,
      ciudad: direccion?.municipio ?? null,
      nombre: null,
      last4: tarjeta?.last4 ?? null,
      brand: tarjeta?.brand ?? null,
      productos: cart.map(i => ({ producto_id: i.productId, cantidad: i.quantity })),
    };
  };

  /** Borra todo el carrito en backend (DELETE a cada ítem) y limpia el caché local */
  const vaciarCarrito = useCallback(async (userId: string) => {
    try {
      const API = apiBase();

      // 1) Intentar obtener ítems (si da 404, ya está vacío)
      let items: any[] = [];
      try {
        const r = await axios.get(`${API}/carrito/${userId}`);
        items = Array.isArray(r.data) ? r.data : [];
      } catch (e: any) {
        if (!(axios.isAxiosError(e) && e.response?.status === 404)) throw e;
      }

      // 2) Eliminar cada registro del carrito por ID
      await Promise.allSettled(items.map((it: any) => axios.delete(`${API}/carrito/${it.id}`)));

      // 3) Limpiar caché local para que se vea vacío al volver
      await AsyncStorage.removeItem(CACHE_KEY);

      // 4) Limpiar el estado local
      setCart([]);
    } catch (e) {
      console.warn('No se pudo vaciar el carrito completamente. Se intentará re-sincronizar luego.', e);
    }
  }, []);

  const confirmarCompra = async () => {
    try {
      const profileId = await AsyncStorage.getItem('userId');
      if (!profileId || !tarjeta?.stripeCardId) {
        Alert.alert('Error', 'No se encontró tarjeta o usuario.');
        return;
      }

      setIsPaying(true);
      const API = apiBase();

      // 1) Crear pedido
      const pedidoPayload = await buildPedidoPayload();
      const { data: pedidoResp } = await axios.post(`${API}/pedido`, pedidoPayload);
      const pedidoId: number | undefined =
        pedidoResp?.id ?? pedidoResp?.pedido?.id ?? pedidoResp?.data?.id;

      // 2) Cobrar (con subtotal actual)
      const total = getSubtotal();
      let ok = false;
      try {
        const res = await axios.post(`${API}/pagos/confirmar`, {
          profileId,
          total,
          stripeCardId: tarjeta.stripeCardId,
          pedidoId,
        });
        ok = res?.data?.status?.toString?.().toLowerCase() === 'success';
      } catch (err) {
        console.log('Fallo petición real de pago:', err?.response?.data || err);
      }
      if (FORCE_PAYMENT_SUCCESS) ok = true;

      if (ok) {
        // Vaciar carrito y limpiar estados
        await vaciarCarrito(profileId);

        // Ir a éxito
        // @ts-ignore
        navigation.reset({ index: 0, routes: [{ name: 'PagoExitosoScreen' }] });
      } else {
        Alert.alert('Error', 'El pago no se pudo completar.');
      }
    } catch (error: any) {
      console.error('Error en confirmación de compra:', error?.response?.data || error?.message);
      Alert.alert('Error', 'Ocurrió un error al procesar la compra.');
    } finally {
      setIsPaying(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      const loadData = async () => {
        await Promise.all([
          loadCart(),
          loadShippingInfo(),
          loadTarjetaSeleccionada(),
        ]);
      };
      loadData();
    }
  }, [isFocused]);

  const puedeConfirmar = cart.length > 0 && tarjeta && (modoEnvio === 'puntoRecogida' || (modoEnvio === 'domicilio' && direccion));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Revisa tu pedido</Text>

        {/* Envío */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            {modoEnvio === 'puntoRecogida' ? ' Punto de recogida' : 'Envío a domicilio'}
          </Text>

          {modoEnvio === 'puntoRecogida' && puntoRecogida ? (
            <>
              <Text style={styles.addressTitle}>{puntoRecogida.nombre}</Text>

              {!!puntoRecogida.direccion && (
                <Text style={styles.addressText}>{puntoRecogida.direccion}</Text>
              )}

              {!!puntoRecogida.telefono && (
                <Text style={styles.addressDetail}>Tel: {puntoRecogida.telefono}</Text>
              )}

              <Text style={styles.addressDetail}>Oficina de Correos de México</Text>
              <Text style={styles.addressDetail}>
                Horario:{' '}
                {puntoRecogida.horario && puntoRecogida.horario.trim() !== ''
                  ? puntoRecogida.horario
                  : 'No disponible'}
              </Text>
            </>
          ) : modoEnvio === 'puntoRecogida' ? (
            <Text style={styles.addressText}>No se ha seleccionado punto de recogida</Text>
          ) : direccion ? (
            <>
              <Text style={styles.addressTitle}>Dirección de entrega</Text>
              <Text style={styles.addressText}>
                {direccion.calle}, {direccion.colonia_fraccionamiento}
              </Text>
              <Text style={styles.addressDetail}>
                N° {direccion.numero_exterior}{' '}
                {direccion.numero_interior ? `Int. ${direccion.numero_interior}` : ''}
              </Text>
              <Text style={styles.addressDetail}>
                {direccion.codigo_postal}, {direccion.municipio}, {direccion.estado}
              </Text>
            </>
          ) : (
            <Text style={styles.addressText}>No se ha seleccionado dirección</Text>
          )}
        </View>

        {/* Tarjeta */}
        {tarjeta && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}> Método de pago</Text>
            <Text style={styles.cardText}>
              {tarjeta.brand.toUpperCase()} •••• {tarjeta.last4}
            </Text>
          </View>
        )}

        {/* Lista / Totales */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          </View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.productsTitle}>Productos en tu carrito</Text>
            {cart.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.productCard}
                  onPress={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    onError={(e) =>
                      console.log('Resumen image error:', item.image, e.nativeEvent)
                    }
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc}>Color: {item.color}</Text>
                    <Text style={styles.desc}>Cantidad: {item.quantity}</Text>
                    <Text style={styles.price}>MXN {item.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>

                {expandedIdx === idx && (
                  <View style={styles.expanded}>
                    <Text style={styles.detail}>
                      Subtotal: MXN {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>MXN {getSubtotal().toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón de confirmación en footer */}
      <View style={styles.footer}>
        {puedeConfirmar ? (
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
        ) : (
          <View style={styles.placeholderButton}>
            <Text style={styles.placeholderButtonText}>
              {cart.length === 0 
                ? 'Tu carrito está vacío' 
                : !tarjeta 
                ? 'Selecciona un método de pago' 
                : !modoEnvio 
                ? 'Selecciona un método de envío' 
                : 'Completa tu información para continuar'
              }
            </Text>
          </View>
        )}
      </View>

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
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  placeholder: {
    width: 40,
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.dark,
  },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoTitle: { 
    fontWeight: '600', 
    marginBottom: 8, 
    color: Colors.primary,
    fontSize: 16,
  },
  addressTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4, 
    color: Colors.dark 
  },
  addressText: { 
    fontSize: 15, 
    marginBottom: 4, 
    color: Colors.textPrimary 
  },
  addressDetail: { 
    fontSize: 14, 
    color: Colors.textSecondary, 
    marginBottom: 2 
  },
  cardText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  list: { 
    paddingVertical: 12 
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 8, 
    backgroundColor: Colors.lightGray 
  },
  productInfo: { 
    flex: 1, 
    marginLeft: 12 
  },
  name: { 
    fontWeight: '600', 
    fontSize: 16, 
    color: Colors.dark 
  },
  desc: { 
    fontSize: 13, 
    color: Colors.gray, 
    marginTop: 2 
  },
  price: { 
    marginTop: 4, 
    fontWeight: 'bold', 
    color: Colors.primary 
  },
  expanded: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginTop: -10,
    marginBottom: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E0E0E0',
  },
  detail: { 
    fontSize: 14, 
    color: Colors.textPrimary 
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: Colors.textPrimary 
  },
  totalAmount: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.primary 
  },
  loadingContainer: { 
    marginTop: 80, 
    alignItems: 'center' 
  },
  emptyContainer: { 
    marginTop: 60, 
    alignItems: 'center' 
  },
  emptyIcon: { 
    fontSize: 48, 
    color: '#D1D5DB' 
  },
  emptyText: { 
    color: '#6B7280', 
    marginTop: 8 
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { 
    color: Colors.white, 
    fontWeight: '600', 
    fontSize: 16 
  },
  placeholderButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderButtonText: {
    color: Colors.gray,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
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
    fontWeight: '600' 
  },
});

export default PantallaResumen;