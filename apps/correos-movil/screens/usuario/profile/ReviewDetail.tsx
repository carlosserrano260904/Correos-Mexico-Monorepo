import React from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions,
  TouchableOpacity, ScrollView, StatusBar, Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const { width: screenWidth } = Dimensions.get('window');
const DEFAULT_AVATAR = 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

// Colores
const BRAND_PINK = '#DE1484';
const BG = '#FFFFFF';
const TEXT = '#333';
const DOT = '#ddd';

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  author: { name: string; avatar: string };
  images: string[];
};

type Params = { review: Review; startIndex?: number };

export default function ReviewDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { review, startIndex = 0 } = route.params as Params;

  // Images data
  const data = (review.images?.length ? review.images : [DEFAULT_AVATAR]);
  const [index, setIndex] = React.useState(startIndex);
  const carouselRef = React.useRef<ScrollView>(null);

  const nextImage = () => {
    const nextIndex = (index + 1) % data.length;
    setIndex(nextIndex);
    carouselRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true });
  };

  const prevImage = () => {
    const prevIndex = (index - 1 + data.length) % data.length;
    setIndex(prevIndex);
    carouselRef.current?.scrollTo({ x: prevIndex * screenWidth, animated: true });
  };

  const renderItem = (imageUrl: string, itemIndex: number) => (
    <View key={itemIndex} style={[styles.itemContainer, { width: screenWidth }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
    </View>
  );

  const renderStars = (n: number) => (
    <Text style={styles.stars}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_PINK} />

      {/* Header rosa con safe-area y título centrado */}
      <View style={[styles.safeHeader]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconArea}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Opiniones con fotos</Text>

          {/* Spacer derecho del mismo ancho que el botón de atrás para centrar el título */}
          <View style={styles.headerIconArea} />
        </View>
      </View>

      {/* Zona de imagen (blanco) */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={carouselRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ height: verticalScale(430) }}
          onScrollEndDrag={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
            setIndex(newIndex);
          }}
        >
          {data.map((imageUrl, itemIndex) => renderItem(imageUrl, itemIndex))}
        </ScrollView>

        {/* Contador 1 / N */}
        <View style={styles.counterBox}>
          <Text style={styles.counterText}>{`${index + 1} / ${data.length}`}</Text>
        </View>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {data.map((_, dotIndex) => (
            <TouchableOpacity
              key={dotIndex}
              style={[
                styles.dot,
                index === dotIndex && styles.activeDot,
              ]}
              onPress={() => {
                setIndex(dotIndex);
                carouselRef.current?.scrollTo({ x: dotIndex * screenWidth, animated: true });
              }}
            />
          ))}
        </View>

        {data.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navBtn, { left: 10 }]}
              onPress={prevImage}
            >
              <FontAwesomeIcon icon={faChevronLeft} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, { right: 10 }]}
              onPress={nextImage}
            >
              <FontAwesomeIcon icon={faChevronRight} size={18} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Panel inferior BLANCO (sin “Es útil” ni menú) */}
      <ScrollView style={styles.bottomPanel} contentContainerStyle={{ paddingBottom: 24 }}>
        

        <View style={styles.authorRow}>
          <Image source={{ uri: review.author.avatar || DEFAULT_AVATAR }} style={styles.avatar} />
          <Text style={styles.authorName}>{review.author.name || 'Usuario'}</Text>
        </View>
        <View style={{ marginBottom: 8 }}>
          {renderStars(Math.max(0, Math.min(5, review.rating)))}
        </View>
        <Text style={styles.dateText}>
            {new Date(review.createdAt).toLocaleDateString('es-MX', {
              day: '2-digit', month: 'short', year: 'numeric'
            }).replace('.', '')}
        </Text>
        

        
        <Text style={styles.commentText}>
          {review.comment}
        </Text>

        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header
  safeHeader: {
    backgroundColor: BRAND_PINK,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  headerRow: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconArea: {
    width: 48,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: '#fff',
  },

  // Carrusel (blanco)
  carouselContainer: {
    backgroundColor: BG,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  itemContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },
  image: { width: '100%', height: '100%' },

  counterBox: {
    position: 'absolute',
    top: 10, right: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  counterText: { color: '#fff', fontWeight: '600' },

  dot: { 
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4), 
    backgroundColor: DOT,
    marginHorizontal: scale(2.5),
  },
  activeDot: { 
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4), 
    backgroundColor: BRAND_PINK,
    marginHorizontal: scale(2.5),
  },
  pagination: { 
    position: 'absolute', 
    bottom: moderateScale(12), 
    alignSelf: 'center', 
    zIndex: 10, 
    flexDirection: 'row',
    alignItems: 'center',
  },

  navBtn: {
    position: 'absolute', top: '50%',
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
  },

  // Panel inferior
  bottomPanel: { flex: 1, backgroundColor: BG, paddingHorizontal: 16, paddingTop: 12 },

  // Textos
  stars: { color: BRAND_PINK, fontWeight: '700', letterSpacing: 1 },
  commentText: { color: TEXT, fontSize: 15, lineHeight: 22, marginBottom: 10 },
  dateText: { color: TEXT, fontWeight: '700' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6, marginBottom: 14 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#eee' },
  authorName: { color: TEXT, fontWeight: '600' },
});
