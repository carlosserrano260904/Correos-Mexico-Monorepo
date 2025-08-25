// apps/correos-movil/screens/usuario/carrito/CarritoScreen.tsx
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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

const API_BASE_URL = 'https://correos-mexico-monorepo.onrender.com/api';
const CACHE_KEY = 'cart_cache_v1';
const CACHE_TTL_MS = 60_000; // 1 minuto

// ───────── Utilidades ─────────
const getProductImage = (p: any): string | null => {
  if (Array.isArray(p?.images) && p.images.length > 0) {
    const sorted = [...p.images].sort(
      (a: any, b: any) => (a?.orden ?? 0) - (b?.orden ?? 0)
    );
    return sorted[0]?.url ?? null;
  }
  return p?.imagen ?? null;
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 10_000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
}

// Ítem memoizado para que no re-renderice toda la lista
const CartRow = React.memo(function CartRow({
  item,
  loading,
  onRemove,
  onInc,
  onDec,
}: {
  item: CartItem;
  loading: boolean;
  onRemove: (id: string) => void;
  onInc: (id: string, qty: number) => void;
  onDec: (id: string, qty: number) => void;
}) {
  return (
    <View style={styles.itemCard}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onRemove(item.id)}
        disabled={loading}
        hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
        accessibilityLabel="Eliminar del carrito"
      >
        <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        defaultSource={undefined /* iOS: agrega un asset si quieres */}
      />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.itemDesc}>Color: {item.color}</Text>
        <Text style={styles.itemPrice}>MXN {item.price.toFixed(2)}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onDec(item.id, item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onInc(item.id, item.quantity + 1)}
            disabled={loading}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ color: '#888', fontSize: 13 }}>Subtotal</Text>
            <Text style={{ fontWeight: 'bold' }}>
              MXN {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const CarritoScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [netLoading, setNetLoading] = useState(false); // solo para el spinner central

  const calculateTotal = useCallback(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  // Prefetch de imágenes (mejora el render)
  const prefetchImages = useCallback(async (items: CartItem[]) => {
    const urls = items.map((i) => i.image).filter(Boolean);
    await Promise.allSettled(urls.map((u) => Image.prefetch(u)));
  }, []);

  const mapResponse = useCallback((data: any[]) => {
    return data.map((item: any) => ({
      id: item.id?.toString() || '',
      productId: item.producto?.id?.toString() || '',
      name: item.producto?.nombre || 'Sin nombre',
      price: Number(item.precio_unitario || item.producto?.precio || 0),
      quantity: Number(item.cantidad || 1),
      image:
        getProductImage(item.producto) ||
        'https://via.placeholder.com/70x70?text=Sin+Imagen',
      color: item.producto?.color || 'No especificado',
    })) as CartItem[];
  }, []);

  const loadFromCache = useCallback(async () => {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.data)) {
        return parsed.data as CartItem[];
      }
    } catch {}
    return null;
  }, []);

  const saveCache = useCallback(async (data: CartItem[]) => {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  }, []);

  const loadCart = useCallback(async () => {
    setNetLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        return;
      }

      // 1) Mostrar caché instantáneo
      const cached = await loadFromCache();
      if (cached) {
        setCart(cached);
      }

      // 2) Refrescar en segundo plano
      const response = await fetchWithTimeout(`${API_BASE_URL}/carrito/${userId}`);
      if (!response.ok) {
        if (response.status === 404) setCart([]);
        return;
      }
      const data = await response.json();
      const formatted = mapResponse(data);
      setCart(formatted);
      saveCache(formatted);
      prefetchImages(formatted);
    } catch (error: any) {
      if (cart.length === 0) {
        Alert.alert('Error', 'No se pudo cargar el carrito');
      }
    } finally {
      setNetLoading(false);
    }
  }, [cart.length, loadFromCache, mapResponse, prefetchImages, saveCache]);

  useEffect(() => {
    if (isFocused) loadCart();
  }, [isFocused, loadCart]);

  // Handlers memo
  const updateQuantity = useCallback(async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeFromCart(id);
    try {
      setLoading(true);
      const response = await fetchWithTimeout(`${API_BASE_URL}/carrito/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: newQuantity }),
      });
      if (!response.ok) throw new Error('Error al actualizar cantidad');
      // Actualización local rápida
      setCart(prev => prev.map(it => it.id === id ? { ...it, quantity: newQuantity } : it));
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setCart(prev => prev.filter(item => item.id !== id)); // optimista
      const response = await fetchWithTimeout(`${API_BASE_URL}/carrito/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al eliminar del carrito');
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el producto');
      loadCart(); // re-sync
    } finally {
      setLoading(false);
    }
  }, [loadCart]);

  const proceedToPayment = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        return;
      }
      const response = await fetchWithTimeout(`${API_BASE_URL}/carrito/${userId}/proceder`);
      if (!response.ok) throw new Error('Error al procesar el carrito');
      const data = await response.json();
      await AsyncStorage.setItem('resumen_carrito', JSON.stringify(data));
      navigation.navigate('Checkout' as never);
    } catch {
      Alert.alert('Error', 'No se pudo proceder al pago');
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  const keyExtractor = useCallback((it: CartItem) => it.id, []);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartRow
        item={item}
        loading={loading}
        onRemove={removeFromCart}
        onInc={(id, qty) => updateQuantity(id, qty)}
        onDec={(id, qty) => updateQuantity(id, qty)}
      />
    ),
    [loading, removeFromCart, updateQuantity]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({ length: 94, offset: 94 * index, index }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={headerStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={() => {
              navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
            }}
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <Text style={headerStyles.headerTitle}>Carrito</Text>
        </View>
      </View>

      {netLoading && cart.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : cart.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 48, color: '#D1D5DB', marginBottom: 8 }}>🛒</Text>
          <Text style={{ color: '#6B7280' }}>Tu carrito está vacío</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 8 }}>
            Añade productos a tu carrito para verlos aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
          initialNumToRender={8}
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          getItemLayout={getItemLayout}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.checkoutBox}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: '#666' }}>Subtotal:</Text>
            <Text style={{ fontWeight: 'bold' }}>MXN {calculateTotal().toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: '#666' }}>Envío:</Text>
            <Text style={{ fontWeight: 'bold' }}>Gratis</Text>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: '#E5E7EB',
              paddingTop: 6,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total:</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.primary }}>
              MXN {calculateTotal().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={proceedToPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Proceder al pago
              </Text>
            )}
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
  backButton: {
    padding: width * 0.02,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
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
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
  },
  itemDesc: {
    color: '#666',
    fontSize: 13,
    marginBottom: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 3,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  qtyButtonText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  qtyText: {
    fontWeight: '500',
    width: 24,
    textAlign: 'center',
    fontSize: 16,
  },
  checkoutBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  checkoutBtn: {
    marginTop: 10,
    backgroundColor: '#e11d48',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
});

export default CarritoScreen;
