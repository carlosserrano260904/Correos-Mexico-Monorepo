import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Usamos Feather para los iconos

// --- Componente reutilizable para las secciones de precios (MODIFICADO para aceptar string en 'weight') ---
const PriceSection = ({ title, price, backgroundColor, weightText }) => (
  <View style={styles.priceSection}>
    <View style={[styles.priceHeader, { backgroundColor: backgroundColor }]}>
      <Text style={styles.priceHeaderText}>{title}</Text>
    </View>
    <View style={styles.priceBody}>
      <View style={styles.priceBox}>
        <Text style={styles.priceLabel}>Desde</Text>
        <Text style={styles.priceValue}>{price} MXN</Text>
      </View>
      <Bullet text={weightText} /> {/* Usamos weightText aquí */}
      <Bullet text="Incluye IVA." />
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

// --- Componente reutilizable para la nota general (texto rosa) ---
const BulletNote = ({ text }) => (
  <View style={styles.bulletContainer}>
    <View style={[styles.bulletDot, { backgroundColor: '#ec4899' }]} />
    <Text style={[styles.bulletText, styles.bulletNoteText]}>
      <Text style={{ fontWeight: 'bold' }}>Nota:</Text> {text}
    </Text>
  </View>
);

// --- Encabezado de Sección (ej. "1 Pequeños Paquetes") - NO SE USA EN ESTA PANTALLA, pero se mantiene para consistencia si se necesitara ---
const SectionHeading = ({ number, title }) => (
  <View style={styles.sectionHeadingContainer}>
    <View style={styles.sectionNumberCircle}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// --- Pantalla Principal para "Impresos Internacional" ---
export default function ImpresosInternacionalScreen({ navigation }) {
  // Colores de las imágenes (usando los mismos de Paquetería para consistencia visual)
  const colorDarkRed = '#c21e56'; // Aprox. para Norteamérica
  const colorGreen = '#84cc16';
  const colorBeige = '#d2b48c'; // Aprox. para Resto del Mundo

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header personalizado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Impresos Internacional</Text>
        <View style={{ width: 40 }} /> {/* Espacio para centrar el título */}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Icono y Título Principal */}
        <View style={styles.titleContainer}>
          <View style={styles.iconBackground}>
            <Icon name="book" size={32} color="#ec4899" /> 
          </View>
          <Text style={styles.mainTitle}>Impresos Internacional</Text>
          <Text style={styles.mainSubtitle}>
            Haz crecer tu negocio y lleva tus servicios a otros países enviando desde folletos,
            boletines y carteles hasta revistas, libros, gacetas y más.
          </Text>
        </View>

        {/* Nota de Información (idéntica) */}
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

        {/* Secciones de Precios */}
        <PriceSection 
          title="Norteamérica, Centroamérica y el Caribe"
          price="$11.99"
          backgroundColor={colorDarkRed}
          weightText="Peso máximo: 2 kg por pieza y 5 kg para libros." // Texto específico
        />
        <PriceSection 
          title="Sudamérica y Europa"
          price="$19.00"
          backgroundColor={colorGreen}
          weightText="Peso máximo: 2 kg por pieza y 5 kg para libros." // Texto específico
        />
        <PriceSection 
          title="Resto del Mundo"
          price="$21.00"
          backgroundColor={colorBeige}
          weightText="Peso máximo: 2 kg por pieza y 5 kg para libros." // Texto específico
        />

        {/* Nota al final */}
        <BulletNote text="El tiempo de entrega depende del país de destino." />

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
  // --- Encabezado de Sección (Mantenido aunque no usado aquí directamente) ---
  sectionHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ec4899',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
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
    marginTop: 7,
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
});