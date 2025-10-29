import * as React from "react";
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import {
  View, Text, StyleSheet, Dimensions, Image, TouchableOpacity,
  ScrollView, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, TextInput,
  NativeScrollEvent, NativeSyntheticEvent
} from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faCartShopping, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyAuth } from '../../../context/AuthContext';
import { ProductListScreen } from '../../../components/Products/ProductRecommended';

const screenWidth = Dimensions.get('window').width;
const IP = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_IMAGE = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
const placeholderImage = require('../../../assets/placeholder.jpg');

type BackendImage = { id: number; url: string; orden?: number | null; productId?: number };
type BackendReview = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  profile?: { id: number; nombre?: string; apellido?: string; imagen?: string };
  images?: { id: number; url: string; orden?: number; reviewId: number }[];
};
type BackendProduct = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string | number;
  categoria: string | null;
  marca?: string;
  slug?: string;
  vendedor?: string;
  images?: BackendImage[];
  imagen?: string | string[];
  color?: string[] | string;
  reviews?: BackendReview[];
};

// Componente de Carrusel Simple
const SimpleImageCarousel = ({ images, onImagePress }: { images: string[], onImagePress?: (index: number) => void }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  const carouselImages = images?.length ? images : [DEFAULT_IMAGE];

  return (
    <View style={carouselStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {carouselImages.map((image, index) => (
          <TouchableOpacity 
            key={index} 
            style={carouselStyles.slide}
            onPress={() => onImagePress && onImagePress(index)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: image }} 
              style={carouselStyles.image}
              resizeMode="cover"
              defaultSource={placeholderImage}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Indicadores de página */}
      {carouselImages.length > 1 && (
        <View style={carouselStyles.indicatorContainer}>
          {carouselImages.map((_, index) => (
            <View
              key={index}
              style={[
                carouselStyles.indicator,
                index === currentIndex && carouselStyles.activeIndicator
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const carouselStyles = StyleSheet.create({
  container: {
    height: verticalScale(350),
    position: 'relative',
  },
  slide: {
    width: screenWidth,
    height: verticalScale(350),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 16,
  },
});

function ProductView() {
  const navigation = useNavigation<any>();
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
    marca?: string;
    slug?: string;
    vendedor?: string;
    reviews: {
      id: number;
      rating: number;
      comment: string;
      createdAt: string;
      author: { name: string; avatar: string };
      images: string[];
    }[];
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

  // Lightbox
  const [lightboxVisible, setLightboxVisible] = React.useState(false);
  const [lightboxImages, setLightboxImages] = React.useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const openLightbox = (imgs: string[], startIndex = 0) => {
    if (!imgs.length) return;
    setLightboxImages(imgs);
    setLightboxIndex(startIndex);
    setLightboxVisible(true);
  };
  const closeLightbox = () => setLightboxVisible(false);
  const nextLightbox = () => setLightboxIndex(i => (i + 1) % lightboxImages.length);
  const prevLightbox = () => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);

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

  // ---- Cargar producto (imágenes + reviews con imágenes) ----
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
          ? data.images.map(i => i?.url).filter(Boolean) as string[] : [];
        const urlsFromImagen = Array.isArray(data.imagen)
          ? (data.imagen as string[]).map(s => (typeof s === 'string' ? s.trim() : '')).filter(Boolean)
          : (typeof data.imagen === 'string' && data.imagen.trim().length > 0 ? [data.imagen.trim()] : []);
        const merged = [...urlsFromImages, ...urlsFromImagen];
        const finalImages = merged.length ? merged : [DEFAULT_IMAGE];

        const reviews = Array.isArray(data.reviews)
          ? data.reviews.map(r => ({
            id: r.id,
            rating: Number(r.rating) || 0,
            comment: r.comment || '',
            createdAt: r.createdAt,
            author: {
              name: [r.profile?.nombre, r.profile?.apellido].filter(Boolean).join(' ') || 'Usuario',
              avatar: r.profile?.imagen || DEFAULT_IMAGE,
            },
            images: (r.images || []).map(img => img.url).filter(Boolean),
          }))
          : [];

        const transformed = {
          id: data.id,
          name: data.nombre,
          description: data.descripcion,
          images: finalImages,
          price: Number.parseFloat(String(data.precio)),
          category: data.categoria ?? null,
          color: data.color,
          marca: data.marca,
          slug: data.slug,
          vendedor: data.vendedor,
          reviews,
        };

        if (isMounted.current) setProduct(transformed);
      } catch (e: any) {
        if (isMounted.current) setError(e?.message || 'Error al obtener el producto.');
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    if (id) fetchProduct();
    else { setLoading(false); setError('ID del producto no proporcionado.'); }
  }, [id]);

  // ---- Favoritos / Carrito ----
  React.useEffect(() => {
    const verificar = async () => {
      const uid = await getUserId();
      if (!uid) return;
      try {
        const rf = await fetch(`${IP}/api/favoritos/${uid}`);
        if (rf.ok) {
          const favs = await rf.json();
          const f = Array.isArray(favs) ? favs.find((x: any) => x?.producto?.id === Number(id)) : null;
          if (f) { setLiked(true); setFavoritoId(f.id); }
        }
      } catch { }
      try {
        const rc = await fetch(`${IP}/api/carrito/${uid}`);
        if (rc.ok) {
          const cart = await rc.json();
          const item = Array.isArray(cart) ? cart.find((x: any) => x?.producto?.id === Number(id)) : null;
          if (item) { setInCart(true); setCarritoId(item.id); }
        }
      } catch { }
    };
    if (product && isMounted.current) verificar();
  }, [product, getUserId, id]);

  // ---- Recomendados: usar GET /api/products (lista completa) ----
  React.useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const r = await fetch(`${IP}/api/products`, { signal: controller.signal });
        if (!r.ok) return;
        const data: BackendProduct[] = await r.json();

        const mapped = (Array.isArray(data) ? data : [])
          .filter(d => d?.id !== Number(id)) // opcional: ocultar el mismo producto
          .map(d => {
            const urls = Array.isArray(d.images) ? d.images.map(x => x?.url).filter(Boolean) as string[] : [];
            const imagen =
              urls.length ? urls :
                (Array.isArray(d.imagen) ? (d.imagen as string[]).filter(Boolean) :
                  typeof d.imagen === 'string' && d.imagen ? [d.imagen] : []);
            return {
              id: String(d.id),
              nombre: d.nombre,
              precio: Number.parseFloat(String(d.precio)),
              imagen,
              images: imagen,
              categoria: d.categoria ?? '',
            };
          });

        if (isMounted.current) setRecommended(mapped);
      } catch {
        if (isMounted.current) setRecommended([]);
      }
    };
    load();
    return () => controller.abort();
  }, [id]);

  const toggleFavorito = async () => {
    const uid = await getUserId(); if (!uid) return;
    try {
      if (!liked) {
        const r = await fetch(`${IP}/api/favoritos`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: uid, productId: Number(id) }),
        });
        if (!r.ok) return;
        const data = await r.json();
        setFavoritoId(data.id); setLiked(true); setLikeTrigger(x => x + 1);
      } else if (favoritoId) {
        await fetch(`${IP}/api/favoritos/${favoritoId}`, { method: 'DELETE' });
        setFavoritoId(null); setLiked(false); setLikeTrigger(x => x + 1);
      }
    } catch { }
  };

  const toggleCarrito = async () => {
    const uid = await getUserId(); if (!uid) return;
    try {
      if (!inCart) {
        const r = await fetch(`${IP}/api/carrito`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId: uid, productId: Number(id), cantidad: 1 }),
        });
        if (!r.ok) return;
        const data = await r.json();
        setCarritoId(data.id); setInCart(true);
      } else if (carritoId) {
        await fetch(`${IP}/api/carrito/${carritoId}`, { method: 'DELETE' });
        setCarritoId(null); setInCart(false);
      }
    } catch { }
  };

  const renderStars = (n: number) => (
    <Text style={{ color: '#DE1484', fontWeight: '700' }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</Text>
  );

  // ---- Ver más/menos opiniones ----
  const [reviewsVisible, setReviewsVisible] = React.useState(3);

  // ---- Keyboard handling ----
  const scrollRef = React.useRef<ScrollView>(null);
  const handleInputFocus = () => scrollRef.current?.scrollToEnd({ animated: true });

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? moderateScale(60) : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: moderateScale(40) }}
      >
        <View style={styles.carouselContainer}>
          {/* ✅ CARRUSEL SIMPLE REEMPLAZADO */}
          <SimpleImageCarousel 
            images={product.images} 
            onImagePress={(index) => openLightbox(product.images, index)}
          />
          
          {/* Botones superpuestos */}
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

            <View style={styles.descriptionContainer}>
              <Text style={styles.infoLabel}>Descripción:</Text>
              <Text style={styles.description}>{product.description || 'Descripción no disponible.'}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Marca:</Text>
              <Text style={styles.infoValue}>{product.marca || 'Marca no disponible.'}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Vendedor:</Text>
              <Text style={styles.infoValue}>{product.vendedor || 'Vendedor no disponible.'}</Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Categoría:</Text>
              <Text style={styles.infoValue}>{product.category || 'Categora no disponible.'}</Text>
            </View>
          
          </View>

          <TouchableOpacity style={styles.addButton} onPress={toggleCarrito}>
            <Text style={styles.addButtonText}>{inCart ? 'Quitar del carrito' : 'Añadir al carrito'}</Text>
          </TouchableOpacity>

          {/* ====== Reseñas con imágenes ====== */}
          {!!product.reviews.length && (
            <View style={{ marginBottom: moderateScale(24) }}>
              <Text style={styles.recommendedTitle}>Opiniones</Text>

              {product.reviews.slice(0, reviewsVisible).map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <Image source={{ uri: r.author.avatar || DEFAULT_IMAGE }} style={styles.reviewAvatar} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.reviewAuthor}>{r.author.name}</Text>
                      {renderStars(Math.max(0, Math.min(5, r.rating)))}
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(r.createdAt).toLocaleDateString('es-MX')}
                    </Text>
                    <Text style={styles.reviewComment}>{r.comment}</Text>

                    {!!r.images.length && (
                      <View style={styles.reviewThumbRow}>
                        {r.images.map((u, idx) => (
                          <TouchableOpacity key={`${r.id}-${idx}`} onPress={() => navigation.navigate('ReviewDetail', {
                            review: r,        // enviamos TODA la opinión
                            startIndex: idx,  // imagen tocada
                          })}>
                            <Image source={{ uri: u }} style={styles.reviewThumb} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {product.reviews.length > reviewsVisible && (
                <TouchableOpacity
                  style={styles.seeMoreBtn}
                  onPress={() => setReviewsVisible(n => n + 3)}
                >
                  <Text style={styles.seeMoreText}>Ver más</Text>
                </TouchableOpacity>
              )}
              {product.reviews.length > 3 && reviewsVisible >= product.reviews.length && (
                <TouchableOpacity
                  style={styles.seeMoreBtn}
                  onPress={() => setReviewsVisible(3)}
                >
                  <Text style={styles.seeMoreText}>Ver menos</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {product && (
            <ReviewForm
              productId={product.id}
              profileId={userId ? Number(userId) : null}
              onCreated={(newReview) => {
                setProduct(prev => prev
                  ? { ...prev, reviews: [newReview, ...prev.reviews] }
                  : prev
                );
                setReviewsVisible(v => Math.max(3, v)); // mantener al menos 3 visibles
              }}
              onInputFocus={handleInputFocus}
            />
          )}

          <View style={styles.recommendedContainer}>
            <Text style={styles.recommendedTitle}>Recomendados para ti</Text>
            <ProductListScreen productos={recommended} likeTrigger={likeTrigger} />
          </View>
        </View>

        {/* ====== LIGHTBOX ====== */}
        <Modal visible={lightboxVisible} transparent animationType="fade" onRequestClose={closeLightbox}>
          <View style={styles.lightboxBackdrop}>
            <Image
              source={{ uri: lightboxImages[lightboxIndex] || DEFAULT_IMAGE }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.lightboxClose} onPress={closeLightbox}>
              <FontAwesomeIcon icon={faXmark} size={22} />
            </TouchableOpacity>

            {lightboxImages.length > 1 && (
              <>
                <TouchableOpacity style={[styles.navBtn, { left: 10 }]} onPress={prevLightbox}>
                  <FontAwesomeIcon icon={faChevronLeft} size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navBtn, { right: 10 }]} onPress={nextLightbox}>
                  <FontAwesomeIcon icon={faChevronRight} size={20} />
                </TouchableOpacity>
                <Text style={styles.lightboxIndex}>
                  {lightboxIndex + 1}/{lightboxImages.length}
                </Text>
              </>
            )}
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  carouselContainer: { borderRadius: moderateScale(20), overflow: 'hidden' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: moderateScale(20) },
  loadingText: { marginTop: moderateScale(10), fontSize: moderateScale(16), color: '#333' },
  errorText: { color: 'red', fontSize: moderateScale(16), textAlign: 'center', marginBottom: moderateScale(10) },

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
  contentContainer: { paddingHorizontal: moderateScale(16), paddingVertical: moderateScale(20) },
  productNameContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(16) },
  productName: { flex: 1, fontWeight: '500', fontSize: moderateScale(18), color: '#333' },
  productPrice: { fontWeight: '700', fontSize: moderateScale(18), color: '#DE1484' },
  infoContainer: { marginBottom: moderateScale(20) },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(12) },
  infoLabel: { fontWeight: '600', fontSize: moderateScale(14), color: '#333', width: moderateScale(80) },
  infoValue: { fontSize: moderateScale(14), color: '#555' },
  descriptionContainer: { marginBottom: moderateScale(20) },
  description: { fontSize: moderateScale(14), color: '#555', lineHeight: moderateScale(20) },

  // reviews
  reviewCard: {
    flexDirection: 'row',
    paddingVertical: moderateScale(10),
    gap: moderateScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  reviewAvatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), backgroundColor: '#eee' },
  reviewAuthor: { fontWeight: '600', fontSize: moderateScale(14), color: '#333' },
  reviewDate: { fontSize: moderateScale(12), color: '#999', marginTop: 2 },
  reviewComment: { marginTop: 6, color: '#444' },
  reviewThumbRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  reviewThumb: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#eee' },

  addButton: {
    backgroundColor: '#DE1484', borderRadius: moderateScale(8), paddingVertical: moderateScale(12),
    alignItems: 'center', justifyContent: 'center', marginBottom: moderateScale(24),
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  addButtonText: { color: 'white', fontSize: moderateScale(16), fontWeight: '600' },
  recommendedContainer: { marginBottom: moderateScale(32) },
  recommendedTitle: { fontWeight: '700', fontSize: moderateScale(20), color: '#333', marginBottom: moderateScale(12) },

  // ver más
  seeMoreBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    marginTop: 8,
  },
  seeMoreText: { color: '#DE1484', fontWeight: '600' },

  // lightbox
  lightboxBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', alignItems: 'center', justifyContent: 'center' },
  lightboxImage: { width: '100%', height: '100%' }, // pantalla completa
  lightboxClose: {
    position: 'absolute', top: 30, right: 16,
    backgroundColor: 'white', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'
  },
  navBtn: {
    position: 'absolute', top: '50%', width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
  },
  lightboxIndex: { position: 'absolute', bottom: 24, color: 'white', fontWeight: '600' },
});

// ... (el componente ReviewForm permanece igual...)
function ReviewForm({
  productId,
  profileId,
  onCreated,
  onInputFocus,
}: {
  productId: number;
  profileId: number | null;
  onCreated: (r: {
    id: number; rating: number; comment: string; createdAt: string;
    author: { name: string; avatar: string }; images: string[];
  }) => void;
  onInputFocus?: () => void;
}) {
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');
  const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
  const [sending, setSending] = React.useState(false);
  const MAX_IMAGES = 6;
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { alert('Se requiere permiso a la galería'); return; }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      // si el SO no soporta multi, con varios toques se irán acumulando
      selectionLimit: Math.max(1, MAX_IMAGES - images.length), // algunos dispositivos lo soportan
      orderedSelection: true,
    });

    if (!res.canceled) {
      setImages(prev => {
        // acumula
        const merged = [...prev, ...res.assets];
        // de-dup por uri
        const map = new Map<string, ImagePickerAsset>();
        merged.forEach(a => map.set(a.uri, a));
        // respeta el máximo
        return Array.from(map.values()).slice(0, MAX_IMAGES);
      });
    }
  };


  const submit = async () => {
    if (!profileId) { alert('Inicia sesión para comentar.'); return; }
    if (!comment.trim()) { alert('Escribe un comentario.'); return; }
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('rating', String(rating));
      fd.append('comment', comment.trim());
      fd.append('productId', String(productId));
      fd.append('profileId', String(profileId));

      images.forEach((a, i) => {
        fd.append('files', {
          uri: a.uri,
          name: `review_${Date.now()}_${i}.jpg`,
          type: 'image/jpeg',
        } as any);
      });

      const resp = await fetch(`${IP}/api/reviews/with-images`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }, // RN define Content-Type con boundary
        body: fd,
      });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`Error ${resp.status}: ${t}`);
      }
      const created = await resp.json();
      onCreated({
        id: created.id,
        rating: created.rating,
        comment: created.comment,
        createdAt: created.createdAt,
        author: {
          name: created?.profile?.nombre ?? 'Usuario',
          avatar: created?.profile?.imagen ?? DEFAULT_IMAGE,
        },
        images: (created?.images ?? []).map((x: any) => x.url).filter(Boolean),
      });
      setComment('');
      setImages([]);
      setRating(5);
    } catch (e: any) {
      alert(e?.message ?? 'No se pudo enviar la reseña');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={reviewStyles.card}>
      <Text style={reviewStyles.title}>Escribe tu reseña</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ marginRight: 8 }}>Calificación:</Text>
        {[1, 2, 3, 4, 5].map(n => (
          <TouchableOpacity key={n} onPress={() => setRating(n)} style={{ marginRight: 4 }}>
            <Text style={{ fontSize: 18, color: n <= rating ? '#DE1484' : '#aaa' }}>
              {n <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ height: 0, width: 0 }}
      />
      <TextInput
        placeholder="¿Qué te pareció el producto?"
        multiline
        value={comment}
        onChangeText={setComment}
        onFocus={onInputFocus}
        style={reviewStyles.input}
      />

      {!!images.length && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          {images.map((img, i) => (
            <View key={img.uri} style={{ position: 'relative' }}>
              <Image source={{ uri: img.uri }} style={{ width: 64, height: 64, borderRadius: 6 }} />
              <TouchableOpacity
                onPress={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                style={{
                  position: 'absolute', top: -6, right: -6, width: 22, height: 22,
                  borderRadius: 11, backgroundColor: '#0008', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Text style={{ color: 'white', fontWeight: '700' }}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}


      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity style={[reviewStyles.btn, { backgroundColor: '#eee' }]} onPress={pickImages}>
          <Text>Agregar fotos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[reviewStyles.btn, { backgroundColor: '#DE1484' }]}
          onPress={submit}
          disabled={sending}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>{sending ? 'Enviando…' : 'Publicar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 8, color: '#333' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  btn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
});

export default ProductView;