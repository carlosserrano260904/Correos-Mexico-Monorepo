// components/checkout/PantallaPago.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StyleSheet, 
  Dimensions,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Heart, ShoppingBag, Home, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

// Colores
const Colors = {
  primary: '#E91E63',
  secondary: '#FF6B9D',
  white: '#FFFFFF',
  black: '#000000',
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  background: '#F5F5F5',
  transparent: 'transparent',
  shadow: 'rgba(0, 0, 0, 0.1)',
  border: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

type CheckoutStackParamList = {
  Envio: undefined;
  Pago: undefined;
  Resumen: undefined;
  Favoritos: undefined;
  Carrito: undefined;
  Mensajes: undefined;
  Inicio: undefined;
  Perfil: undefined;
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

const PantallaPago = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigate = useCallback((screen: keyof CheckoutStackParamList) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      Alert.alert('Error', 'No se pudo navegar a la pantalla solicitada');
    }
  }, [navigation]);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
  });

  const handleCardInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCard = () => {
    setShowCardForm(true);
  };

  const handleSaveCard = () => {
    // Aquí puedes agregar la lógica para guardar la tarjeta
    Alert.alert('Tarjeta guardada', 'La tarjeta se ha agregado exitosamente');
    setShowCardForm(false);
    // Limpiar el formulario
    setCardData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
    });
  };

  const handleCancelCard = () => {
    setShowCardForm(false);
    // Limpiar el formulario
    setCardData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      holderName: '',
    });
  };

  const formatCardNumber = (value: string) => {
    // Remover espacios y caracteres no numéricos
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Agregar espacios cada 4 dígitos
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // Máximo 16 dígitos + 3 espacios
  };

  const formatExpiryDate = (value: string) => {
    // Remover caracteres no numéricos
    const cleaned = value.replace(/\D/g, '');
    // Agregar "/" después de los primeros 2 dígitos
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
    });

    return () => subscription?.remove();
  }, []);

  const BottomNavItem = ({
    iconName,
    color,
    label,
    onPress,
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={[styles.navItemText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => handleNavigate('Favoritos')}
          >
            <Heart color="#DE1484" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => handleNavigate('Carrito')}
          >
            <ShoppingBag color="#DE1484" size={28} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Envio')}
        >
          <Text style={styles.tabText}>Envío</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Resumen')}
        >
          <Text style={styles.tabText}>Resumen</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Card Section */}
          <Text style={styles.sectionTitle}>Tarjeta de crédito / débito</Text>
          
          {/* Card Option */}
          <TouchableOpacity style={styles.paymentOption} onPress={handleAddCard}>
            <View style={styles.optionIconContainer}>
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={Colors.dark}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Añadir tarjeta</Text>
              <Text style={styles.optionSubText}>Visa, MasterCard, American Express</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>

          {/* Card Form */}
          {showCardForm && (
            <View style={styles.cardForm}>
              <Text style={styles.formTitle}>Datos de la tarjeta</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Número de tarjeta</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChangeText={(value) => handleCardInputChange('cardNumber', formatCardNumber(value))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.formLabel}>Fecha de vencimiento</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="MM/AA"
                    value={cardData.expiryDate}
                    onChangeText={(value) => handleCardInputChange('expiryDate', formatExpiryDate(value))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.formGroup, styles.formGroupHalf]}>
                  <Text style={styles.formLabel}>CVV</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="123"
                    value={cardData.cvv}
                    onChangeText={(value) => handleCardInputChange('cvv', value.replace(/\D/g, '').substring(0, 4))}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nombre del titular</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Juan Pérez"
                  value={cardData.holderName}
                  onChangeText={(value) => handleCardInputChange('holderName', value)}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelCard}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveCard}>
                  <Text style={styles.saveButtonText}>Guardar tarjeta</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}




        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navContent}>
          <BottomNavItem 
            iconName="mail-outline" 
            color={Colors.gray} 
            label="Mensajes" 
            onPress={() => handleNavigate('Mensajes')}
          />
          <BottomNavItem 
            iconName="cube-outline" 
            color={Colors.primary} 
            label="Inicio" 
            onPress={() => handleNavigate('Inicio')}
          />
          <BottomNavItem 
            iconName="person-outline" 
            color={Colors.gray} 
            label="Perfil" 
            onPress={() => handleNavigate('Perfil')}
          />
          <BottomNavItem 
            iconName="home-outline" 
            color={Colors.gray} 
            label="Inicio" 
            onPress={() => handleNavigate('Inicio')}
          />
        </View>
      </View>


    </SafeAreaView>
  );
};

export default PantallaPago;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    paddingTop: height * 0.06,
    backgroundColor: Colors.white,
    minHeight: height * 0.12,
  },
  backButton: {
    padding: width * 0.02,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.005,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    height: height * 0.045,
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Math.min(width * 0.035, 14),
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: -2,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContent: {
    padding: width * 0.04,
    paddingBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.02,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.012,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: height * 0.08,
  },
  optionIconContainer: {
    width: width * 0.12,
    height: height * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.03,
  },
  optionTextContainer: {
    flex: 1,
    paddingLeft: width * 0.02,
  },
  optionText: {
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubText: {
    fontSize: Math.min(width * 0.035, 14),
    color: Colors.textSecondary,
  },
  bottomNav: {
    backgroundColor: Colors.white,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  navContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemText: {
    fontSize: Math.min(width * 0.03, 13),
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: Colors.white,
  },
  cardForm: {
    backgroundColor: Colors.white,
    marginTop: height * 0.02,
    padding: width * 0.04,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.02,
  },
  formGroup: {
    marginBottom: height * 0.015,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: width * 0.03,
  },
  formLabel: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: height * 0.008,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: height * 0.015,
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  formButtons: {
    flexDirection: 'row',
    gap: width * 0.03,
    marginTop: height * 0.02,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    padding: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: Colors.white,
  },

});