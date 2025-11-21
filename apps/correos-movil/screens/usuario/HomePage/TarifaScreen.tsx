import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HeroAsset = require("../../../assets/verify.png");
const EnvelopeAsset = require("../../../assets/example.png");


const { width } = Dimensions.get("window");
const moderateScale = (size: number, factor = 0.5) => {
  return Math.round(size + (size * factor * (width / 375 - 1)));
};

const COLORS = {
  headerGreen: "#70b334",       
  textGreen: "#79C237",         
  primaryPink: "#DE1484",       
  textDark: "#111827",          
  textGray: "#6B7280",          
  bgPrice: "#F9FAFB",          
  borderColor: "#E5E7EB",       
  bgWhite: "#fff",
  gradientPinkStart: "#C01070", 
  gradientPinkEnd: "#DE1484",
};

export default function TarifasScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Navegación */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Respuesta a Promociones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* --- Hero Section --- */}
        <View style={styles.hero}>
          <Image
            source={HeroAsset}
            style={styles.heroIcon}
            resizeMode="contain"
          />
          
          <Text style={styles.heroTitle}>
            Tarifas para Respuestas a Promociones Comerciales
          </Text>

          <Text style={styles.heroSubtitle}>
            Conoce las opiniones y necesidades de tus clientes respecto a los servicios de tu empresa para mejorar <Text style={{fontWeight:'700'}}>tus servicios.</Text>
          </Text>

          <Text style={styles.pinkIntroText}>
            Correos de México te ofrece este servicio en dos modalidades:
          </Text>
        </View>

        {/* --- Sección 1 --- */}
        <View style={styles.sectionRow}>
          <View style={styles.circleNumber}>
            <Text style={styles.circleNumberText}>1</Text>
          </View>
          <View style={styles.sectionTextCol}>
            <Text style={styles.sectionTitle}>Con salida del SEPOMEX.</Text>
            <Text style={styles.sectionDesc}>
              Cuando el sobre o tarjeta para la respuesta se hace llegar al destinatario mediante los servicios de correspondencia o envíos.
            </Text>
          </View>
        </View>

        {/* --- Card: Envío Pequeño --- */}
        <View style={styles.envioCardContainer}>
          {/* Header con Gradiente (Estético) */}
          <LinearGradient
            colors={[COLORS.gradientPinkStart, COLORS.gradientPinkEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.envioHeader}
          >
            <Text style={styles.envioHeaderText}>Envío Pequeño</Text>
          </LinearGradient>

          {/* Precios */}
          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              {/* Caja blanca para precio */}
              <View style={styles.priceValueWrapper}>
                 <Text style={styles.envioPriceValueGreen}>$2.51 MXN</Text>
              </View>
            </View>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <View style={styles.priceValueWrapper}>
                <Text style={styles.envioPriceValuePink}>$2.42 MXN</Text>
              </View>
            </View>
          </View>

          {/* Info */}
          <View style={styles.envioInfoContainer}>
            <Text style={[styles.envioInfoText, { fontWeight: '700' }]}>Incluye IVA.</Text>
            
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>De 1 a 5000 piezas.</Text>
            </View>
            
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: "700" }}>Peso máximo:</Text> 20 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* --- Card: Envío Grande --- */}
        <View style={styles.envioCardContainer}>
          <View style={[styles.envioHeader, { backgroundColor: COLORS.headerGreen }]}>
            <Text style={styles.envioHeaderText}>Envío Grande</Text>
          </View>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
                <Text style={[styles.envioPriceLabel, { alignSelf:'flex-start', marginLeft: 12 }]}>Desde</Text>
                <View style={styles.priceValueWrapperWhite}>
                    <Text style={styles.envioPriceValueGreen}>$2.51 MXN</Text>
                </View>
            </View>
            <View style={styles.envioPriceColumn}>
                <Text style={[styles.envioPriceLabel, { alignSelf:'flex-start', marginLeft: 12 }]}>Hasta</Text>
                <View style={styles.priceValueWrapperWhite}>
                    <Text style={styles.envioPriceValuePink}>$2.42 MXN</Text>
                </View>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={[styles.envioInfoText, { fontWeight: '700' }]}>Incluye IVA.</Text>
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>A partir de más de 5,000 piezas.</Text>
            </View>
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: "700" }}>Peso máximo:</Text> 20 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* --- Sección 2 --- */}
        <View style={styles.sectionRow}>
          <View style={styles.circleNumber}>
            <Text style={styles.circleNumberText}>2</Text>
          </View>
          <View style={styles.sectionTextCol}>
            <Text style={styles.sectionTitle}>Sin salida del SEPOMEX.</Text>
            <Text style={styles.sectionDesc}>
              Cuando el sobre o tarjeta para la respuesta se hace llegar al destinatario por otros medios.
            </Text>
          </View>
        </View>

        {/* --- Card: Tarifa Única --- */}
        <View style={styles.envioCardContainer}>
          <LinearGradient
            colors={["#D01672", "#E33F94"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.envioHeader}
          >
            <Text style={styles.envioHeaderText}>Tarifa Única</Text>
          </LinearGradient>

          <View style={[styles.envioPricesBox, { paddingVertical: 20 }]}>
             <View style={styles.envioPriceColumn}>
                <Text style={[styles.envioPriceLabel, { alignSelf:'flex-start', marginLeft: 12 }]}>Desde</Text>
                <View style={[styles.priceValueWrapperWhite, { minWidth: 150 }]}>
                    <Text style={[styles.envioPriceValueGreen, { color: '#4A7C26' }]}>$17.40 MXN</Text>
                </View>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={[styles.envioInfoText, { fontWeight: '700' }]}>Incluye IVA.</Text>
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>Desde una pieza.</Text>
            </View>
            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: "700" }}>Peso máximo:</Text> 20 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* --- Dimensiones --- */}
        <View style={styles.dimensionsContainer}>
           <Text style={styles.dimMainTitle}>Dimensiones</Text>

           <Text style={styles.dimSubTitlePink}>Sobre</Text>
           <Text style={styles.dimText}>Largo: mínimo 114 mm / máximo 458 mm.</Text>
           <Text style={styles.dimText}>Ancho: mínimo 81 mm / máximo 324 mm.</Text>

           <Text style={[styles.dimSubTitlePink, { marginTop: 15 }]}>Tarjetas</Text>
           <Text style={styles.dimText}>Largo: mínimo 105 mm / máximo 148 mm.</Text>
           <Text style={styles.dimText}>Ancho: mínimo 90 mm / máximo 140 mm.</Text>
            
           <View style={styles.envelopeImageContainer}>
              <Image 
                source={EnvelopeAsset} 
                style={{ width: '100%', height: 100 }}
                resizeMode="contain"
              />
           </View>

           <Text style={[styles.dimSubTitlePink, { marginTop: 10 }]}>Empaque</Text>
           <Text style={styles.dimText}>Sobre o tarjeta de papel.</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  /* Header Nav */
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    height: moderateScale(56),
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  backBtn: { padding: 5 },
  backArrow: { fontSize: 24, fontWeight: "bold", color: COLORS.textDark },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: COLORS.textDark,
  },

  /* Hero */
  hero: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    marginBottom: 15
  },
  heroTitle: {
    fontSize: moderateScale(20),
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.textDark,
    marginBottom: 10,
    lineHeight: 26,
  },
  heroSubtitle: {
    fontSize: moderateScale(14),
    textAlign: "center",
    color: COLORS.textGray,
    lineHeight: 20,
    marginBottom: 15,
  },
  pinkIntroText: {
    color: COLORS.primaryPink,
    fontWeight: "700",
    textAlign: "center",
    fontSize: moderateScale(15),
    marginBottom: 10,
  },

  sectionRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  circleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryPink,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  circleNumberText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  sectionTextCol: { flex: 1 },
  sectionTitle: { fontWeight: "800", fontSize: moderateScale(15), color: COLORS.textDark, marginBottom: 2 },
  sectionDesc: { color: COLORS.textGray, fontSize: moderateScale(13), lineHeight: 18 },

  envioCardContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: moderateScale(16),
    backgroundColor: COLORS.bgWhite,
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
    paddingBottom: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    overflow: "hidden",
    shadowColor: "#000", 
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  envioHeader: {
    paddingVertical: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  envioHeaderText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: moderateScale(18),
  },

  envioPricesBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: moderateScale(16),
    backgroundColor: COLORS.bgPrice,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  envioPriceColumn: {
    alignItems: "center",
    width: '45%',
  },
  envioPriceLabel: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(4),
    color: COLORS.textGray,
  },

  envioPriceValueGreen: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: COLORS.textGreen,
  },
  envioPriceValuePink: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: COLORS.primaryPink,
  },

  priceValueWrapper: {
    backgroundColor: '#F3F5F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  priceValueWrapperWhite: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    minWidth: 110,
    alignItems: 'center',
  },


  envioInfoContainer: {
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(12),
  },
  envioInfoText: {
    fontSize: moderateScale(14),
    marginBottom: moderateScale(10),
    color: COLORS.textDark,
  },
  envioBullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: moderateScale(8),
  },
  envioBulletDot: {
    fontSize: moderateScale(16),
    marginRight: moderateScale(6),
    marginTop: moderateScale(2),
    color: COLORS.primaryPink,
  },
  envioBulletText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.textDark,
  },

  dimensionsContainer: {
      marginHorizontal: 20,
      marginTop: 20,
  },
  dimMainTitle: {
      fontSize: moderateScale(18),
      fontWeight: 'bold',
      color: COLORS.textDark,
      marginBottom: 10
  },
  dimSubTitlePink: {
      fontSize: moderateScale(15),
      fontWeight: '700',
      color: COLORS.primaryPink,
      marginBottom: 4
  },
  dimText: {
      fontSize: moderateScale(14),
      color: COLORS.textDark,
      marginBottom: 2
  },
  envelopeImageContainer: {
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 10,
      padding: 10,
      backgroundColor: '#FFF'
  }
});