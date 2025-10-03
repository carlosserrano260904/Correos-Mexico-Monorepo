// apps/correos-movil/screens/usuario/favoritos/FavoritosScreen.tsx
import React, { useState, useCallback } from 'react';
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
import { Heart } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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

// ---------- Helper: obtiene la URL con orden 0 (fallbacks seguros) ----------
const getImageOrden0 = (producto: any): string => {
  const imgs = producto?.images;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const img0 = imgs.find((x: any) => Number(x?.orden) === 0);
    return img0?.url || imgs[0]?.url || 'https://via.placeholder.com/120x120.png?text=Producto';
  }
  // soporte legacy si hubiera un campo `imagen`
  if (producto?.imagen) return producto.imagen;
  return 'https://via.placeholder.com/120x120.png?text=Producto';
};

const FavoritosScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        setFavorites([]);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/favoritos/${userId}`);
      if (!response.ok) {
        setFavorites([]);
        return;
      }
      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de favoritos');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/favoritos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al eliminar favorito');
      setFavorites(prev => prev.filter(item => String(item.id) !== String(id)));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el favorito');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (producto: any) => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: Number(userId),
          productId: producto.id,
          cantidad: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.id) {
        console.log('Error al añadir al carrito:', data);
        throw new Error('Respuesta inválida del servidor');
      }

      Alert.alert('Éxito', `${producto.nombre ?? 'Producto'} añadido al carrito`);
    } catch (error) {
      console.error('Error en addToCart:', error);
      Alert.alert('Error', 'No se pudo añadir al carrito');
    } finally {
      setLoading(false);
    }
  };

  const CustomHeader = () => (
    <View style={headerStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={headerStyles.headerTitle}>Favoritos</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: any) => {
    const producto = item?.producto;
    const imageUrl = getImageOrden0(producto);

    return (
      <View style={styles.itemCard}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFavorite(item.id)}
            disabled={loading}
          >
            <Heart size={14} color="white" fill="#e11d48" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {producto?.nombre || 'Sin nombre'}
          </Text>
          {!!producto?.descripcion && (
            <Text style={styles.itemDesc} numberOfLines={2}>
              {producto.descripcion}
            </Text>
          )}
          <Text style={styles.itemPrice}>
            MXN {producto?.precio !== undefined ? Number(producto.precio).toFixed(2) : '0.00'}
          </Text>
          <TouchableOpacity
            onPress={() => addToCart(producto)}
            style={styles.addCartBtn}
            disabled={loading}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>
              {loading ? 'Añadiendo...' : 'Añadir a la cesta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar style="dark" />
      <CustomHeader />

      {loading ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : favorites.length === 0 ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 20 }}>
          <Heart size={48} color="#D1D5DB" />
          <Text style={{ color: '#6B7280', fontSize: 17, marginTop: 8 }}>No tienes productos favoritos</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 8, textAlign: 'center' }}>
            Los productos que marques como favoritos aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
        />
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
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 12,
    marginVertical: 7,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  removeBtn: {
    position: 'absolute',
    top: -7,
    right: -7,
    backgroundColor: '#e11d48',
    borderRadius: 14,
    padding: 4,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
  },
  itemDesc: {
    color: '#666',
    fontSize: 13,
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 7,
  },
  addCartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default FavoritosScreen;
