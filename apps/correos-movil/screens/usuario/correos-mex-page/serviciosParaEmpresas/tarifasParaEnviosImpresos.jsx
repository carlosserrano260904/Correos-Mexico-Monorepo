import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TarifasParaEnviosImpresos() {
    const navigation = useNavigation();

  return (
     <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text>Cartas</Text>
        </View>

        {/* Imagen */}
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../../../assets/sticker.png')}
            style={styles.image}
          />
        </View>

        {/* Título de la pantalla */}
        <Text style={styles.title}>Tarifas para Envíos de Impresos</Text>
        <View style={styles.paragraph}>
          <Text style={styles.textCentered}>Envío masivo de productos y mercancías empaquetadas o tarjetas postales por todo México.</Text>
        </View>
        
        {/* Envío pequeño */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#a6294b', '#cf5777']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
          >
            <Text style={styles.headerText}>Envío Pequeño</Text>
          </LinearGradient>

          {/* Contenido principal */}
          <View style={styles.mainBox}>
            <View style={styles.priceContainer}>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Desde</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceFrom}>$9.76 MXN</Text>
                </View>
                
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Hasta</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceTo}>$29.10 MXN</Text>
                </View>
                
              </View>
            </View>
          </View>

          {/* Detalles */}
          <View style={styles.details}>
            <Text style={styles.bullet}>• De 50 a 250 piezas.</Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>Peso máximo:</Text> 2kg por pieza.
            </Text>
          </View>
        </View>

        {/* Envío mediano */}
        <View style={styles.card}>
           <LinearGradient
            colors={['#dec8a3', '#cfaa6c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
          >
            <Text style={styles.headerTextBlack}>Envío Mediano</Text>
          </LinearGradient>

          {/* Contenido principal */}
          <View style={styles.mainBox}>
            <View style={styles.priceContainer}>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Desde</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceFrom}>$8.06 MXN</Text>
                </View>
                
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Hasta</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceTo}>$19.74 MXN</Text>
                </View>
                
              </View>
            </View>
          </View>
          

          {/* Detalles */}
          <View style={styles.details}>
            <Text style={styles.bullet}>• De 251 a 5,000 piezas.</Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>Peso máximo:</Text> 2 kg por pieza.
            </Text>
          </View>
        </View>

        {/* Envío grande */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#79c237', '#68a432']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
          >
            <Text style={styles.headerText}>Envío Grande</Text>
          </LinearGradient>

          {/* Contenido principal */}
          <View style={styles.mainBox}>
            <View style={styles.priceContainer}>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Desde</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceFrom}>$3.72 MXN</Text>
                </View>
                
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.label}>Hasta</Text>

                <View style={styles.priceBoxContainer}>
                  <Text style={styles.priceTo}>$18.73 MXN</Text>
                </View>
                
              </View>
            </View>
          </View>
          

          {/* Detalles */}
          <View style={styles.details}>
            <Text style={styles.bullet}>• Más de 5,001 hasta 30,000 piezas.</Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>Peso máximo:</Text> 2 kg por pieza.
            </Text>
            <Text style={styles.bullet}>
                A partir de este envío se puede celebrar un contrato de
                <Text style={styles.bold}> Garantía de Volumen</Text> 
                , que permite mantener una tarifa para depósitos acumulados 
                mensualmente.
            </Text>
          </View>
        </View>
        <View style={styles.footSpace}></View>
      </ScrollView>
    </View>
    
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#000',
  },
  gradientHeader: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  forwardButton: {
    width: 40,              // tamaño del círculo
    height: 40,
    borderRadius: 20,       // mitad del ancho = círculo perfecto
    backgroundColor: '#de1484', // color del fondo
    alignItems: 'center',   // centrar horizontalmente
    justifyContent: 'center', // centrar verticalmente
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 56,
    marginBottom: 24,
    lineHeight: 40,
    textAlign: 'center',
  },
  cardsList: {
    paddingHorizontal: 24,
    paddingBottom: 48, // Espacio al final de la lista
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24, // Espacio entre tarjetas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden', // Para que la imagen no se salga de los bordes
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e5e7eb', // Placeholder color
    resizeMode: 'cover', 
  },
  cardContentWrapper: { // Contenedor para el contenido de texto y footer
    padding: 20,
    paddingBottom: 0, 
  },
  cardTextContainer: {
    marginBottom: 16, // Espacio entre la descripción y el footer
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  cardFooter: { // Footer de la tarjeta
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16, // Espacio entre la descripción y el footer
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6', 
    marginHorizontal: -20, 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moreInfoText: {
    fontSize: 14,
    color: '#ec4899', 
    fontWeight: '600',
  },
  cardArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: "90%",
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: 'hidden',
    marginLeft: 20,
    marginBottom: 40,
  },
  headerCard: {
    backgroundColor: '#c2185b',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerCardMediano: {
    backgroundColor: '#cfaa6d',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerCardGrande: {
    backgroundColor: '#69a632',
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  headerTextBlack: {
    color: '#000000ff',
    fontWeight: '700',
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    paddingVertical: 10,
    paddingHorizontal:10,
    margin:15,
    borderRadius: 8,
  },
  priceBox: {
    marginTop: 5,
    marginBottom: 10,
  },
  label: {
    color: '#000000ff',
    fontSize: 13,
    marginBottom: 3,
  },
  priceFrom: {
    color: '#2ecc71',
    fontWeight: '700',
    fontSize: 15,
    padding: 10,
  },
  priceTo: {
    color: '#e91e63',
    fontWeight: '700',
    fontSize: 15,
    padding: 10,
  },
  details: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 4,
  },
  bullet: {
    color: '#444',
    fontSize: 13,
    marginBottom: 3,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
    imageWrapper: 
  {
    alignItems: 'center', // centers the image horizontally
  },

  image: {
    width: 180,
    height: 180,
    marginVertical: 16,
  },
  priceBoxContainer:{
    backgroundColor: "white",
    borderRadius: 8,
  },
  mainBox:{

  },
  paragraph:{
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  textCentered:{
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footSpace:{
    marginBottom: 120,
  },

});
