import * as React from "react";
import {
  View, Text, StyleSheet, Dimensions, Image, TouchableOpacity,
  ScrollView, ActivityIndicator
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyAuth } from '../../../context/AuthContext';
import { ProductListScreen } from '../../../components/Products/ProductRecommended';
import Animated from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;
const IP = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
const placeholderImage = require('../../../assets/placeholder.jpg');

type BackendImage = { id: number; url: string; orden?: number | null; productId?: number };
type BackendProduct = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string | null;
  images?: BackendImage[];      // <- tu API real
  imagen?: string | string[];   // <- por compatibilidad
  color?: string[] | string;
};

function ProductView() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [product, setProduct] = React.useState<{
    id: number;
    name: string;
    description: string;
    images: string[];
    price: number;
    category: string | null;
    color?: string[] | string;
  } | null>(null);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [liked, setLiked] = React.useState(false);
  const [inCart, setInCart] = React.useState(false);
  const [favoritoId, setFavoritoId] = React.useState<number | null>(null);
  const [carritoId, setCarritoId] = React.useState<number | null>(null);
  const { userId } = useMyAuth();
  const [recommended, setRecommended] = React.useState<any[]>([]);
  const [likeTrigger, setLikeTrigger] = React.useState(0);
  const isMounted = React.useRef(true);

  const formatPrice = (price: number) =>
    `MXN $ ${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const getUserId = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('userId');
      return stored ? Number(stored) : userId;
    } catch {
      return userId ?? null;
    }
  }, [userId]);

  React.useEffect(() => () => { isMounted.current = false; }, []);

  // ---- Cargar producto (normaliza imágenes desde images[].url o imagen) ----
  React.useEffect(() => {
    const fetchProduct = async () => {
      const controller = new AbortController();
      try {
        setLoading(true);
        const resp = await fetch(`${IP}/api/products/${id}`, { signal: controller.signal });
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`HTTP ${resp.status}: ${txt}`);
        }
        const data: BackendProduct = await resp.json();

        const urlsFromImages = Array.isArray(data.images)
          ? data.images.map(i => i?.url).filter(Boolean) as string[]
          : [];

        const urlsFromImagen = Array.isArray(data.imagen)
          ? (data.imagen as string[]).map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
          : (typeof data.imagen === 'string' && data.imagen.trim().length > 0 ? [data.imagen.trim()] : []);

        const merged = [...urlsFromImages, ...urlsFromImagen];
        const finalImages = merged.length ? merged : [DEFAULT_IMAGE];

        const transformed = {
          id: data.id,
          name: data.nombre,
          description: data.descripcion,
          images: finalImages,
          price: Number.parseFloat(data.precio),
          category: data.categoria ?? null,
          color: data.color,
        };

        if (isMounted.current) setProduct(transformed);
      } catch (e: any) {
        if (isMounted.current) setError(e?.message || 'Error al obtener el producto.');
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    if (id) fetchProduct();
    else {
      setLoading(false);
      setError('ID del producto no proporcionado.');
    }
  }, [id]);

  // ---- Verificar favorito y carrito (manejo por separado + 404 como vacío) ----
  React.useEffect(() => {
    const verificar = async () => {
      const uid = await getUserId();
      if (!uid) return;

      // favoritos
      try {
        const rf = await fetch(`${IP}/api/favoritos/${uid}`);
        if (rf.ok) {
          const favs = await rf.json();
          const f = Array.isArray(favs) ? favs.find((x: any) => x?.producto?.id === Number(id)) : null;
          if (f) { setLiked(true); setFavoritoId(f.id); }
        }
      } catch (e) { console.warn('No se pudo verificar favoritos:', e); }

      // carrito
      try {
        const rc = await fetch(`${IP}/api/carrito/${uid}`);
        if (rc.ok) {
          const cart = await rc.json();
          const item = Array.isArray(cart) ? cart.find((x: any) => x?.producto?.id === Number(id)) : null;
          if (item) { setInCart(true); setCarritoId(item.id); }
        }
      } catch (e) { console.warn('No se pudo verificar carrito:', e); }
    };

    if (product && isMounted.current) verificar();
  }, [product, getUserId, id]);

  // ---- Recomendados (mapea para ProductListScreen) ----
  React.useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        if (!product?.category) return;
        const r = await fetch(`${IP}/api/products/random/${product.category}`, { signal: controller.signal });
        if (!r.ok) return;
        const data: BackendProduct[] = await r.json();

        const mapped = Array.isArray(data) ? data.map(d => {
          const urls = Array.isArray(d.images) ? d.images.map(x => x?.url).filter(Boolean) as string[] : [];
          const imagen =
            urls.length ? urls :
            (Array.isArray(d.imagen) ? d.imagen.filter(Boolean) as string[] :
             typeof d.imagen === 'string' && d.imagen ? [d.imagen] : []);
          return {
            id: String(d.id),
            nombre: d.nombre,
            precio: String(d.precio),      // <- tu lista espera string
            imagen,                         // <- string[]
            images: imagen,                 // <- por compatibilidad
            categoria: d.categoria ?? '',
          };
        }) : [];

        if (isMounted.current) setRecommended(mapped);
      } catch (e) {
        if (isMounted.current) setRecommended([]);
      }
    };
    if (product?.category) load();
    return () => controller.abort();
  }, [product?.category]);

  const toggleFavorito = async () => {
    const uid = await getUserId();
    if (!uid) return;
    try {
      if (!liked) {
        const r = await fetch(`${IP}/api/favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: uid, productId: Number(id) }),
        });
        if (!r.ok) return;
        const data = await r.json();
        setFavoritoId(data.id);
        setLiked(true);
        setLikeTrigger(x => x + 1);
      } else if (favoritoId) {
        await fetch(`${IP}/api/favoritos/${favoritoId}`, { method: 'DELETE' });
        setFavoritoId(null);
        setLiked(false);
        setLikeTrigger(x => x + 1);
      }
    } catch (e) {
      console.warn('No se pudo alternar favorito:', e);
    }
  };

  const toggleCarrito = async () => {
    const uid = await getUserId();
    if (!uid) return;
    try {
      if (!inCart) {
        const r = await fetch(`${IP}/api/carrito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: uid, productId: Number(id), cantidad: 1 }),
        });
        if (!r.ok) return;
        const data = await r.json();
        setCarritoId(data.id);
        setInCart(true);
      } else if (carritoId) {
        await fetch(`${IP}/api/carrito/${carritoId}`, { method: 'DELETE' });
        setCarritoId(null);
        setInCart(false);
      }
    } catch (e) {
      console.warn('No se pudo alternar carrito:', e);
    }
  };

  const progress = useSharedValue<number>(0);
  const baseOptions = { vertical: false, width: screenWidth, height: verticalScale(350) } as const;
  const ref = React.useRef<ICarouselInstance>(null);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({ count: index - progress.value, animated: true });
  };

  // Carousel data con fallback si no hay imágenes
  const carouselImageData =
    product?.images?.length
      ? product.images.map((u, i) => ({ id: `img-${i}`, image: { uri: u } }))
      : [
          { id: '1', image: placeholderImage },
          { id: '2', image: placeholderImage },
          { id: '3', image: placeholderImage },
        ];

  const renderItem = ({ item }: { item: { id: string; image: any } }) => (
    <Animated.View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#DE1484" />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error al cargar el producto:</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No se encontró el producto con ID: {id}.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          {...baseOptions}
          loop
          onProgressChange={progress}
          style={styles.carousel}
          data={carouselImageData}
          renderItem={renderItem}
        />
        <Pagination.Basic<{ image: any }>
          progress={progress}
          data={carouselImageData}
          size={scale(8)}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          containerStyle={styles.paginationContainer}
          horizontal
          onPress={onPressPagination}
        />
        <TouchableOpacity style={styles.xmarkerContainer} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faXmark} size={moderateScale(20)} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorito} style={styles.heartContainer}>
          <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? "#DE1484" : "#000"} size={moderateScale(24)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleCarrito} style={[styles.heartContainer, styles.cartContainer]}>
          <FontAwesomeIcon icon={faCartShopping} color={inCart ? "#DE1484" : "#000"} size={moderateScale(24)} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.productNameContainer}>
          <Text style={styles.productName} numberOfLines={3} ellipsizeMode="tail">
            {product.name}
          </Text>
          <Text style={styles.productPrice}>{formatPrice(product.price || 0)}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoría:</Text>
            <Text style={styles.infoValue}>{product.category || 'No disponible'}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.infoLabel}>Descripción:</Text>
            <Text style={styles.description}>{product.description || 'Descripción no disponible.'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={toggleCarrito}>
          <Text style={styles.addButtonText}>{inCart ? 'Quitar del carrito' : 'Añadir al carrito'}</Text>
        </TouchableOpacity>

        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedTitle}>Recomendados para ti</Text>
          <ProductListScreen productos={recommended} likeTrigger={likeTrigger} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  carouselContainer: { borderRadius: moderateScale(20), overflow: 'hidden' },
  carousel: { width: screenWidth, position: 'relative' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: moderateScale(20) },
  loadingText: { marginTop: moderateScale(10), fontSize: moderateScale(16), color: '#333' },
  errorText: { color: 'red', fontSize: moderateScale(16), textAlign: 'center', marginBottom: moderateScale(10) },
  itemContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  xmarkerContainer: {
    position: 'absolute', zIndex: 10, top: moderateScale(40), left: moderateScale(12),
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: moderateScale(12),
    width: moderateScale(40), height: moderateScale(40), alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  heartContainer: {
    position: 'absolute', zIndex: 11, bottom: moderateScale(20), right: moderateScale(12),
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: moderateScale(25),
    width: moderateScale(50), height: moderateScale(50), alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  cartContainer: { right: moderateScale(70) },
  dotStyle: { borderRadius: 100, backgroundColor: '#FFFFFF' },
  activeDotStyle: { borderRadius: 100, backgroundColor: '#DE1484' },
  paginationContainer: { position: 'absolute', bottom: moderateScale(10), alignSelf: 'center', zIndex: 10, gap: moderateScale(5) },
  contentContainer: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(20) },
  productNameContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(16) },
  productName: { flex: 1, fontWeight: '500', fontSize: moderateScale(18), color: '#333' },
  productPrice: { fontWeight: '700', fontSize: moderateScale(18), color: '#DE1484' },
  infoContainer: { marginBottom: moderateScale(20) },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(12) },
  infoLabel: { fontWeight: '600', fontSize: moderateScale(14), color: '#333', width: moderateScale(100) },
  infoValue: { fontSize: moderateScale(14), color: '#555' },
  descriptionContainer: { marginTop: moderateScale(12) },
  description: { fontSize: moderateScale(14), color: '#555', lineHeight: moderateScale(20) },
  addButton: {
    backgroundColor: '#DE1484', borderRadius: moderateScale(8), paddingVertical: moderateScale(12),
    alignItems: 'center', justifyContent: 'center', marginBottom: moderateScale(24),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  addButtonText: { color: 'white', fontSize: moderateScale(16), fontWeight: '600' },
  recommendedContainer: { marginBottom: moderateScale(32) },
  recommendedTitle: { fontWeight: '700', fontSize: moderateScale(20), color: '#333', marginBottom: moderateScale(16) },
});

export default ProductView;
