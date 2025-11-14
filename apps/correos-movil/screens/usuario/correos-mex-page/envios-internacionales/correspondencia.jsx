import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Usamos Feather para los iconos

// --- Componente reutilizable para las secciones de precios ---
const PriceSection = ({ title, price, backgroundColor }) => (
  <View style={styles.priceSection}>
    <View style={[styles.priceHeader, { backgroundColor: backgroundColor }]}>
      <Text style={styles.priceHeaderText}>{title}</Text>
    </View>
    <View style={styles.priceBody}>
      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>Desde</Text>
        <Text style={styles.priceValue}>{price} MXN</Text>
      </View>
      <Bullet text="Incluye IVA." />
      <Bullet text="Peso máximo: 1 kg por pieza." />
    </View>
  </View>
);

// --- Componente reutilizable para los bullets ---
const Bullet = ({ text, color = '#ec4899' }) => (
  <View style={styles.bulletContainer}>
    <View style={[styles.bulletDot, { backgroundColor: color }]} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

// --- Componente reutilizable para la nota de dimensiones (texto rosa) ---
const BulletNote = ({ text }) => (
  <View style={styles.bulletContainer}>
    <View style={[styles.bulletDot, { backgroundColor: '#ec4899' }]} />
    <Text style={[styles.bulletText, styles.bulletNoteText]}>
      <Text style={{ fontWeight: 'bold' }}>Nota:</Text> {text}
    </Text>
  </View>
);

export default function CorrespondenciaInterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Correspondencia Internacional</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
       
        <View style={styles.titleContainer}>
          <View style={styles.iconBackground}>
            <Icon name="mail" size={32} color="#ec4899" />
          </View>
          <Text style={styles.mainTitle}>Correspondencia Internacional</Text>
          <Text style={styles.mainSubtitle}>
            Envía cartas, documentos o tarjetas postales a cualquier parte del mundo a través de nuestra red postal.
          </Text>
        </View>

  
        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <Icon name="info" size={16} color="#4b5563" />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Nota</Text>
            <Text style={styles.infoBody}>
              Correos de México te ofrece el servicio internacional acelerado ya que pertenece a la red mundial de servicios Express Mail Service (EMS) de la Unión Postal Universal (UPU).
            </Text>
          </View>
        </View>

        
        <PriceSection 
          title="Norteamérica, Centroamérica y el Caribe"
          price="$11.50"
          backgroundColor="#ec4899" // Rosa
        />
        <PriceSection 
          title="Sudamérica y Europa"
          price="$13.50"
          backgroundColor="#84cc16" // Verde
        />
        <PriceSection 
          title="Resto del Mundo"
          price="$15.00"
          backgroundColor="#d2b48c" // Beige/Tan
        />


        <View style={styles.dimensionsContainer}>
          <Text style={styles.dimensionsTitle}>Dimensiones Máximas</Text>
          <Bullet text="Largo: 458 mm." />
          <Bullet text="Ancho: 324 mm." />
          <BulletNote text="El tiempo de entrega depende del país de destino." />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  // --- Título Principal ---
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fce7f3', // Rosa pálido
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '90%',
  },
  // --- Info Box ---
  infoBox: {
    backgroundColor: '#f3f4f6', // Gris claro
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb', // Gris medio
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  infoBody: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  // --- Price Section ---
  priceSection: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  priceHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  priceHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceBody: {
    padding: 16,
  },
  priceBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  // --- Bullet Point ---
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7, // Alinea con el texto
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  bulletNoteText: {
    color: '#ec4899', // Texto de nota en rosa
  },
  // --- Dimensiones ---
  dimensionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dimensionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
});
