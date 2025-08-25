// apps/correos-movil/screens/usuario/favoritos/FavoritosScreen.tsx
import React, { useCallback, useEffect, useState } from 'react';
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

const API_BASE_URL = 'https://correos-mexico-monorepo.onrender.com/api';
const CACHE_KEY = 'favorites_cache_v1';
const CACHE_TTL_MS = 60_000;

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

const FavoriteRow = React.memo(function FavoriteRow({
  item,
  loading,
  onRemove,
  onAdd,
}: {
  item: any;
  loading: boolean;
  onRemove: (id: string) => void;
  onAdd: (prod: any) => void;
}) {
  const img = getProductImage(item.producto) || 'https://via.placeholder.com/70x70?text=Sin+Imagen';
  return (
    <View style={styles.itemCard}>
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: img }}
          style={styles.itemImage}
          defaultSource={undefined}
        />
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(item.id)}
          disabled={loading}
        >
          <Heart size={14} color="white" fill="#e11d48" />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemTitle}>
          {item.producto?.nombre || 'Sin nombre'}
        </Text>
        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.producto?.descripcion || ''}
        </Text>
        <Text style={styles.itemPrice}>
          MXN{' '}
          {item.producto?.precio !== undefined
            ? Number(item.producto.precio).toFixed(2)
            : ''}
        </Text>
        <TouchableOpacity
          onPress={() => onAdd(item.producto)}
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
});

const FavoritosScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [netLoading, setNetLoading] = useState(false);

  const loadFromCache = useCallback(async () => {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.data)) {
        return parsed.data as any[];
      }
    } catch {}
    return null;
  }, []);

  const saveCache = useCallback(async (data: any[]) => {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  }, []);

  const loadFavorites = useCallback(async () => {
    setNetLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        setFavorites([]);
        return;
      }

      // 1) Cache inmediata
      const cached = await loadFromCache();
      if (cached) setFavorites(cached);

      // 2) Refresco en segundo plano
      const response = await fetchWithTimeout(`${API_BASE_URL}/favoritos/${userId}`);
      const data = await response.json();
      const arr = Array.isArray(data) ? data : [];
      setFavorites(arr);
      saveCache(arr);

      // Prefetch de la primera imagen de cada producto
      const urls = arr
        .map((it: any) => getProductImage(it.producto))
        .filter(Boolean) as string[];
      await Promise.allSettled(urls.map((u) => Image.prefetch(u)));
    } catch (error) {
      if (favorites.length === 0) {
        console.error('Error al cargar favoritos:', error);
        Alert.alert('Error', 'No se pudo cargar la lista de favoritos');
      }
    } finally {
      setNetLoading(false);
    }
  }, [favorites.length, loadFromCache, saveCache]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const removeFavorite = useCallback(async (id: string) => {
    setLoading(true);
    try {
      setFavorites(prev => prev.filter(item => item.id !== id)); // optimista
      const response = await fetchWithTimeout(`${API_BASE_URL}/favoritos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error al eliminar favorito');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el favorito');
      loadFavorites();
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  const addToCart = useCallback(async (producto: any) => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'No se encontró el usuario');
        setLoading(false);
        return;
      }

      const response = await fetchWithTimeout(`${API_BASE_URL}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: Number(userId),
          productId: producto.id,
          cantidad: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.id) {
        console.log('Error al añadir al carrito:', data);
        throw new Error('Respuesta inválida del servidor');
      }

      Alert.alert('Éxito', `${producto.nombre} añadido al carrito`);
    } catch (error) {
      console.error('Error en addToCart:', error);
      Alert.alert('Error', 'No se pudo añadir al carrito');
    } finally {
      setLoading(false);
    }
  }, []);

  const keyExtractor = useCallback((it: any) => it.id?.toString?.() ?? String(it.id), []);
  const renderItem = useCallback(
    ({ item }: any) => (
      <FavoriteRow
        item={item}
        loading={loading}
        onRemove={removeFavorite}
        onAdd={addToCart}
      />
    ),
    [loading, removeFavorite, addToCart]
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
            onPress={() => navigation.goBack()}
            accessibilityLabel="Regresar"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <Text style={headerStyles.headerTitle}>Favoritos</Text>
        </View>
      </View>

      {netLoading && favorites.length === 0 ? (
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
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={8}
          windowSize={5}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
          getItemLayout={getItemLayout}
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
    shadowOffset: { width: 0, height: 1 }
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee'
  },
  removeBtn: {
    position: 'absolute',
    top: -7, right: -7,
    backgroundColor: '#e11d48',
    borderRadius: 14,
    padding: 4,
    elevation: 2
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
    marginBottom: 3
  },
  itemDesc: {
    color: '#666',
    fontSize: 13,
    marginBottom: 3
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 7
  },
  addCartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center'
  },
});

export default FavoritosScreen;
