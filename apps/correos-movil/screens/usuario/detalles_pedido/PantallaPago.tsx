import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  background: '#F5F5F5',
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const PantallaPago = () => {
  const navigation = useNavigation();
  const [tarjeta, setTarjeta] = useState<{ brand: string; last4: string } | null>(null);

  const handleBack = useCallback(() => {
    navigation.navigate('Carrito');
  }, []);

  const irAgregarTarjeta = () => {
    navigation.navigate('AgregarTarjetaScreen' as never);
  };

  const cargarTarjetaDesdeServidor = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID de usuario');

      const perfilRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = perfilRes.data?.id;

      if (!profileId) throw new Error('No se encontró el profileId');

      const tarjetasRes = await axios.get(`${API_URL}/api/cards/${profileId}`);
      const tarjetas = tarjetasRes.data;

      if (!tarjetas || tarjetas.length === 0) {
        setTarjeta(null);
      } else {
        const ultima = tarjetas[tarjetas.length - 1];
        setTarjeta({ brand: ultima.brand, last4: ultima.last4 });
      }
    } catch (error) {
      console.error('Error al cargar tarjeta:', error);
      Alert.alert('Error', 'No se pudo obtener la tarjeta.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarTarjetaDesdeServidor();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona una tarjeta</Text>

        {tarjeta ? (
          <View style={styles.cardDisplay}>
            <Text style={styles.cardText}>
              {tarjeta.brand.toUpperCase()} •••• {tarjeta.last4}
            </Text>
          </View>
        ) : (
          <Text style={styles.noCardText}>No hay ninguna tarjeta registrada.</Text>
        )}

        <TouchableOpacity style={styles.addButton} onPress={irAgregarTarjeta}>
          <Text style={styles.addButtonText}>Añadir nueva tarjeta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.dark,
  },
  cardDisplay: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark,
  },
  noCardText: {
    color: Colors.gray,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default PantallaPago;
