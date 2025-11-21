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
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ChevronLeft, ArrowRight } from 'lucide-react-native';

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
  }, [navigation]);

  const irAgregarTarjeta = () => {
    navigation.navigate('AgregarTarjetaScreen' as never);
  };

  const irAPantallaResumen = () => {
    if (tarjetaSeleccionada) {
      // Navegar a la pestaña Resumen del Tab Navigator
      navigation.navigate('Resumen' as never);
    }
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Selecciona una tarjeta</Text>

        {tarjetas.length > 0 ? (
          <FlatList
            data={tarjetas}
            scrollEnabled={false}
            keyExtractor={(item) => item.stripeCardId}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cardDisplay,
                  tarjetaSeleccionada?.stripeCardId === item.stripeCardId && styles.cardSelected,
                ]}
                onPress={() => seleccionarTarjeta(item)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardBrand}>{item.brand.toUpperCase()}</Text>
                    <Text style={styles.cardNumber}>•••• {item.last4}</Text>
                  </View>
                  {tarjetaSeleccionada?.stripeCardId === item.stripeCardId && (
                    <View style={styles.selectedIndicator}>
                      <View style={styles.selectedDot} />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.noCardsContainer}>
            <Text style={styles.noCardText}>No hay ninguna tarjeta registrada.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addButton} onPress={irAgregarTarjeta}>
          <Text style={styles.addButtonText}>+ Añadir nueva tarjeta</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Botón dinámico */}
      <View style={styles.footer}>
        {tarjetaSeleccionada ? (
          <TouchableOpacity 
            style={styles.advanceButton} 
            onPress={irAPantallaResumen}
            activeOpacity={0.8}
          >
            <Text style={styles.advanceButtonText}>Avanzar al Resumen</Text>
            <ArrowRight size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton}>
            <Text style={styles.placeholderButtonText}>Selecciona una tarjeta para continuar</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  placeholder: {
    width: 40,
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.dark,
  },
  cardDisplay: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#FCE4EC',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: Colors.gray,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  noCardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noCardText: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  advanceButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  advanceButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  placeholderButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderButtonText: {
    color: Colors.gray,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default PantallaPago;