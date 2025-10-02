import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
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

interface Card {
  stripeCardId: string;
  brand: string;
  last4: string;
}

const PantallaPago = () => {
  const navigation = useNavigation();
  const [tarjetas, setTarjetas] = useState<Card[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<Card | null>(null);

  const handleBack = useCallback(() => {
    navigation.navigate('Carrito');
  }, []);

  const irAgregarTarjeta = () => {
    navigation.navigate('AgregarTarjetaScreen' as never);
  };

  const cargarTarjetas = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID de usuario');

      const perfilRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = perfilRes.data?.id;

      if (!profileId) throw new Error('No se encontró el profileId');

      const tarjetasRes = await axios.get(`${API_URL}/api/cards/${profileId}`);
      const lista = tarjetasRes.data;

      if (!lista || lista.length === 0) {
        setTarjetas([]);
      } else {
        setTarjetas(lista);
      }
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      Alert.alert('Error', 'No se pudieron obtener las tarjetas.');
    }
  };

  const seleccionarTarjeta = async (card: Card) => {
    setTarjetaSeleccionada(card);
    await AsyncStorage.setItem('tarjetaSeleccionada', JSON.stringify(card));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarTarjetas();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Selecciona una tarjeta</Text>

        {tarjetas.length > 0 ? (
          <FlatList
            data={tarjetas}
            keyExtractor={(item) => item.stripeCardId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cardDisplay,
                  tarjetaSeleccionada?.stripeCardId === item.stripeCardId && styles.cardSelected,
                ]}
                onPress={() => seleccionarTarjeta(item)}
              >
                <Text style={styles.cardText}>
                  {item.brand.toUpperCase()} •••• {item.last4}
                </Text>
              </TouchableOpacity>
            )}
          />
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
    marginBottom: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
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
    marginTop: 20,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default PantallaPago;
