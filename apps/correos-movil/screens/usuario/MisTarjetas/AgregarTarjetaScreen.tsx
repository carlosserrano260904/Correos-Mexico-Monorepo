// AgregarTarjetaScreen.tsx (Lógica funcional + Nuevo diseño)
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useStripe, CardField, CardFieldInput } from '@stripe/stripe-react-native';

// --- ¡Importando tus componentes de UI! ---
import { Button, Input, Text } from '../../../components/ui';
import { COLORS, SIZES } from '../../../utils/theme';

type AgregarTarjetaNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'AgregarTarjetaScreen'
>;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AgregarTarjetaScreen() {
  const [cardDetails, setCardDetails] = useState<CardFieldInput.Details | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation<AgregarTarjetaNavProp>();
  const stripe = useStripe();

  // Estados para el nombre y los errores
  const [cardholderName, setCardholderName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  // --- Lógica de validación ---
  const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    // La imagen dice "opcional", así que solo validamos si no está vacío
    if (trimmedName.length > 0) {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
      if (!nameRegex.test(trimmedName)) {
        setNameError('El nombre solo debe contener letras y espacios.');
        return false;
      }
    }
    setNameError(null); // No hay error
    return true;
  };

  const handleNameChange = (text: string) => {
    const cleanedText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
    setCardholderName(cleanedText);
    if (nameError) {
      validateName(cleanedText);
    }
  };

  // --- Lógica de `handleAddCard` ---
  const handleAddCard = async () => {
    setNameError(null);

    // 1. Validar nombre (opcional)
    if (!validateName(cardholderName)) {
      return;
    }

    // 2. Revisar si hay error de tarjeta
    if (cardError) {
      return;
    }

    // 3. Revisar si está completo
    if (!cardDetails?.complete) {
      setCardError('Por favor completa todos los datos de la tarjeta.');
      return;
    }

    // --- Lógica de Stripe ---
    setIsSaving(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');

      const userProfileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const { stripeCustomerId, id: profileId } = userProfileRes.data;

      if (!stripeCustomerId || !profileId)
        throw new Error('No se encontró el customerId o profileId');

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        paymentMethodType: 'Card',
        billingDetails: {
          name: cardholderName.trim(), // Enviamos el nombre
        },
      });

      if (error || !paymentMethod) {
        console.log('Error al crear paymentMethod:', error);
        setCardError(error?.message || 'No se pudo registrar la tarjeta.');
        setIsSaving(false);
        return;
      }

      await axios.post(`${API_URL}/api/pagos/asociar-tarjeta`, {
        customerId: stripeCustomerId,
        paymentMethodId: paymentMethod.id,
        profileId: profileId,
      });

      setIsSaving(false);
      Alert.alert('Éxito', 'Tarjeta agregada correctamente.');
      navigation.goBack();
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.message || err.message || 'No se pudo guardar la tarjeta.';
      console.error('Error al agregar tarjeta:', backendMsg);
      Alert.alert('Error', backendMsg);
      setIsSaving(false);
    }
  };

  // --- JSX Refactorizado con tus componentes de UI ---
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- Modal --- */}
        <Modal visible={isSaving} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color={COLORS.brand} />
              <Text color="muted" style={styles.modalText}>
                Guardando tarjeta...
              </Text>
            </View>
          </View>
        </Modal>

        {/* --- Header (usando <Text> personalizado) --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.foregroundTitle} />
          </TouchableOpacity>
          <Text size="large" fontWeight="bold" color="title" style={styles.title}>
            Nueva Tarjeta
          </Text>
        </View>

        {/* --- Vista Previa de Tarjeta --- */}
        <View style={styles.cardPreview}>
          <Text size="xl" style={styles.cardPreviewText}>
            •••• •••• •••• ••••
          </Text>
        </View>

        {/* --- Formulario --- */}
        <View style={styles.formContainer}>
          {/* --- Campo de Nombre --- */}
          <View style={styles.inputGroup}>
            <Text color="title" fontWeight="500" style={styles.label}>
              Nombre en la tarjeta (opcional)
            </Text>
            <Input
              placeholder="Nombre y apellidos"
              value={cardholderName}
              onChangeText={handleNameChange}
              onBlur={() => validateName(cardholderName)}
              autoCapitalize="words"
              style={nameError ? styles.inputError : null}
            />
            {nameError && (
              <Text size="small" style={styles.errorText}>
                {nameError}
              </Text>
            )}
          </View>

          {/* --- Campo de Tarjeta de Stripe --- */}
          <View style={styles.inputGroup}>
            <Text color="title" fontWeight="500" style={styles.label}>
              Datos de la Tarjeta
            </Text>
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: '4242 4242 4242 4242' }}
              cardStyle={[
                styles.cardFieldBase,
                cardError ? styles.inputError : null,
              ]}
              style={styles.cardFieldContainer}
              onCardChange={(details) => {
                setCardDetails(details);
                // Lógica de error
                if (details.error) {
                  if (details.error.code === 'InvalidNumber') {
                    setCardError('El número de tarjeta es inválido.');
                  } else if (details.error.code === 'InvalidExpiryDate') {
                    setCardError('La fecha de expiración es inválida.');
                  } else if (details.error.code === 'InvalidCvc') {
                    setCardError('El CVC es inválido.');
                  } else {
                    setCardError(details.error.message || 'Error en los datos.');
                  }
                } else {
                  setCardError(null);
                }
              }}
            />
            {cardError && (
              <Text size="small" style={styles.errorText}>
                {cardError}
              </Text>
            )}
          </View>

          {/* --- Botón --- */}
          <Button
            type="default"
            size="default"
            onPress={handleAddCard}
            disabled={isSaving}
            style={styles.button}
          >
            Añadir tarjeta
          </Button>

          {/* --- Texto de Footer --- */}
          <Text size="small" color="muted" align="center" style={styles.footerText}>
            Cifrado seguro. No compartimos tus datos con terceros
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Estilos Nuevos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 10,
  },
  title: {
    marginLeft: 16,
  },
  cardPreview: {
    backgroundColor: COLORS.brand,
    borderRadius: SIZES.borderRadius.large,
    height: 180,
    justifyContent: 'flex-end',
    padding: 24,
    marginBottom: 32,
  },
  cardPreviewText: {
    color: COLORS.white,
    letterSpacing: 3,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontSize: SIZES.fontSize.default,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
  },
  footerText: {
    paddingHorizontal: 16,
  },
  cardFieldContainer: {
    width: '100%',
    height: 48,
  },
  cardFieldBase: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.borderRadius.default,
    textColor: COLORS.foreground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.default,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    marginTop: 16,
    fontSize: SIZES.fontSize.default,
  },
  inputError: {
    borderColor: '#D32F2F',
    borderWidth: 1,
  },
  errorText: {
    color: '#D32F2F',
    marginTop: 4,
    fontSize: SIZES.fontSize.small,
  },
});