import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const PINK = '#e91e63';
const BG = '#F5F5F5';
const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [profileId, setProfileId] = useState(null);
  const [cart, setCart] = useState([]); // { id, nombre, precio, quantity }

  // Recuperar profileId de AsyncStorage
  useEffect(() => {
    (async () => {
      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) setProfileId(parseInt(storedId, 10));
    })();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/products`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Añadir al carrito o incrementar cantidad
  const handleAddToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === item.id);
      if (exists) {
        return prev.map(p =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { id: item.id, nombre: item.nombre, precio: item.precio, quantity: 1 }];
      }
    });
  };

  // Enviar la transacción al backend
  const handleCheckout = async () => {
    if (!profileId) {
      return Alert.alert('Error', 'No se encontró el perfil de usuario.');
    }
    if (cart.length === 0) {
      return Alert.alert('Carrito vacío', 'Agrega al menos un producto.');
    }

    // NO incluir nunca "total" en el payload
    const payload = {
      profileId,
      contenidos: cart.map(p => ({
        productId: p.id,
        cantidad: p.quantity,
        precio: Number(p.precio || 0) * p.quantity,
      })),
    };

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        Alert.alert('¡Listo!', 'Venta almacenada correctamente.');
        setCart([]);
      } else {
        const errorData = await res.json();
        const msg = Array.isArray(errorData.message)
          ? errorData.message.join('\n')
          : typeof errorData.message === 'string'
          ? errorData.message
          : 'Algo salió mal.';
        console.error(errorData);
        Alert.alert('Error', msg);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo conectar al servidor.');
    }
  };

  const renderItem = ({ item }) => {
    const price = Number(item.precio || 0);
    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          {item.imagen && <Image source={{ uri: item.imagen }} style={styles.image} />}
        </View>
        <View style={styles.row}>
          <View style={styles.dot} />
          <Text style={styles.nombre} numberOfLines={2}>{item.nombre}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={18} color="#666" />
          </TouchableOpacity>
        </View>
        <View style={[styles.row, styles.footerRow]}>
          <Text style={styles.precio}>MXN {price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PINK} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar un producto..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Productos destacados</Text>
        <Text style={styles.subtitle}>{productos.length} artículos</Text>
      </View>
      <FlatList
        data={productos.filter(p =>
          p.nombre.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
      {cart.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cart.reduce((sum, p) => sum + p.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: BG },
  searchContainer: {
    flex: 1, flexDirection: 'row', backgroundColor: '#eee',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 12, alignItems: 'center',
  },
  searchInput: { flex: 1, fontSize: 14 },
  titleContainer: { paddingHorizontal: 16, paddingBottom: 8, backgroundColor: BG },
  title: { fontSize: 20, fontWeight: '600', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  columnWrapper: { justifyContent: 'space-between' },
  card: {
    width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 10, marginBottom: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  imageWrapper: {
    width: '100%', height: 140, overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: PINK, marginRight: 6 },
  nombre: { flex: 1, fontSize: 14, fontWeight: '600', color: '#333' },
  footerRow: { justifyContent: 'space-between', marginBottom: 8, marginTop: 4 },
  precio: { fontSize: 14, fontWeight: '600', color: PINK },
  addButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: PINK, justifyContent: 'center', alignItems: 'center',
  },
  checkoutButton: {
    position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28,
    backgroundColor: PINK, justifyContent: 'center', alignItems: 'center',
  },
  badge: {
    position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: PINK },
});
