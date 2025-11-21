import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

export default function PropagandaComercial() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView>

        

        {/* SECCIÓN SUPERIOR — PROPAGANDA COMERCIAL */}
        <View style={styles.topContainer}>
          <Image
            source={require('../../../assets/propaganda-comercial.png')}
            style={styles.topImage}
            resizeMode="contain"
          />

          <Text style={styles.topTitle}>
            Tarifas para Envíos{"\n"}de Propaganda{"\n"}Comercial
          </Text>

          <Text style={styles.topDescription}>
            Envía folletos, boletines informativos, invitaciones, catálogos, entre otros
            impresos publicitarios para hacer crecer tu negocio.
          </Text>

          <Text style={styles.topSubtitlePink}>
            Correos de México te ofrece este servicio en dos modalidades:
          </Text>
        </View>

        {/* INCISO 1 */}
        <View style={styles.incisoContainer}>
          <View style={styles.incisoCircle}>
            <Text style={styles.incisoNumber}>1</Text>
          </View>

          <View style={styles.incisoTextContainer}>
            <Text style={styles.incisoTitle}>Con destinatario expreso.</Text>
            <Text style={styles.incisoDescription}>
              La entrega se realiza a un destinatario.
            </Text>
          </View>
        </View>

        {/* ======== ENVÍO PEQUEÑO ======== */}
        <View style={styles.envioCardContainer}>
          <LinearGradient
            colors={['#a5284a', '#cf5677']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.envioHeader}
          >
            <Text style={styles.envioHeaderText}>Envío Pequeño</Text>
          </LinearGradient>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$2.04 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$5.38 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>De 500 a 1,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== ENVÍO MEDIANO ======== */}
        <View style={styles.envioCardContainer}>
          <LinearGradient
            colors={['#ddc7a2', '#cda86b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.envioHeader}
          >
            <Text style={[styles.envioHeaderText, { color: '#000' }]}>Envío Mediano</Text>
          </LinearGradient>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$1.94 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$5.09 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>De 1,001 a 50,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== ENVÍO GRANDE ======== */}
        <View style={styles.envioCardContainer}>
          <View style={styles.envioHeader}>
            <Text style={styles.envioHeaderText}>Envío Grande</Text>
          </View>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$1.82 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$4.81 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>Desde 50,001 hasta 50,000 piezas.</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                A partir de este envío se puede celebrar un contrato de{' '}
                <Text style={{ fontWeight: '700' }}>Garantía de Volumen</Text>.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== JUMBO ======== */}
        <View style={styles.envioCardContainer}>
          <View style={[styles.envioHeader, { backgroundColor: '#DE1484' }]}>
            <Text style={[styles.envioHeaderText, { color: '#fff' }]}>Jumbo</Text>
          </View>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$1.62 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$4.52 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>A partir de 500,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos la pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* INCISO 2 */}
        <View style={styles.incisoContainer}>
          <View style={styles.incisoCircle}>
            <Text style={styles.incisoNumber}>2</Text>
          </View>

          <View style={styles.incisoTextContainer}>
            <Text style={styles.incisoTitle}>Sin destinatario expreso.</Text>
            <Text style={styles.incisoDescription}>
              La entrega se realiza en una zona determinada y no va dirigido a ningún destinatario en específico. Se distribuye a domicilio o en cajas de apartado.
            </Text>
          </View>
        </View>

        {/* ======== ENVÍO PEQUEÑO ======== */}
        <View style={styles.envioCardContainer}>
          <LinearGradient
            colors={['#a5284a', '#cf5677']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.envioHeader}
          >
            <Text style={styles.envioHeaderText}>Envío Pequeño</Text>
          </LinearGradient>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$0.81 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$2.20 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>De 500 a 1,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== ENVÍO MEDIANO ======== */}
        <View style={styles.envioCardContainer}>
          <LinearGradient
            colors={['#ddc7a2', '#cda86b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.envioHeader}
          >
            <Text style={[styles.envioHeaderText, { color: '#000' }]}>Envío Mediano</Text>
          </LinearGradient>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$0.73 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$1.88 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>De 1,001 a 50,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== ENVÍO GRANDE ======== */}
        <View style={styles.envioCardContainer}>
          <View style={styles.envioHeader}>
            <Text style={styles.envioHeaderText}>Envío Grande</Text>
          </View>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$0.63 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$1.62 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>Desde 50,001 hasta 50,000 piezas.</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos por pieza.
              </Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                A partir de este envío se puede celebrar un contrato de{' '}
                <Text style={{ fontWeight: '700' }}>Garantía de Volumen</Text>, que permite mantener una tarifa para depósityos acumulados mensualmente.
              </Text>
            </View>
          </View>
        </View>

        {/* ======== JUMBO ======== */}
        <View style={styles.envioCardContainer}>
          <View style={[styles.envioHeader, { backgroundColor: '#DE1484' }]}>
            <Text style={[styles.envioHeaderText, { color: '#fff' }]}>Jumbo</Text>
          </View>

          <View style={styles.envioPricesBox}>
            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Desde</Text>
              <Text style={styles.envioPriceValueGreen}>$0.51 MXN</Text>
            </View>

            <View style={styles.envioPriceColumn}>
              <Text style={styles.envioPriceLabel}>Hasta</Text>
              <Text style={styles.envioPriceValuePink}>$1.33 MXN</Text>
            </View>
          </View>

          <View style={styles.envioInfoContainer}>
            <Text style={styles.envioInfoText}>Incluye IVA.</Text>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>A partir de 500,000 piezas</Text>
            </View>

            <View style={styles.envioBullet}>
              <Text style={styles.envioBulletDot}>•</Text>
              <Text style={styles.envioBulletText}>
                <Text style={{ fontWeight: '700' }}>Peso máximo:</Text> 300 gramos la pieza.
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  topContainer: {
  width: "90%",
  alignSelf: "center",
  marginTop: moderateScale(20),
  marginBottom: moderateScale(20),
  alignItems: "center",
},

topImage: {
  width: moderateScale(110),
  height: moderateScale(110),
  marginBottom: moderateScale(10),
},

topTitle: {
  fontSize: moderateScale(20),
  fontWeight: "700",
  color: "#000",
  textAlign: "center",
  lineHeight: moderateScale(28),
  marginBottom: moderateScale(10),
},

topDescription: {
  fontSize: moderateScale(14),
  color: "#6B7280",
  textAlign: "center",
  marginBottom: moderateScale(16),
  lineHeight: moderateScale(20),
},

topSubtitlePink: {
  fontSize: moderateScale(15),
  fontWeight: "700",
  color: "#DE1484",
  textAlign: "center",
  marginTop: moderateScale(5),
},




  envioCardContainer: {
  width: "90%",
  alignSelf: "center",
  borderRadius: moderateScale(16),
  backgroundColor: "#fff",
  marginTop: moderateScale(20),
  marginBottom: moderateScale(20),
  paddingBottom: moderateScale(16),
  borderWidth: 1,
  borderColor: "#E5E7EB",
  overflow: "hidden",
},
envioHeader: {
  backgroundColor: "#70b334",
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
  backgroundColor: "#F9FAFB",
},
envioPriceColumn: {
  alignItems: "center",
},
envioPriceLabel: {
  fontSize: moderateScale(14),
  marginBottom: moderateScale(4),
  color: "#6B7280",
},
envioPriceValueGreen: {
  fontSize: moderateScale(18),
  fontWeight: "700",
  color: "#79C237",
},
envioPriceValuePink: {
  fontSize: moderateScale(18),
  fontWeight: "700",
  color: "#DE1484",
},
envioInfoContainer: {
  paddingHorizontal: moderateScale(16),
  marginTop: moderateScale(12),
},
envioInfoText: {
  fontSize: moderateScale(14),
  marginBottom: moderateScale(10),
  color: "#111827",
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
  color: "#DE1484",
},
envioBulletText: {
  flex: 1,
  fontSize: moderateScale(14),
  color: "#111827",
},
incisoContainer: {
  flexDirection: "row",
  alignItems: "flex-start",   // ← IMPORTANTE
  width: "90%",
  alignSelf: "center",
  marginTop: moderateScale(15),
  marginBottom: moderateScale(10),
},

incisoCircle: {
  width: moderateScale(34),
  height: moderateScale(34),
  borderRadius: moderateScale(34),
  backgroundColor: "#DE1484",
  justifyContent: "center",
  alignItems: "center",
  marginRight: moderateScale(10),
},

incisoNumber: {
  color: "#fff",
  fontWeight: "700",
  fontSize: moderateScale(14),
},

incisoTextContainer: {
  flex: 1,
  justifyContent: "center",   // ← HACE QUE EL TÍTULO QUEDE ALINEADO
},

incisoTitle: {
  fontSize: moderateScale(15),
  fontWeight: "700",
  color: "#111827",
},

incisoDescription: {
  fontSize: moderateScale(13),
  color: "#6B7280",
  marginTop: moderateScale(2),
},
});

