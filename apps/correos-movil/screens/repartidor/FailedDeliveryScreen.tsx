import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { RootStackParamList } from '../../schemas/schemas';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

type FailedDeliveryRouteProp = RouteProp<RootStackParamList, 'FailedDelivery'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FAILED_REASONS = [
  'Cliente ausente',
  'Dirección incorrecta o incompleta',
  'Rechazado por el destinatario',
  'Zona de riesgo / inaccesible',
  'Cerrado por festividad / fuera de horario',
  'Otro',
];

export default function FailedDeliveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<FailedDeliveryRouteProp>();
  const { package: packageData } = route.params;

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;

  const handleConfirm = async () => {
    if (!selectedReason) {
      Alert.alert('Selecciona un motivo', 'Debes seleccionar un motivo para la entrega fallida.');
      return;
    }

    if (selectedReason === 'Otro' && !otherReasonText.trim()) {
      Alert.alert('Especifica el motivo', 'Por favor, escribe el motivo en el campo de texto.');
      return;
    }

    const finalReason = selectedReason === 'Otro' ? otherReasonText.trim() : selectedReason;

    setIsUpdating(true);
    try {
      const response = await fetch(`http://${IP}:3000/api/envios/${packageData.id}/fallido`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo_fallido: finalReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado del paquete.');
      }

      Alert.alert('Éxito', 'El paquete ha sido marcado como entrega fallida.', [
        { text: 'OK', onPress: () => navigation.navigate('MainLoadPackagesDistributor' as never) },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el estado. Intenta de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  };

  const isButtonDisabled = !selectedReason || isUpdating || (selectedReason === 'Otro' && otherReasonText.trim() === '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={moderateScale(24)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Entrega Fallida</Text>
        <View style={{ width: moderateScale(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Selecciona el motivo del fallo</Text>
        
        {FAILED_REASONS.map((reason) => (
          <TouchableOpacity
            key={reason}
            style={[
              styles.reasonButton,
              selectedReason === reason && styles.reasonButtonSelected,
            ]}
            onPress={() => setSelectedReason(reason)}
          >
            <Text
              style={[
                styles.reasonText,
                selectedReason === reason && styles.reasonTextSelected,
              ]}
            >
              {reason}
            </Text>
          </TouchableOpacity>
        ))}

        {selectedReason === 'Otro' && (
          <TextInput
            style={styles.otherReasonInput}
            placeholder="Escribe aquí el motivo específico..."
            placeholderTextColor="#999"
            value={otherReasonText}
            onChangeText={setOtherReasonText}
            autoFocus={true}
          />
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, isButtonDisabled && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={isButtonDisabled}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Fallo de Entrega</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(40),
    paddingBottom: moderateScale(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {},
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: moderateScale(24),
  },
  reasonButton: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: moderateScale(12),
  },
  reasonButtonSelected: {
    backgroundColor: '#FFE8F4',
    borderColor: '#DE1484',
  },
  reasonText: {
    fontSize: moderateScale(16),
    color: '#333',
  },
  reasonTextSelected: {
    fontWeight: '600',
    color: '#DE1484',
  },
  otherReasonInput: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: '#DE1484',
    marginTop: moderateScale(4),
    fontSize: moderateScale(16),
    color: '#333',
    textAlignVertical: 'top',
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(52),
    paddingTop: moderateScale(12),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
});