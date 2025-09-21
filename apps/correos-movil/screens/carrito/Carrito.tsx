import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator,
  Alert, StyleSheet, ScrollView, SafeAreaView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  background: '#F5F5F5',
};

const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
};

type Coupon = {
  titulo: string;
  porcentaje: number;
  compraMinima: number;
  codigo?: string | null;
};

const formatMXN = (n: number) => `MXN ${Number(n).toFixed(2)}`;

const getImageOrden0 = (p: any): string => {
  const imgs = p?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img0 = imgs.find((x: any) => Number(x?.orden) === 0) || imgs[0];
    const url = (img0?.url ?? p?.imagen ?? '').toString().trim();
    return url || 'https://via.placeholder.com/120x120.png?text=Producto';
  }
  if (p?.imagen) return String(p.imagen).trim();
  return 'https://via.placeholder.com/120x120.png?text=Producto';
};

const Carrito: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute<any>(); // si tienes RootStackParamList, tipa correctamente

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // 1) Cargar carrito del backend
  const loadCart = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario.');
        setCart([]);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/carrito/${userId}`);
      if (!response.ok) {
        if (response.status === 404) setCart([]);
        else console.warn('Error carrito:', response.status);
        return;
      }
      const data = await response.json();
      const list: CartItem[] = Array.isArray(data)
        ? data.map((item: any) => ({
            id: String(item?.id ?? ''),
            productId: String(item?.producto?.id ?? ''),
            name: item?.producto?.nombre ?? 'Sin nombre',
            price: Number(item?.precio_unitario ?? item?.producto?.precio ?? 0),
            quantity: Number(item?.cantidad ?? 1),
            image: getImageOrden0(item?.producto),
            color: item?.producto?.color ?? 'No especificado',
          }))
        : [];
      setCart(list);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo cargar el carrito.');
    } finally {
      setLoading(false);
    }
  };

  // 2) Tomar el cupón desde los params (NO AsyncStorage)
  useEffect(() => {
    // Si llegamos desde MisCupones con params: { coupon }
    const incoming: Coupon | undefined = route?.params?.coupon;
    if (incoming && typeof incoming.porcentaje !== 'undefined') {
      setAppliedCoupon({
        titulo: incoming.titulo,
        porcentaje: Number(incoming.porcentaje || 0),
        compraMinima: Number(incoming.compraMinima || 0),
        codigo: incoming.codigo ?? null,
      });
      // Limpia el param para evitar re-aplicar si vuelves
      try {
        // @ts-ignore
        navigation.setParams?.({ coupon: undefined });
      } catch {}
    }
  }, [route?.params?.coupon, navigation]);

  // 3) Recargar carrito al enfocar
  useEffect(() => {
    if (isFocused) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // 4) Acciones de ítems
  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty <= 0) return removeFromCart(id);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/carrito/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: newQty }),
      });
      if (!res.ok) throw new Error('PATCH qty failed');
      await loadCart();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la cantidad.');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setLoading(true);
      setCart(prev => prev.filter(i => i.id !== id)); // optimista
      const res = await fetch(`${API_BASE_URL}/carrito/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('DELETE failed');
      await loadCart();
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  // 5) Totales
  const subtotal = useMemo(
    () => cart.reduce((acc, it) => acc + Number(it.price) * Number(it.quantity), 0),
    [cart]
  );

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < (appliedCoupon.compraMinima || 0)) return 0;
    const pct = Math.max(0, Math.min(100, Number(appliedCoupon.porcentaje || 0)));
    return subtotal * (pct / 100);
  }, [appliedCoupon, subtotal]);

  // Agregar cálculo de envío
  const shippingCost = useMemo(() => {
    if (subtotal >= 199) return 0; // Envío gratis
    return subtotal * 0.10; // 10% de cargo por envío
  }, [subtotal]);

  // Modificar el cálculo del total para incluir envío
  const total = useMemo(() => 
    Math.max(0, subtotal - discount + shippingCost), 
    [subtotal, discount, shippingCost]
  );

  // 6) UI
  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.id)}
        disabled={loading}
        hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
        accessibilityLabel="Eliminar del carrito"
      >
        <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemDesc}>Color: {item.color}</Text>
        <Text style={styles.itemPrice}>{formatMXN(item.price)}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}>
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, item.quantity + 1)} disabled={loading}>
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
          <Text style={{ color: '#888', fontSize: 13 }}>Subtotal</Text>
          <Text style={{ fontWeight: 'bold' }}>{formatMXN(item.price * item.quantity)}</Text>
        </View>
      </View>
    </View>
  );

  const Header = () => (
    <View style={headerStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => {
            // @ts-ignore
            navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
          }}
          accessibilityLabel="Regresar"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Carrito</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="dark" />
      <Header />

      <ScrollView style={{ paddingHorizontal: 16, marginBottom: cart.length > 0 ? 150 : 20 }}>
        {loading ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : cart.length === 0 ? (
          <View style={{ alignItems: 'center', marginVertical: 40 }}>
            <Text style={{ fontSize: 48, color: '#D1D5DB', marginBottom: 8 }}>🛒</Text>
            <Text style={{ color: '#6B7280' }}>Tu carrito está vacío</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 8 }}>
              Añade productos a tu carrito para verlos aquí
            </Text>
          </View>
        ) : (
          <FlatList data={cart} keyExtractor={(it) => it.id} renderItem={renderItem} scrollEnabled={false} />
        )}
      </ScrollView>

      {cart.length > 0 && (
        <View style={styles.checkoutBox}>
          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={{ color: '#666' }}>Subtotal:</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatMXN(subtotal)}</Text>
          </View>

          {/* Fila cupón */}
          {appliedCoupon ? (
            <>
              <View style={styles.row}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{ color: '#10B981', fontWeight: '600' }}>
                    Cupón: {appliedCoupon.titulo} ({appliedCoupon.porcentaje}%)
                  </Text>
                  {subtotal < (appliedCoupon.compraMinima || 0) && (
                    <Text style={{ color: '#F59E0B', fontSize: 12 }}>
                      Agrega {formatMXN((appliedCoupon.compraMinima || 0) - subtotal)} para alcanzar el mínimo.
                    </Text>
                  )}
                </View>
                <Text style={{ fontWeight: 'bold', color: '#10B981' }}>
                  - {formatMXN(discount)}
                </Text>
              </View>

              <TouchableOpacity onPress={() => setAppliedCoupon(null)} style={{ alignSelf: 'flex-start', marginBottom: 6 }}>
                <Text style={{ color: '#EF4444', fontSize: 12, textDecorationLine: 'underline' }}>
                  Quitar cupón
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('MisCuponesScreen'); // cambia si tu ruta tiene otro name
              }}
              style={{ marginBottom: 6 }}
            >
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                ¿Tienes un cupón? Selecciona uno
              </Text>
            </TouchableOpacity>
          )}

          {/* Envío */}
          <View style={styles.row}>
            <Text style={{ color: '#666' }}>Envío:</Text>
            {subtotal >= 199 ? (
              <Text style={{ fontWeight: 'bold', color: '#10B981' }}>Gratis</Text>
            ) : (
              <>
                <Text style={{ fontWeight: 'bold', color: '#EF4444' }}>
                  {formatMXN(shippingCost)}
                </Text>
              </>
            )}
          </View>
          {subtotal < 199 && (
            <Text style={{ color: '#F59E0B', fontSize: 12, marginBottom: 6 }}>
              Agrega {formatMXN(199 - subtotal)} más para obtener envío gratis
            </Text>
          )}

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total:</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.primary }}>
              {formatMXN(total)}
            </Text>
          </View>

          {/* Proceder */}
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={async () => {
              try {
                setLoading(true);
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) throw new Error('Sin usuario');

                await AsyncStorage.setItem(
                  'resumen_carrito',
                  JSON.stringify({ subtotal, discount, total, coupon: appliedCoupon })
                );

                // @ts-ignore
                navigation.navigate('Checkout');
              } catch {
                Alert.alert('Error', 'No se pudo proceder al pago.');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Proceder al pago</Text>}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    paddingTop: height * 0.06,
    backgroundColor: Colors.white,
    minHeight: height * 0.12,
  },
  backButton: { padding: width * 0.02, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
});

const styles = StyleSheet.create({
  itemCard: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 12,
    paddingRight: 40,
    marginVertical: 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  itemImage: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#eee' },
  itemTitle: { fontWeight: '600', fontSize: 16, color: '#222' },
  itemDesc: { color: '#666', fontSize: 13, marginBottom: 1 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#e11d48', marginBottom: 3 },
  qtyButton: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 2,
  },
  qtyButtonText: { fontSize: 18, color: '#222', fontWeight: 'bold' },
  qtyText: { fontWeight: '500', width: 24, textAlign: 'center', fontSize: 16 },

  checkoutBox: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'white',
    borderTopWidth: 1, borderColor: '#E5E7EB', padding: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalRow: {
    borderTopWidth: 1, borderColor: '#E5E7EB', paddingTop: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  checkoutBtn: {
    marginTop: 10, backgroundColor: '#e11d48', paddingVertical: 13,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center', height: 50,
  },
});

export default Carrito;
