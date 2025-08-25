// apps/correos-movil/screens/usuario/carrito/CarritoScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
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

const API_BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;

// --- Helper: obtiene la imagen con orden 0 (fallbacks seguros) ---
const getImageOrden0 = (p: any): string => {
  const imgs = p?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img0 = imgs.find((x: any) => Number(x?.orden) === 0) || imgs[0];
    const url = (img0?.url ?? p?.imagen ?? '').toString().trim();
    return url || 'https://via.placeholder.com/120x120.png?text=Producto';
  }
  if (p?.imagen) return String(p.imagen).trim(); // soporte legacy
  return 'https://via.placeholder.com/120x120.png?text=Producto';
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

const CarritoScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/carrito/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setCart([]);
        } else {
          console.warn(`Error HTTP: ${response.status}`);
        }
        return;
      }

      const data = await response.json();

      const formattedCart: CartItem[] = data.map((item: any) => ({
        id: item?.id?.toString() || '',
        productId: item?.producto?.id?.toString() || '',
        name: item?.producto?.nombre || 'Sin nombre',
        price: Number(item?.precio_unitario ?? item?.producto?.precio ?? 0),
        quantity: Number(item?.cantidad ?? 1),
        image: getImageOrden0(item?.producto), // << usa orden 0
        color: item?.producto?.color || 'No especificado',
      }));

      setCart(formattedCart);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadCart();
    }
  }, [isFocused]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/carrito/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: newQuantity }),
      });

      if (!response.ok) throw new Error('Error al actualizar cantidad');
      loadCart();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      setLoading(true);
      setCart(prevCart => prevCart.filter(item => item.id !== id)); // optimista
      const response = await fetch(`${API_BASE_URL}/carrito/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al eliminar del carrito');
      loadCart();
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const proceedToPayment = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/carrito/${userId}/proceder`);
      if (!response.ok) throw new Error('Error al procesar el carrito');

      const data = await response.json();
      await AsyncStorage.setItem('resumen_carrito', JSON.stringify(data));
      navigation.navigate('Checkout' as never);
    } catch (error) {
      Alert.alert('Error', 'No se pudo proceder al pago');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemCard}>
      {/* Botón fijo de eliminar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.id)}
        disabled={loading}
        hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
        accessibilityLabel="Eliminar del carrito"
      >
        <Ionicons name="trash-outline" size={20} color="#9CA3AF" />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image }}
        style={styles.itemImage}
        onError={(e) => console.log('Image error:', item.image, e.nativeEvent)}
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
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
          >
            <Text style={styles.qtyButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
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

  const CustomHeader = () => (
    <View style={headerStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => {
            navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
          }}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla principal"
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
      <CustomHeader />

      <ScrollView style={{ paddingHorizontal: 16, marginBottom: cart.length > 0 ? 120 : 20 }}>
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
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

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
          <TouchableOpacity style={styles.checkoutBtn} onPress={proceedToPayment} disabled={loading}>
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
