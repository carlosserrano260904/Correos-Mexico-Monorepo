import React, { useState } from 'react';
import {
  Platform, StyleSheet, Text, TouchableOpacity, View, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useStripe, CardField, CardFieldInput } from '@stripe/stripe-react-native';

type AgregarTarjetaNavProp = NativeStackNavigationProp<RootStackParamList, 'AgregarTarjetaScreen'>;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AgregarTarjetaScreen() {
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const navigation = useNavigation<AgregarTarjetaNavProp>();
  const stripe = useStripe();

  const handleAddCard = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');

      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Por favor completa los datos de la tarjeta.');
        return;
      }

      // 1. Obtener el perfil del usuario para extraer profileId y stripeCustomerId
      const userProfileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const userProfile = userProfileRes.data;
      if (!userProfile || !userProfile.id || !userProfile.stripeCustomerId) {
        throw new Error('No se pudo obtener el perfil o el stripeCustomerId.');
      }
      const profileId = userProfile.id;
      const stripeCustomerId = userProfile.stripeCustomerId;

      // 2. Crear token en Stripe
      const { token, error } = await stripe.createToken({ type: 'Card' });

      if (error || !token) {
        console.log('Error creando token:', error);
        Alert.alert('Error', 'No se pudo registrar la tarjeta.');
        return;
      }

      // 2.b El ID del token (ej: 'tok_...') es lo único que se debe enviar al backend.
      const stripeTokenId = token.id;

      const payload = {
        token: stripeTokenId,
        profileId: profileId,
      };
      console.log('Datos enviados:', payload);

      // 3. Enviar al backend con los campos correctos
      await axios.post(`${API_URL}/api/cards`, payload);

      Alert.alert('Éxito', 'Tarjeta guardada correctamente.');
      navigation.goBack();

    } catch (err: any) {
      // Mostrar mensaje de error del backend si existe
      const backendMsg = err?.response?.data?.message || err?.response?.data || err.message || 'No se pudo guardar la tarjeta.';
      console.error('Error al agregar tarjeta:', backendMsg);
      Alert.alert('Error', backendMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Tarjetas</Text>
      </View>

      <Text style={styles.subtitle}>Añadir Tarjeta</Text>

      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 10,
        }}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
