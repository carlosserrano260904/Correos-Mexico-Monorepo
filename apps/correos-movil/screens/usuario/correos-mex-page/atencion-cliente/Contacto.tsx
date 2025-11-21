import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Usamos Feather para los iconos

// --- DATOS DE CONTACTO SIMPLIFICADOS ---
const contactData = [
  {
    title: 'Dirección',
    description: 'Conoce nuestra sede principal: Vicente García Torres No. 23, El Rosedal, C.P. 04310, Alcaldía Coyoacán, Ciudad de México.',
    additionalDescription: 'Está ubicada cerca de la estación de metro más cercana, con fácil acceso.',
    icon: 'map-pin',
  },
  {
    title: 'Conmutador',
    description: 'Comunícate por nuestra línea y habla con nosotros. (55) 5130 4100.',
    additionalDescription: 'Horario de atención: Lunes a viernes, de 9 am a 6 pm.',
    icon: 'phone',
  },
  {
    title: 'Atención a clientes',
    description: '¿Tienes alguna duda, sugerencia o comentario? No dudes en contactarnos. 800 701 4500 y 800 701 7000.',
    additionalDescription: 'Estamos disponibles para responder cualquier duda que tengas.',
    icon: 'headphones',
  },
  {
    title: 'Horario de atención',
    description: 'Lunes a viernes: de 9 am a 7 pm. Sábados: de 9 am a 1 pm.',
    additionalDescription: 'Recuerda que no atendemos los domingos.',
    icon: 'clock',
  },
  {
    title: 'Correo de Atención a Clientes',
    description: 'Comunícate por nuestra línea y habla con nosotros: contacto@correosdemexico.gob.mx.',
    additionalDescription: 'Nuestro equipo está disponible para ayudarte con cualquier consulta.',
    icon: 'mail',
  },
  {
    title: 'Correo de Cotización',
    description: 'Comunícate por nuestra línea y habla con nosotros: cotizacion@correosdemexico.gob.mx.',
    additionalDescription: 'Enviaremos tu cotización dentro de las 24 horas hábiles.',
    icon: 'mail',
  },
];
// --- FIN DE DATOS ---

export default function ContactoScreen() {

  // --- COMPONENTE DE CONTACTO CON ICONOS Y TEXTO ESTÁTICO ---
  const ContactInfoCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Icon name={item.icon} size={24} color="#ec4899" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      {/* Descripción estática */}
      <Text style={styles.cardDescription}>{item.description}</Text>

      {/* Descripción adicional estática */}
      <Text style={styles.additionalDescription}>{item.additionalDescription}</Text>
    </View>
  );
  // --- FIN DEL COMPONENTE DE CONTACTO ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Contacto</Text>
        </View>

        {/* Título de la pantalla */}
        <Text style={styles.title}>Datos de Contacto</Text>

        {/* Contenedor de las tarjetas */}
        <View style={styles.cardsList}>
          {contactData.map((item, index) => (
            <ContactInfoCard
              key={index}
              item={item}
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  backButton: {
    padding: 8, // Área de toque más grande
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 16,
  },
  cardsList: {
    paddingBottom: 48, // Espacio al final de la lista
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24, // Espacio entre tarjetas
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'column', // Colocamos el ícono y el título en columna
    alignItems: 'flex-start', // Alineamos a la izquierda
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,  // Título debajo del ícono
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
  additionalDescription: {
    fontSize: 14,
    color: '#ec4899',  // Color rosa para la descripción adicional
    lineHeight: 20,
    marginTop: 6,
  },
});
