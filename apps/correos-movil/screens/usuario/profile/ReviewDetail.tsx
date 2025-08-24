import React from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions,
  TouchableOpacity, ScrollView, StatusBar, Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Carousel, { Pagination, ICarouselInstance } from 'react-native-reanimated-carousel';
import Animated, { useSharedValue } from 'react-native-reanimated';
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

  // Carrusel
  const progress = useSharedValue<number>(startIndex);
  const ref = React.useRef<ICarouselInstance>(null);
  const data = (review.images?.length ? review.images : [DEFAULT_AVATAR]).map((u, i) => ({
    id: `img-${i}`,
    image: { uri: u },
  }));
  const [index, setIndex] = React.useState(startIndex);

  const renderItem = ({ item }: { item: { id: string; image: any } }) => (
    <Animated.View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
    </Animated.View>
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
        <Carousel
          ref={ref}
          width={screenWidth}
          height={verticalScale(430)}
          data={data}
          renderItem={renderItem}
          defaultIndex={startIndex}
          loop
          onProgressChange={(_, abs) => {
            progress.value = abs;
            setIndex(Math.abs(Math.round(abs)) % data.length);
          }}
        />

        {/* Contador 1 / N */}
        <View style={styles.counterBox}>
          <Text style={styles.counterText}>{`${index + 1} / ${data.length}`}</Text>
        </View>

        <Pagination.Basic
          progress={progress}
          data={data}
          size={scale(8)}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          containerStyle={styles.pagination}
          horizontal
          onPress={(i) => ref.current?.scrollTo({ count: i - (progress.value ?? 0), animated: true })}
        />

        {data.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navBtn, { left: 10 }]}
              onPress={() => ref.current?.scrollTo({ count: -1, animated: true })}
            >
              <FontAwesomeIcon icon={faChevronLeft} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, { right: 10 }]}
              onPress={() => ref.current?.scrollTo({ count: 1, animated: true })}
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

  dot: { borderRadius: 999, backgroundColor: DOT },
  activeDot: { borderRadius: 999, backgroundColor: BRAND_PINK },
  pagination: { position: 'absolute', bottom: moderateScale(12), alignSelf: 'center', zIndex: 10, gap: scale(5) },

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
