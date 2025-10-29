import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, LayoutChangeEvent, ActivityIndicator, TextInput } from 'react-native'
import * as React from 'react'
import { moderateScale } from 'react-native-size-matters';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ShoppingBag, Headset, Heart, Search } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCategoryList from '../../../components/Products/ProductCategory';
import { RootStackParamList } from '../../../schemas/schemas';
import { useMyAuth } from '../../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const imageData = [
  { id: '1', name: 'Item 1', image: require('../../../assets/RegaloMama.png') },
  { id: '2', name: 'Item 2', image: require('../../../assets/publicidad1.png') },
  { id: '3', name: 'Item 3', image: require('../../../assets/publicidad3.png') },
];

const imageData2 = [
  { id: '1', name: 'Item 1', image: require('../../../assets/publicidad2.png') },
  { id: '2', name: 'Item 2', image: require('../../../assets/mensaje-correos-clic.png') },
  { id: '3', name: 'Item 3', image: require('../../../assets/publicidad-correos-clic.jpg') },
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CorreosClicButton = () => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const mouseAnim = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  const [buttonLayout, setButtonLayout] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (buttonLayout.width === 0 || buttonLayout.height === 0) return;

    const mouseSize = moderateScale(30);
    const startX = buttonLayout.x + buttonLayout.width - mouseSize;
    const startY = buttonLayout.y + buttonLayout.height - mouseSize;

    const centerX = buttonLayout.x + buttonLayout.width / 2 - mouseSize / 2;
    const centerY = buttonLayout.y + buttonLayout.height / 2 - mouseSize / 2;

    const startAnimation = () => {
      opacityAnim.setValue(0);
      mouseAnim.setValue({ x: startX, y: startY });
      scaleAnim.setValue(1);

      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(mouseAnim, {
          toValue: { x: centerX, y: centerY },
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(5000),
      ]).start(() => {
        startAnimation(); // loop
      });
    };

    startAnimation();
  }, [buttonLayout]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    setButtonLayout(layout);
  };
  const navigation = useNavigation();
  return (
    <View style={styles.correosClicButtonContainer}>
      <View onLayout={handleLayout}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.correosClicButton} activeOpacity={0.8} onPress={() => navigation.navigate('ProductsScreen')}>
            <Image
              style={styles.correosClicImage}
              source={require("../../../assets/icons_correos_mexico/correos_clic_regularLogo.png")}
            />
            <Text style={styles.correosClicText}>Correos Clic</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Animated.Image
        source={require("../../../assets/icons_correos_mexico/mouse_pixelart.png")}
        style={{
          position: "absolute",
          width: moderateScale(30),
          height: moderateScale(30),
          opacity: opacityAnim,
          transform: mouseAnim.getTranslateTransform(),
          zIndex: 10,
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default function HomeUser() {
  const { logout } = useMyAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState('');
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
        try {
        await logout();
        } catch (err) {
        console.error('Logout error:', JSON.stringify(err, null, 2));
        }
    };

  const categoriesData = [
    { name: 'Ropa, moda y calzado', image: require("../../../assets/icons_correos_mexico/ropaModaCalzado-icon.png") },
    { name: 'Joyería y bisuteria', image: require("../../../assets/icons_correos_mexico/joyeriaBisuteria-icon.png") },
    { name: 'Juegos y juguetes', image: require("../../../assets/icons_correos_mexico/juegosJuguetes-icon.png") },
    { name: 'Hogar y decoración', image: require("../../../assets/icons_correos_mexico/hogarDecoracion-icon.png") },
    { name: 'Belleza y cuidado personal', image: require("../../../assets/icons_correos_mexico/bellezaCuidadoPersonal-icon.png") },
    { name: 'Artesanías mexicanas', image: require("../../../assets/icons_correos_mexico/artesaniasMexicanas-icon.png") },
    { name: 'FONART', image: require("../../../assets/icons_correos_mexico/Fonart-icon.png") },
    { name: 'Original', image: require("../../../assets/icons_correos_mexico/Original-icon.png") },
    { name: 'Jóvenes construyendo el futuro', image: require("../../../assets/icons_correos_mexico/jovenesConstruyendoFuturo-icon.png") },
    { name: 'Hecho en Tamaulipas', image: require("../../../assets/icons_correos_mexico/hechoTamaulipas-icon.png") },
    { name: 'SEDECO Michoacán', image: require("../../../assets/icons_correos_mexico/sedecoMichoacan-icon.png") },
    { name: 'Filatelia mexicana', image: require("../../../assets/icons_correos_mexico/filateliaMexicana-icon.png") },
    { name: 'Sabores artesanales', image: require("../../../assets/icons_correos_mexico/saboresArtesanales-icon.png") },
  ];

  const navigation = useNavigation<NavigationProp>();

  const handleNavigateToProducts = (categoria: string) => {
    // Navega a la pantalla 'Productos' y pasa el parámetro 'categoria'
    navigation.navigate('ProductsScreen', { categoria, searchText: undefined });
  };

  const handleSearchSubmit = () => {
    const trimmedText = searchText.trim();
    if (trimmedText) {
      // Navega a la pantalla de productos pasando el texto de búsqueda
      navigation.navigate('ProductsScreen', { searchText: trimmedText, categoria: undefined });
      setSearchText(''); // Opcional: limpiar el buscador después de navegar
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null); // Limpiar errores previos al reintentar
          const response = await fetch(`${API_URL}/api/products/some`);
          if (!response.ok) {
            throw new Error('Error al obtener los productos');
          }
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }, [])
  );

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselRef = React.useRef<ScrollView>(null);
  const carousel2Ref = React.useRef<ScrollView>(null);

  // Auto scroll para el primer carrusel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % imageData.length;
        carouselRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderCarouselItem = (item: any, index: number) => (
    <View key={index} style={[styles.carouselItem, { width: screenWidth }]}>
      <Image source={item.image} style={styles.carouselImage} />
    </View>
  );

  const onPressPagination = (index: number) => {
    setCurrentIndex(index);
    carouselRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "white", width: screenWidth, position: "relative" }} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <View>
            <TouchableOpacity onPress={handleSignOut}>
              <Image style={styles.correosImage} source={require("../../../assets/icons_correos_mexico/correos_clic_Logo.png")} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconsHeaderContainer}>
            <TouchableOpacity style={styles.iconsHeader}>
              <Text style={styles.textLenguage}>ES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsHeader}
              onPress={() => navigation.navigate('Favorito')}
            >
              <Heart color={"#DE1484"} size={moderateScale(24)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconsHeader}
              onPress={() => navigation.navigate('Carrito')}
            >
              <ShoppingBag color={"#DE1484"} size={moderateScale(24)} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBarContainer}>
          <View style={styles.searchWrapper}>
            <Search color="#888" size={moderateScale(20)} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar un producto..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
        </View>

        <CorreosClicButton />

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
            onScrollEndDrag={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentIndex(newIndex);
            }}
          >
            {imageData.map((item, index) => renderCarouselItem(item, index))}
          </ScrollView>
          
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {imageData.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive,
                ]}
                onPress={() => onPressPagination(index)}
              />
            ))}
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.textCategories}>Categorías</Text>
          <ScrollView style={styles.modulesCategoriesContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
            {categoriesData.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modulesCategories}
                onPress={() => handleNavigateToProducts(category.name)}
                activeOpacity={0.7}
              >
                <Image style={styles.categoriesImage} source={category.image} />
                <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.vendedorContainer}>
          <View style={styles.textVendedorContainer}>
            <Text style={styles.textTitleVendedor}>Vendedor destacado de la semana:</Text>
            <Text style={styles.textVendedor}>Raul Perez Artesanal</Text>
          </View>

          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#DE1484" />
            ) : error ? (
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            ) : (
              <ProductCategoryList products={products} categoria={'Ropa, moda y calzado'} />
            )}
          </View>
        </View>

        <View style={styles.vendedorFonartContainer}>
          <View style={styles.textVendedorFonartContainer}>
            <Text style={styles.textVendedorFonart}>Vendedor destacado FONART</Text>
            <TouchableOpacity onPress={() => handleNavigateToProducts('FONART')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#DE1484" />
            ) : error ? (
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            ) : (
              <ProductCategoryList products={products} categoria={'FONART'} />
            )}
          </View>
        </View>

        <View style={styles.carouselContainer}>
          <ScrollView
            ref={carousel2Ref}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {imageData2.map((item, index) => renderCarouselItem(item, index))}
          </ScrollView>
          
          {/* Pagination dots */}
          <View style={styles.pagination}>
            {imageData2.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === 0 && styles.paginationDotActive, // Por defecto el primero
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.featuredProductContainer}>
          <View style={styles.textFeaturedProductContainer}>
            <Text style={styles.textFeaturedProduct}>Productos destacados</Text>
            <TouchableOpacity onPress={() => handleNavigateToProducts('Productos destacados')}>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#DE1484" />
            ) : error ? (
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            ) : (
              <ProductCategoryList products={products} categoria={'Productos destacados'} />
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('ChatBot')} style={styles.customerServiceContainer}>
        <Headset color={"#fff"} size={moderateScale(24)} />
      </TouchableOpacity>
    </>
  )
  
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(12)
  },
  correosImage: {
    width: moderateScale(56),
    height: moderateScale(52)
  },
  iconsHeaderContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconsHeader: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(12)
  },
  textLenguage: {
    fontWeight: 700,
    fontSize: moderateScale(16),
  },
  searchBarContainer: {
    marginTop: moderateScale(20),
    paddingHorizontal: moderateScale(12)
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: moderateScale(50),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#121212',
    paddingVertical: 0,
  },
  correosClicButtonContainer: {
    marginVertical: moderateScale(20),
    paddingHorizontal: moderateScale(12),
  },
  correosClicButton: {
    backgroundColor: "#fce4f1",
    width: "100%",
    height: moderateScale(80),
    borderRadius: moderateScale(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DE1484"
  },
  correosClicImage: {
    width: moderateScale(52),
    height: moderateScale(48),
    marginRight: moderateScale(12)
  },
  correosClicText: {
    fontWeight: 700,
    fontSize: moderateScale(24),
    color: "#121212"
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: moderateScale(8)
  },
  categoriesContainer: {
    marginVertical: moderateScale(20),
    flexDirection: "column",
  },
  textCategories: {
    paddingLeft: moderateScale(12),
    fontWeight: 700,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(12)
  },
  modulesCategoriesContainer: {
    paddingHorizontal: moderateScale(12),
  },
  categoriesImage: {
    width: moderateScale(72),
    height: moderateScale(72),
    backgroundColor: "#F3F4F6",
    borderRadius: 100,
    resizeMode: "contain"
  },
  modulesCategories: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: moderateScale(72),
    marginRight: moderateScale(32),
  },
  modulesCategoriesText: {
    fontWeight: 400,
    fontSize: moderateScale(12),
    textAlign: "center",
    marginTop: moderateScale(4)
  },
  vendedorContainer: {
    marginHorizontal: moderateScale(12),
    flexDirection: "column",
    marginBottom: moderateScale(20),
  },
  textVendedorContainer: {
    flexDirection: "column"
  },
  textVendedor: {
    fontWeight: 700,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(12)
  },
  textTitleVendedor: {
    fontWeight: 700,
    fontSize: moderateScale(16),
    marginBottom: moderateScale(4)
  },
  vendedorFonartContainer: {
    flexDirection: "column",
    marginHorizontal: moderateScale(12),
    marginBottom: moderateScale(20)
  },
  textVendedorFonartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12)
  },
  textVendedorFonart: {
    fontWeight: 700,
    fontSize: moderateScale(16),
  },
  seeAll: {
    fontSize: moderateScale(14),
    fontWeight: 400,
    color: "#DE1484"
  },
  featuredProductContainer: {
    marginHorizontal: moderateScale(12),
    marginTop: moderateScale(20),
    flexDirection: "column",
    marginBottom: moderateScale(120),
  },
  textFeaturedProductContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12)
  },
  textFeaturedProduct: {
    fontWeight: 700,
    fontSize: moderateScale(16),
  },
  customerServiceContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    backgroundColor: "#DE1484",
    position: "absolute",
    bottom: moderateScale(100),
    right: moderateScale(16),
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  // Estilos para el carrusel personalizado
  carouselContainer: {
    marginVertical: moderateScale(10),
  },
  carousel: {
    height: screenHeight * 0.22,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.22,
  },
  //Ajustar margen del carrusel
  carouselImage: {
    width: '90%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    overflow: 'hidden',
},
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(10),
  },
  paginationDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#D9D9D9',
    marginHorizontal: moderateScale(2.5),
  },
  paginationDotActive: {
    backgroundColor: '#DE1484',
  },
});
