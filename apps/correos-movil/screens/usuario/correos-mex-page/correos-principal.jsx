import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CotizacionesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Cotizaciones</Text>
      </View>

      {/* Two Main Options */}
      <View style={styles.optionsContainer}>
        {/* Tarifador */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Tarifador')} // Navegar a la pantalla Tarifador
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.orangeGradient]}>
              <Text style={styles.iconText}>📊</Text>
            </View>
            <Text style={styles.cardTitle}>Tarifador</Text>
            <Text style={styles.cardSubtitle}>Cotizar un envío</Text>
          </View>
        </TouchableOpacity>

        {/* Ubicaciones */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Mapa-ubicaciones')} // Navegar a la pantalla Ubicaciones
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, styles.pinkGradient]}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <Text style={styles.cardTitle}>Ubicaciones</Text>
            <Text style={styles.cardSubtitle}>Encontrar sucursales</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* MEXPOST Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoRow}>
          <Text style={styles.mexText}>MEX</Text>
          <Text style={styles.postText}>POST</Text>
        </View>
        <Text style={styles.subtitle}>SERVICIO POSTAL MEXICANO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardContent: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  orangeGradient: {
    backgroundColor: '#f97316',
  },
  pinkGradient: {
    backgroundColor: '#ec4899',
  },
  iconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  logoRow: {
    flexDirection: 'row',
  },
  mexText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  postText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});