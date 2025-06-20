import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, LayoutChangeEvent, Button } from 'react-native'
import * as React from 'react'
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { moderateScale } from 'react-native-size-matters';
import SearchBarComponent from '../../../components/SearchBar/SearchBarComponent';
import { useNavigation } from '@react-navigation/native';
import { ShoppingBag, Headset, Heart, Home } from 'lucide-react-native';
import HomeTabs from '../../../components/Tabs/HomeTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas'; 

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

  const navigation = useNavigation<NavigationProp>();

  const progress = useSharedValue<number>(0);

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer, { backgroundColor: item }]}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };



  return (
    <View >
      <ScrollView style={{ backgroundColor: "white", width: screenWidth, position: "relative" }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerContainer}>

          <View>
            <Image style={styles.correosImage} source={require("../../../assets/icons_correos_mexico/correos_clic_Logo.png")} />
          </View>

          <View style={styles.iconsHeaderContainer}>
            <TouchableOpacity style={styles.iconsHeader}>
              <Text style={styles.textLenguage}>ES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsHeader}>
              <Heart color={"#DE1484"} size={moderateScale(24)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsHeader}>
              <ShoppingBag color={"#DE1484"} size={moderateScale(24)} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.searchBarContainer}>
          <SearchBarComponent />
        </View>

        <CorreosClicButton />

        <View id="carousel-component" dataSet={{ kind: "basic-layouts", name: "parallax" }}>
          <Carousel
            autoPlayInterval={5000}
            autoPlay={true}
            data={imageData}
            height={screenHeight * 0.22}
            loop={true}
            pagingEnabled={true}
            snapEnabled={true}
            width={screenWidth}
            style={{
              width: screenWidth,
            }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={progress}
            renderItem={renderItem}
          />

          <Pagination.Basic<{ color: string }>
            progress={progress}
            data={imageData.map((image) => ({ image }))}
            size={moderateScale(8)}
            dotStyle={{
              borderRadius: 100,
              backgroundColor: "#D9D9D9",
            }}
            activeDotStyle={{
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: "#DE1484",
            }}
            containerStyle={{
              gap: moderateScale(5),
            }}
            horizontal
            onPress={onPressPagination}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.textCategories}>Categorias</Text>
          <ScrollView style={styles.modulesCategoriesContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/ropaModaCalzado-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Ropa, moda y calzado</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/joyeriaBisuteria-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Joyería y bisuteria</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/juegosJuguetes-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Juegos y juguetes</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/hogarDecoracion-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Hogar y decoración</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/bellezaCuidadoPersonal-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Belleza y cuidado personal</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/artesaniasMexicanas-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Artesanías mexicanas</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/Fonart-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>FONART</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/Original-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Original</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/jovenesConstruyendoFuturo-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Jóvenes construyendo el futuro</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/hechoTamaulipas-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Hecho en Tamaulipas</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/sedecoMichoacan-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>SEDECO Michoacán</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/filateliaMexicana-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Filatelia mexicana</Text>
            </View>

            <View style={styles.modulesCategories}>
              <Image style={styles.categoriesImage} source={require("../../../assets/icons_correos_mexico/saboresArtesanales-icon.png")} />
              <Text style={styles.modulesCategoriesText} numberOfLines={4} ellipsizeMode='tail'>Sabores artesanales</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.vendedorContainer}>
          <View style={styles.textVendedorContainer}>
            <Text style={styles.textTitleVendedor}>Vendedor destacado de la semana:</Text>
            <Text style={styles.textVendedor}>Raul Perez Artesanal</Text>
          </View>

          <View>
            <Text>Aqui van los productos</Text>
          </View>
        </View>

        <View style={styles.vendedorFonartContainer}>
          <View style={styles.textVendedorFonartContainer}>
            <Text style={styles.textVendedorFonart}>Vendedor destacado FONART</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text>Aqui van los productos</Text>
          </View>
        </View>

        <View id="carousel-component" dataSet={{ kind: "basic-layouts", name: "parallax" }}>
          <Carousel
            autoPlayInterval={5000}
            autoPlay={true}
            data={imageData2}
            height={screenHeight * 0.22}
            loop={true}
            pagingEnabled={true}
            snapEnabled={true}
            width={screenWidth}
            style={{
              width: screenWidth,
            }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={progress}
            renderItem={renderItem}
          />

          <Pagination.Basic<{ color: string }>
            progress={progress}
            data={imageData.map((image) => ({ image }))}
            size={moderateScale(8)}
            dotStyle={{
              borderRadius: 100,
              backgroundColor: "#D9D9D9",
            }}
            activeDotStyle={{
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: "#DE1484",
            }}
            containerStyle={{
              gap: moderateScale(5),
            }}
            horizontal
            onPress={onPressPagination}
          />
        </View>

        <View style={styles.featuredProductContainer}>
          <View style={styles.textFeaturedProductContainer}>
            <Text style={styles.textFeaturedProduct}>Productos destacados</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todo</Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text>Aqui van los productos</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => navigation.navigate('DistributorPage')} style={styles.customerServiceContainer}>
        <Headset color={"#fff"} size={moderateScale(24)} />
      </TouchableOpacity>

    </View >
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateScale(40),
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
    bottom: moderateScale(128),
    right: moderateScale(12),
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },

});