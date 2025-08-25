// AgregarTarjetaScreen.tsx (CORREGIDO)
import React, { useState } from 'react';
import {
  Platform, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useStripe, CardField, CardFieldInput } from '@stripe/stripe-react-native';

type AgregarTarjetaNavProp = NativeStackNavigationProp<RootStackParamList, 'AgregarTarjetaScreen'>;
const API_URL = process.env.EXPO_PUBLIC_API_URL; // <-- TU IP LOCAL


export default function AgregarTarjetaScreen() {
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation<AgregarTarjetaNavProp>();
  const stripe = useStripe();

  const handleAddCard = async () => {
    setIsSaving(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');

      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Por favor completa los datos de la tarjeta.');
        setIsSaving(false);
        return;
      }

      // 1. Obtener el perfil del usuario para el customerId
      const userProfileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const { stripeCustomerId, id: profileId } = userProfileRes.data;

      if (!stripeCustomerId || !profileId) throw new Error('No se encontró el customerId o profileId');

      // 2. Crear método de pago con Stripe
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
      });

      if (error || !paymentMethod) {
        console.log('Error al crear paymentMethod:', error);
        Alert.alert('Error', 'No se pudo registrar la tarjeta.');
        setIsSaving(false);
        return;
      }

      // 3. Asociar la tarjeta al cliente
      await axios.post(`${API_URL}/api/pagos/asociar-tarjeta`, {
        customerId: stripeCustomerId,
        paymentMethodId: paymentMethod.id,
        profileId: profileId, // 👈 este dato es crucial
      });
  setIsSaving(false);
  navigation.goBack();
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err.message || 'No se pudo guardar la tarjeta.';
      console.error('Error al agregar tarjeta:', backendMsg);
      Alert.alert('Error', backendMsg);
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Modal visible={isSaving} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#e91e63" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#555' }}>Guardando tarjeta...</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Tarjetas</Text>
      </View>

      <Text style={styles.subtitle}>Añadir Tarjeta</Text>

      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
        style={{ width: '100%', height: 50, marginVertical: 10 }}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />

      {!isSaving && (
        <TouchableOpacity style={styles.button} onPress={handleAddCard}>
          <Text style={styles.buttonText}>Añadir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// estilos iguales
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e91e63',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-end',
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
