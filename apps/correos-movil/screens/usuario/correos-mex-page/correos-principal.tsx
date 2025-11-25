import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, LayoutChangeEvent, ActivityIndicator, TextInput, Modal } from 'react-native'
import * as React from 'react'
import { moderateScale } from 'react-native-size-matters';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ShoppingBag, Headset, Heart, Search, ArrowLeft } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCategoryList from '../../../components/Products/ProductCategory';
import { RootStackParamList } from '../../../schemas/schemas';
import { useMyAuth } from '../../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const imageData = [
  { 
    id: '1', 
    name: 'Enviar Paquetes', 
    image: require('../../../assets/enviarPaquetes.png'),
    screen: 'ComoEnviar'
  },
  { 
    id: '2', 
    name: 'Item 2', 
    image: require('../../../assets/tramites.png'),
    screen: 'AtencionClientePrincipal'
  },
  { 
    id: '3', 
    name: 'Item 3', 
    image: require('../../../assets/reclamaciones.png') 
  },
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
  
  // Estado para el modal de notificaciones
  const [notificationsModalVisible, setNotificationsModalVisible] = React.useState(false);

  const handleSignOut = async () => {
        try {
        await logout();
        } catch (err) {
        console.error('Logout error:', JSON.stringify(err, null, 2));
        }
    };

  // categoriesData modificado para incluir pantallas específicas
  const categoriesData = [
    { 
      name: 'Cotizar un envio', 
      image: require("../../../assets/icons_correos_mexico/cotizarEnvio-icon.png"),
      screen: 'TarificadorNacional'
    },
    { 
      name: 'MEXPOST', 
      image: require("../../../assets/icons_correos_mexico/mexpost-icon.png"),
      screen: 'Mexpost'
    },
    { 
      name: 'Servicios para empresas', 
      image: require("../../../assets/icons_correos_mexico/serviciosEmpresas-icon.png"),
      screen: 'ServiciosEmpresas'
    },
    { 
      name: 'Envios internacionales', 
      image: require("../../../assets/icons_correos_mexico/enviosInternacionales-icon.png"),
      screen: 'EnviosInternacionales'
    },
  ];

  const navigation = useNavigation<NavigationProp>();

  // Función para manejar la navegación de cada categoría
  const handleNavigateToCategory = (category: any) => {
    if (category.screen) {
      navigation.navigate(category.screen as never);
    }
  };

  const handleNavigateToProducts = (categoria: string) => {
    navigation.navigate('ProductsScreen', { categoria, searchText: undefined });
  };

  const handleSearchSubmit = () => {
    const trimmedText = searchText.trim();
    if (trimmedText) {
      navigation.navigate('ProductsScreen', { searchText: trimmedText, categoria: undefined });
      setSearchText('');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError(null);
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

  // Función para manejar la navegación del carrusel
  const handleCarouselItemPress = (item: any) => {
    if (item.screen === 'ComoEnviar') {
      navigation.navigate('ComoEnviar' as never);
    }
  };

  const renderCarouselItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.carouselItem, { width: screenWidth }]}
      onPress={() => handleCarouselItemPress(item)}
      activeOpacity={0.8}
    >
      <Image source={item.image} style={styles.carouselImage} />
    </TouchableOpacity>
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
        <View style={[styles.headerPinkContainer, { paddingTop: insets.top + moderateScale(8) }]}>
          <Text style={styles.headerTitle}>Correos de México</Text>

          <View style={styles.trackingSection}>
            <View style={styles.trackingLeft}>
              <Image
                source={require("../../../assets/icons_correos_mexico/correos_clic_Logo.png")}
                style={styles.trackingLogo}
              />
              <Text style={styles.trackingText}>Seguimiento de envío</Text>
            </View>

            <TouchableOpacity 
              style={styles.trackingBell}
              onPress={() => setNotificationsModalVisible(true)}
            >
              <Image
                source={require("../../../assets/icons_correos_mexico/bell-icon.png")}
                style={{ width: moderateScale(20), height: moderateScale(20), tintColor: "#fff" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.trackingInputContainer}>
            <TextInput
              placeholder="Ingresa tu número de guía..."
              placeholderTextColor="#fff9"
              style={styles.trackingInput}
            />
          </View>
        </View>

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

        {/* Sección de Cotizaciones con navegación específica */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.textCategories}>Cotizaciones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: moderateScale(16) }}>
            {categoriesData.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modulesCategories}
                onPress={() => handleNavigateToCategory(category)}
                activeOpacity={0.7}
              >
                <View style={styles.circleContainer}>
                  <Image style={styles.categoriesImage} source={category.image} />
                </View>
                <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Nuestros Servicios */}
        <View style={styles.ourServicesSection}>
          <Text style={styles.ourServicesTitle}>Nuestros Servicios</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollContent}
          >
            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>Correspondencia</Text>
              <Text style={styles.serviceDescription}>
                Envío masivo de cartas, documentos o tarjetas postales por todo México y el mundo.
              </Text>
              <TouchableOpacity style={styles.moreInfoButton}>
                <Text style={styles.moreInfoText}>Más información</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.serviceCard}>
              <Text style={styles.serviceName}>Paquetería</Text>
              <Text style={styles.serviceDescription}>
                Envío masivo de productos y me empaquetadas toda la República Mexicana.
              </Text>
              <TouchableOpacity style={styles.moreInfoButton}>
                <Text style={styles.moreInfoText}>Más información</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <Text style={styles.locationTitle}>Ubicaciones y Horarios</Text>
        <View style={styles.locationContainer}>
          <View style={styles.selectGroup}>
            <Text style={styles.selectLabel}>Estado</Text>
            <TouchableOpacity style={styles.selectBox}>
              <Text style={styles.selectPlaceholder}>Selecciona tu estado</Text>
              <Image
                source={require("../../../assets/icons_correos_mexico/arrow-down.png")}
                style={styles.selectArrow}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.selectGroup}>
            <Text style={styles.selectLabel}>Municipio</Text>
            <TouchableOpacity style={styles.selectBox}>
              <Text style={styles.selectPlaceholder}>Selecciona tu municipio</Text>
              <Image
                source={require("../../../assets/icons_correos_mexico/arrow-down.png")}
                style={styles.selectArrow}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Search color="#fff" size={moderateScale(18)} />
            <Text style={styles.searchButtonText}>Buscar oficinas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Notificaciones */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={notificationsModalVisible}
        onRequestClose={() => setNotificationsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setNotificationsModalVisible(false)}
            >
              <ArrowLeft color="#121212" size={moderateScale(24)} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Notificaciones</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.modalContent}>
            <Image
              source={require("../../../assets/icons_correos_mexico/bell-icon.png")}
              style={styles.emptyNotificationsImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyNotificationsTitle}>No tienes notificaciones</Text>
            <Text style={styles.emptyNotificationsText}>
              Aquí aparecerán tus alertas y actualizaciones importantes
            </Text>
          </View>
        </View>
      </Modal>

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
    width: '90%',
    alignSelf: 'center',
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
    width: "10%",
    height: "10%",
    resizeMode: "cover",
    borderRadius: moderateScale(8)
  },
  categoriesContainer: {
    marginVertical: moderateScale(20),
    flexDirection: "column",
    width: '90%',
    alignSelf: 'center',
  },
  textCategories: {
    fontWeight: 700,
    fontSize: moderateScale(20),
    marginBottom: moderateScale(12)
  },
modulesCategories: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: moderateScale(80), 
    marginRight: moderateScale(20),
},
circleContainer: {
    width: moderateScale(72),
    height: moderateScale(72),
    backgroundColor: "#F3F4F6",
    borderRadius: moderateScale(36), 
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(8),
    padding: moderateScale(8), 
},
categoriesImage: {
    width: '100%', 
    height: '100%',
    resizeMode: "contain", 
},
modulesCategoriesText: {
    fontWeight: 400,
    fontSize: moderateScale(12),
    textAlign: "center",
    marginTop: moderateScale(4),
    lineHeight: moderateScale(14), 
},
  vendedorContainer: {
    flexDirection: "column",
    marginBottom: moderateScale(20),
    width: '90%',
    alignSelf: 'center',
  },
  textVendedorContainer: {
    flexDirection: "column"
  },
  textVendedor: {
    fontWeight: 700,
    fontSize: moderateScale(16),
    marginBottom: moderateScale(12)
  },
  textTitleVendedor: {
    fontWeight: 700,
    fontSize: moderateScale(16),
    marginBottom: moderateScale(4)
  },
  vendedorFonartContainer: {
  flexDirection: "column",
  marginBottom: moderateScale(20),
  width: '90%',
  alignSelf: 'center',
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
  carouselContainer: {
    marginVertical: moderateScale(10),
    marginTop: moderateScale(24),
  },
  carousel: {
    height: screenHeight * 0.22,
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight * 0.22,
  },
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

  headerPinkContainer: {
  backgroundColor: "#DE1484",
  borderBottomLeftRadius: moderateScale(32),
  borderBottomRightRadius: moderateScale(32),
  paddingHorizontal: moderateScale(16),
  paddingBottom: moderateScale(24),
},

headerTitle: {
  fontSize: moderateScale(26),
  fontWeight: "800",
  color: "#fff",
  textAlign: "center",
  marginBottom: moderateScale(16),
},

trackingSection: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: moderateScale(12),
  paddingHorizontal: moderateScale(12),
  paddingVertical: moderateScale(10),
  marginBottom: moderateScale(14),
},

trackingLeft: {
  flexDirection: "row",
  alignItems: "center",
},

trackingLogo: {
  width: moderateScale(28),
  height: moderateScale(28),
  marginRight: moderateScale(8),
  tintColor: "#fff",
},

trackingText: {
  fontSize: moderateScale(16),
  fontWeight: "600",
  color: "#fff",
  marginLeft: moderateScale(45),
},

trackingBell: {
  backgroundColor: "rgba(255,255,255,0.15)",
  width: moderateScale(32),
  height: moderateScale(32),
  borderRadius: moderateScale(16),
  alignItems: "center",
  justifyContent: "center",
},

trackingInputContainer: {
  backgroundColor: "rgba(255,255,255,0.15)",
  borderRadius: moderateScale(16),
  paddingHorizontal: moderateScale(14),
  height: moderateScale(44),
  justifyContent: "center",
},

trackingInput: {
  color: "#fff",
  fontSize: moderateScale(15),
},

locationContainer: {
  width: "90%",
  alignSelf: "center",
  backgroundColor: "#faf8f8ff",
  borderRadius: moderateScale(16),
  padding: moderateScale(16),
  marginBottom: moderateScale(150),
  marginTop: moderateScale(6), 
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 3, height: 3 },
  shadowRadius: 2,
  elevation: 2,
},

locationTitle: {
  width: "90%",
  alignSelf: "center",
  fontWeight: "800",
  fontSize: moderateScale(18),
  marginBottom: moderateScale(12),
  marginTop: moderateScale(20),
  color: "#121212",
},

selectGroup: {
  marginBottom: moderateScale(14),
},
selectLabel: {
  fontWeight: "600",
  fontSize: moderateScale(14),
  marginBottom: moderateScale(6),
  color: "#121212",
},
selectBox: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: moderateScale(12),
  height: moderateScale(48),
  paddingHorizontal: moderateScale(14),
  backgroundColor: "#F9FAFB",
},
selectPlaceholder: {
  color: "#9CA3AF",
  fontSize: moderateScale(14),
},
selectArrow: {
  width: moderateScale(14),
  height: moderateScale(14),
  tintColor: "#9CA3AF",
},
searchButton: {
  backgroundColor: "#DE1484",
  borderRadius: moderateScale(30),
  height: moderateScale(48),
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  marginTop: moderateScale(6),
},
searchButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: moderateScale(15),
  marginLeft: moderateScale(6),
},
ourServicesSection: {
  marginVertical: moderateScale(20),
  width: '100%',
},
ourServicesTitle: {
  fontSize: moderateScale(20),
  fontWeight: '700',
  color: '#121212',
  marginBottom: moderateScale(16),
  paddingHorizontal: moderateScale(16),
},
servicesScrollContent: {
  paddingHorizontal: moderateScale(16),
  paddingRight: moderateScale(16),
},
serviceCard: {
  backgroundColor: '#fefafaff',
  borderRadius: moderateScale(12),
  padding: moderateScale(20),
  marginRight: moderateScale(16),
  width: moderateScale(188), 
  minHeight: moderateScale(160),
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
serviceName: {
  fontSize: moderateScale(18),
  fontWeight: '500',
  color: '#121212',
  marginBottom: moderateScale(12),
},
serviceDescription: {
  fontSize: moderateScale(14),
  fontWeight: '400',
  color: '#666',
  lineHeight: moderateScale(20),
  marginBottom: moderateScale(16),
  flex: 1,
},
moreInfoButton: {
  alignSelf: 'flex-start',
},
moreInfoText: {
  fontSize: moderateScale(14),
  fontWeight: '600',
  color: '#DE1484',
},
modalContainer: {
  flex: 1,
  backgroundColor: '#fff',
},
modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: moderateScale(16),
  paddingVertical: moderateScale(12),
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
  marginTop: moderateScale(40),
},
backButton: {
  padding: moderateScale(8),
},
modalTitle: {
  fontSize: moderateScale(18),
  fontWeight: '600',
  color: '#121212',
  textAlign: 'center',
},
placeholder: {
  width: moderateScale(40),
},
modalContent: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: moderateScale(40),
},
emptyNotificationsImage: {
  width: moderateScale(120),
  height: moderateScale(120),
  marginBottom: moderateScale(24),
  opacity: 0.7,
},
emptyNotificationsTitle: {
  fontSize: moderateScale(20),
  fontWeight: '600',
  color: '#121212',
  textAlign: 'center',
  marginBottom: moderateScale(8),
},
emptyNotificationsText: {
  fontSize: moderateScale(14),
  fontWeight: '400',
  color: '#666',
  textAlign: 'center',
  lineHeight: moderateScale(20),
},
});