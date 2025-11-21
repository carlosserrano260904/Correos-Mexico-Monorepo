import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ServiciosParaEmpresas() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const cardData = [
    {
      title: 'Correspondencia',
      description: 'Pasos a seguir para envíar correspondencia.',
      imageUrl: require('../../../../assets/paquetes1.jpg'),
      link: 'CorrespondenciaInter',
    },
    {
      title: 'Paquetería',
      description: 'Envío masivo de productos y mercancías.',
      imageUrl: require('../../../../assets/paquetes2.jpg'),
      link: 'PaqueteriaInter',
    },
    {
      title: 'Impresos',
      description: 'Incrementa la difusión de tus servicios con nuestros recursos de impresión.',
      imageUrl: require('../../../../assets/impresos.jpg'),
      link: 'ImpresosInter',
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
            <Icon name="arrow-back" size={24} color="#fff" style={{ transform: [{ scaleX: -1 }] }}/>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
     <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView style={styles.safeAreaContent}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Header con botón de regreso - SIN paddingTop adicional */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Icon name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Título de la pantalla */}
          <Text style={styles.title}>
            Servicios
            {'\n'}
            para
            {'\n'}
            empresas
          </Text>

          {/* Contenedor de las tarjetas */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  safeAreaContent: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8, // Pequeño padding en lugar del insets.top
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  backButton: {
    padding: 12,
    marginLeft: 4,
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
    paddingBottom: 48,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e5e7eb',
    resizeMode: 'cover', 
  },
  cardContentWrapper: {
    padding: 20,
    paddingBottom: 0, 
  },
  cardTextContainer: {
    marginBottom: 16,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
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