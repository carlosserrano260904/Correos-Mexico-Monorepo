import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ServiciosParaEmpresas() {
  const navigation = useNavigation();

  const cardData = [
    {
      title: 'Correspondencia',
      description: 'Pasos a seguir para envíar correspondencia.',
      imageUrl: require('../../../../assets/paquetes1.jpg'),
      link: 'tarifasParaEnviosDeCartas',
    },
    {
      title: 'Paquetería',
      description: 'Envío masivo de productos y mercancías.',
      imageUrl: require('../../../../assets/paquetes2.jpg'),
      link: 'tarifasParaEnviosDePaquetes',
    },
    {
      title: 'Impresos',
      description: 'Incrementa la difusión de tus servicios con nuestros recursos de impresión.',
      imageUrl: require('../../../../assets/impresos.jpg'),
      link: 'tarifasParaEnviosImpresos',
    },
    {
      title: 'Publicaciones periódicas',
      description: 'Incrementa la difusión de tu revista o periódico llegando a nuevos sectores.',
      imageUrl: require('../../../../assets/periodico.jpg'),
      link: 'ServiciosAdicionalesInter',
    },
    {
      title: 'Propaganda comercial',
      description: 'Servicio especializado para Pymes y grandes empresas.',
      imageUrl: require('../../../../assets/triptico.png'),
      link: 'ServiciosAdicionalesInter',
    },
    {
      title: 'Respuesta a promociones',
      description: 'Conoce las opiniones de tus clientes y genera un acercamiento mayor a ellos.',
      imageUrl: require('../../../../assets/respuestas.jpg'),
      link: 'ServiciosAdicionalesInter',
    },
  ];

  const ServicioCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={onPress}>
      <Image source={item.imageUrl} style={styles.cardImage} />

      <View style={styles.cardContentWrapper}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <TouchableOpacity style={styles.cardFooter} onPress={onPress}>
          <Text style={styles.moreInfoText}>Más información</Text>
          <View style={styles.cardArrowContainer}>
            <Icon name="arrow-back" size={24} color="#fff" style={{ transform: [{ scaleX: -1 }] }} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* 🔹 SafeAreaView agregado */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Título */}
          <Text style={styles.title}>
            Servicios
            {'\n'}
            para
            {'\n'}
            empresas
          </Text>

          {/* Lista de tarjetas */}
          <View style={styles.cardsList}>
            {cardData.map((item, index) => (
              <ServicioCard 
                key={index} 
                item={item} 
                onPress={() => navigation.navigate(item.link)} 
              />
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#000',
  },
  forwardButton: {
    width: 40,              // tamaño del círculo
    height: 40,
    borderRadius: 20,       // mitad del ancho = círculo perfecto
    backgroundColor: '#de1484', // color del fondo
    alignItems: 'center',   // centrar horizontalmente
    justifyContent: 'center', // centrar verticalmente
  },
  card: {
    backgroundColor: '#f3f4f6', // gris claro
    borderRadius: 16,           // bordes redondeados
    padding: 16,                // espacio interno
    marginVertical: 10,
    alignItems: 'center',       // centra la imagen y textos
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,               // sombra en Android
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8, 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 40,
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
});
