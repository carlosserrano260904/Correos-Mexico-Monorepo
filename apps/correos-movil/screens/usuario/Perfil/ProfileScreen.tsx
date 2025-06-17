import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 Perfil del Usuario</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>Juan Pérez</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Correo</Text>
        <Text style={styles.value}>juanperez@email.com</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Contraseña</Text>
        <Text style={styles.value}>********</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Teléfono</Text>
        <Text style={styles.value}>+52 55 1234 5678</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F5F6FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});