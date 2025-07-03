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
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path } from 'react-native-svg';

// Componentes de logos internos
const PayPalLogo = () => (
  <Svg width={90} height={90} viewBox="-15 0 124 33">
    <Path
      d="M46.211 6.749h-6.839a.95.95 0 00-.939.802l-2.766 17.537a.57.57 0 00.564.658h3.265a.95.95 0 00.939-.803l.746-4.73a.95.95 0 01.938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746z"
      fill="#253B80"
    />
    <Path
      d="M47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 01.563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906z"
      fill="#179BD7"
    />
  </Svg>
);

const GooglePayLogo = () => (
  <Svg width={70} height={70} viewBox="-15 0 70 24">
    <Path
      d="M27.713 12.273c0-.438-.039-.857-.111-1.258h-8.384v2.38h4.8a4.105 4.105 0 01-1.778 2.693v2.237h2.879c1.684-1.551 2.654-3.836 2.654-6.512z"
      fill="#4285F4"
    />
    <Path
      d="M19.218 19.89c2.407 0 4.427-.799 5.903-2.165l-2.879-2.237c-.798.535-1.818.85-3.024.85-2.325 0-4.293-1.57-4.994-3.68H11.23v2.31a8.817 8.817 0 007.987 4.922z"
      fill="#34A853"
    />
    <Path
      d="M14.224 12.658a5.297 5.297 0 010-3.39V6.958H11.23a8.824 8.824 0 000 7.932l2.994-2.232z"
      fill="#FBBC04"
    />
    <Path
      d="M19.218 7.388c1.311 0 2.487.45 3.41 1.337l2.557-2.558C23.689 4.777 21.669 4 19.218 4a8.817 8.817 0 00-7.987 4.958l2.994 2.232c.701-2.11 2.669-3.802 4.994-3.802z"
      fill="#EA4335"
    />
  </Svg>
);

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
  Favoritos: undefined; // Si tienes una pantalla de Favoritos, agrégala aquí
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

const { width, height } = Dimensions.get('window');

export default function PantallaPago() {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = useCallback(() => {
    navigation.goBack(); // Mantener goBack
  }, [navigation]);

  const handleNavigate = useCallback((screen: keyof CheckoutStackParamList) => {
    try {
      if (!navigation) {
        throw new Error('Navigation is not initialized');
      }
      navigation.navigate(screen); // Cambiado a navigate para permitir goBack
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'No se pudo navegar a la siguiente pantalla');
    }
  }, [navigation]);

  const [dimensions, setDimensions] = useState({
    width: width,
    height: height
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height
      });
    });

    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color={Colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bagButton}
            onPress={() => navigation.navigate('Carrito')}
          >
            <Ionicons name="bag-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Envio')}>
          <Text style={styles.tabText}>Envío</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Resumen')}>
          <Text style={styles.tabText}>Resumen</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          {/* Card Section */}
          <Text style={styles.sectionTitle}>Tarjeta de crédito / débito</Text>
          {/* Card Option */}
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.optionIconContainer}>
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={Colors.dark}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Añadir tarjeta</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>

          {/* Other Payment Options */}
          <Text style={[styles.sectionTitle, styles.otherOptionsTitle]}>
            Otras opciones de pago
          </Text>
          
          {/* PayPal Option */}
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.optionIconContainer}>
              <PayPalLogo />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>PayPal</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>

          {/* Apple Pay Option */}
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.optionIconContainer}>
              <Ionicons 
                name="logo-apple" 
                size={24} 
                color={Colors.dark}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Apple Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>

          {/* Google Pay Option */}
          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.optionIconContainer}>
              <GooglePayLogo />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Google Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          </TouchableOpacity>

          {/* Confirm Button - Moved inside ScrollView */}
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => handleNavigate('Resumen')}>
            <Text style={styles.confirmButtonText}>Confirmar pago</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="mail-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cube-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Agregar los estilos del header y unificar los estilos de los botones
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
    gap: width * 0.03,
  },
  iconButton: {
    padding: width * 0.02,
  },
  bagButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: width * 0.02,
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.02,
  },
  otherOptionsTitle: {
    marginTop: height * 0.03,
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
    minHeight: height * 0.075,
  },
  optionIconContainer: {
    width: width * 0.12,
    height: height * 0.035,
    justifyContent: 'center', // Changed to center
    alignItems: 'center', // Changed to center
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
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: height * 0.01,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: height * 0.015,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.03, // Add spacing from payment options
    marginBottom: height * 0.02, // Add bottom spacing
  },
  confirmButtonText: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: Colors.white,
  },
  cardIcon: {
    alignSelf: 'center',
  }
});
