import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Usamos Feather para los iconos

// --- DATOS CON RUTAS DE IMAGEN CORRECTAS Y TEXTO SIMPLIFICADO ---
const cardData = [
  {
    title: 'Contacto',
    description: 'Conoce nuestras diferentes líneas de ayuda, estamos para servirte.',
    imageUrl: require('../../../../assets/imagenes_cliente/contacto.jpg'), // Ruta actualizada
    link: 'Contacto',
  },
  {
    title: 'Trámites y servicios',
    description: 'Conoce la lista de trámites y servicios que puedes realizar con nosotros.',
    imageUrl: require('../../../../assets/imagenes_cliente/tramite.jpg'), // Ruta actualizada
    link: 'Tramites',
  },
  {
    title: 'Preguntas frecuentes',
    description: 'Conoce nuestras diferentes líneas de ayuda, estamos para servirte.',
    imageUrl: require('../../../../assets/imagenes_cliente/preguntas.jpg'), // Ruta actualizada
    link: 'PreguntasFrecuentes',
  },
];
// --- FIN DE DATOS ---

// --- COMPONENTE DE TARJETA CON DISEÑO CORREGIDO Y TEXTO SIMPLIFICADO ---
const ServicioCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} activeOpacity={0.8} onPress={onPress}>
    <Image source={item.imageUrl} style={styles.cardImage} />
    <View style={styles.cardContentWrapper}>{/* Contenedor para el contenido de texto y footer */}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>

      {/* Footer para la flecha y el texto "Más información" */}
      <TouchableOpacity style={styles.cardFooter} onPress={onPress}>
        <Text style={styles.moreInfoText}>Más información</Text>
        <View style={styles.cardArrowContainer}>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);
// --- FIN DEL COMPONENTE DE TARJETA ---

export default function AtencionClienteScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Título de la pantalla */}
        <Text style={styles.title}>
          Reclamos y atención
          {'\n'}
          al cliente
        </Text>

        {/* Contenedor de las tarjetas */}
        <View style={styles.cardsList}>
          {cardData.map((item, index) => (
            <ServicioCard
              key={index}
              item={item}
              onPress={() => navigation.navigate(item.link)} // Navega a las rutas definidas
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
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
    padding: 8, // Área de toque más grande
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
    resizeMode: 'cover', // Asegurarse que la imagen cubra el espacio
  },
  cardContentWrapper: { // Contenedor para el contenido de texto y footer
    padding: 20,
    paddingBottom: 0, // Ajuste para que el footer gestione su propio padding
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
    borderTopColor: '#f3f4f6', // Separador visual
    marginHorizontal: -20, // Extender el borde a los lados
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moreInfoText: {
    fontSize: 14,
    color: '#ec4899', // Color rosa
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