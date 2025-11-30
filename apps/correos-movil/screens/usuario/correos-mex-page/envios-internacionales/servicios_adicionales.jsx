import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Bullet = ({ text, color = '#ec4899' }) => (
  <View style={styles.bulletContainer}>
    <View style={[styles.bulletDot, { backgroundColor: color }]} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

export default function ServiciosAdicionalesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Servicios Adicionales</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.titleContainer}>
          <View style={styles.iconBackground}>
            <Icon name="plus" size={32} color="#ec4899" />
          </View>
          <Text style={styles.mainTitle}>Servicios Adicionales Internacionales</Text>
          <Text style={styles.mainSubtitle}>
            Correos de México pone a tu disposición los siguientes servicios adicionales para complementar y mejorar tus necesidades de envío de mensajería o paquetería.
          </Text>
        </View>

        <View style={styles.serviceListContainer}>
          <Text style={styles.serviceListTitle}>Servicios adicionales por pieza</Text>
          
          <Bullet text="Certificado." />
          <Bullet text="Aviso de recibo." />
          <Bullet text="Almacenaje." />
          <Bullet text="Petición de devolución, modificación o corrección de domicilio." />
          <Bullet text="Reexpedición." />
          <Bullet text="Presentación a la aduana." />
          <Bullet text="Cupones respuesta." />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333333', 
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'serif', 
  },
  mainSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '90%',
    fontFamily: 'serif',
  },
  serviceListContainer: {
    marginTop: 20,
  },
  serviceListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6, 
    marginRight: 12, 
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: '#4b7280',
    lineHeight: 22, 
    fontFamily: 'serif', 
  },
});