import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Usamos Feather para los iconos

// --- DATOS DE LAS PREGUNTAS FRECUENTES ---
const faqData = [
  {
    question: 'Pregunta número 1',
    answer: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia.',
    icon: 'help-circle',
  },
  {
    question: 'Pregunta número 2',
    answer: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia.',
    icon: 'help-circle',
  },
  {
    question: 'Pregunta número 3',
    answer: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia.',
    icon: 'help-circle',
  },
  {
    question: 'Pregunta número 4',
    answer: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia.',
    icon: 'help-circle',
  },
];
// --- FIN DE DATOS ---

export default function PreguntasFrecuentesScreen() {
  // --- COMPONENTE DE PREGUNTA FRECUENTE CON ICONO Y TEXTO ---
  const FaqCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Icon name={item.icon} size={24} color="#ec4899" />
        <Text style={styles.cardTitle}>{item.question}</Text>
      </View>

      {/* Respuesta estática */}
      <Text style={styles.cardAnswer}>{item.answer}</Text>
    </View>
  );
  // --- FIN DEL COMPONENTE DE PREGUNTA FRECUENTE ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
          {/* Título al lado de la flecha */}
          <Text style={styles.headerTitle}>Preguntas Frecuentes</Text>
        </View>

        {/* Título de la pantalla (centrado) */}
        <Text style={styles.mainTitle}>Preguntas Frecuentes</Text>

        {/* Subtítulo de la pantalla (centrado) */}
        <Text style={styles.title}>
          Las siguientes son algunas de las preguntas que con frecuencia se realizan respecto a nuestros servicios. Estamos aquí para ayudarte.
        </Text>

        {/* Contenedor de las tarjetas */}
        <View style={styles.cardsList}>
          {faqData.map((item, index) => (
            <FaqCard
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
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8, // Área de toque más grande
  },
  headerTitle: {
    fontSize: 18, // Título más pequeño en el encabezado
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,  // Separación entre la flecha y el texto
  },
  mainTitle: {
    fontSize: 32,  // Título principal más grande
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    textAlign: 'center',  // Centrado
  },
  title: {
    fontSize: 16,  // Subtítulo más pequeño
    color: '#6b7280',  // Gris para el subtítulo
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',  // Centrado
  },
  cardsList: {
    paddingBottom: 48, // Espacio al final de la lista
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16, // Espacio entre tarjetas
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Espacio entre ícono y texto
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  cardAnswer: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
});
