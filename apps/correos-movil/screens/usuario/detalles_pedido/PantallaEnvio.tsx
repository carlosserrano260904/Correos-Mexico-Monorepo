// components/checkout/PantallaEnvio.tsx
import React, { memo, useCallback, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StyleSheet,
  Alert,
  Dimensions,
  ScaledSize
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

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
} & ParamListBase;

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

type OptionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  accessibilityRole?: 'button'; // Añadido esta línea
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const ShippingOption = memo(({ 
  iconName, 
  title, 
  subtitle, 
  onPress,
  accessibilityLabel,
  accessibilityHint 
}: OptionProps) => (
  <TouchableOpacity 
    style={optionStyles.option} 
    onPress={onPress}
    accessibilityLabel={accessibilityLabel || title}
    accessibilityHint={accessibilityHint}>
    <View style={optionStyles.optionIcon}>
      <Ionicons name={iconName} size={24} color={Colors.dark} />
    </View>
    <View style={optionStyles.optionContent}>
      <Text style={optionStyles.optionTitle}>{title}</Text>
      <Text style={optionStyles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
  </TouchableOpacity>
));

const BottomNavItem = memo(({ 
  iconName, 
  color, 
  label 
}: { 
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
}) => (
  <TouchableOpacity 
    style={styles.navItem}
    accessibilityLabel={label}
    accessibilityHint={`Ir a la sección de ${label.toLowerCase()}`}>
    <Ionicons name={iconName} size={24} color={color} />
  </TouchableOpacity>
));

const { width, height } = Dimensions.get('window');

// Añadir listener para cambios de dimensiones
const PantallaEnvio = memo(() => {
  const navigation = useNavigation<NavigationProp>();

  // Mantener goBack para el botón de regresar
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Usar replace solo para navegación entre pestañas
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla anterior">
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        
        <View style={styles.headerRightIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Favoritos')}
            accessibilityLabel="Favoritos"
            accessibilityHint="Ver tus artículos favoritos">
            <Ionicons name="heart-outline" size={24} color={Colors.dark} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bagButton}
            onPress={() => navigation.navigate('Carrito')}
            accessibilityRole="button"
            accessibilityLabel="Carrito"
            accessibilityHint="Ver tu carrito de compras">
            <Ionicons name="bag-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Envío</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Pago')}>
          <Text style={styles.tabText}>Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Resumen')}>
          <Text style={styles.tabText}>Resumen</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tabContent}>
          <ShippingOption 
            iconName="location-outline"
            title="Punto de recogida"
            subtitle="Consulta puntos de Correos de México"
            accessibilityLabel="Punto de recogida"
            accessibilityHint="Consulta los puntos de entrega disponibles"
          />
          <ShippingOption 
            iconName="home-outline"
            title="Domicilio"
            subtitle="Configura el envío a domicilio"
          />
          <ShippingOption 
            iconName="flash-outline"
            title="Express"
            subtitle="Envío express con Mexpost"
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem 
          iconName="mail-outline" 
          color={Colors.gray} 
          label="Mensajes" 
        />
        <BottomNavItem 
          iconName="cube-outline" 
          color={Colors.primary} 
          label="Inicio" 
        />
        <BottomNavItem 
          iconName="person-outline" 
          color={Colors.gray} 
          label="Perfil" 
        />
        <BottomNavItem 
          iconName="home" 
          color={Colors.gray} 
          label="Inicio" 
        />
      </View>
    </SafeAreaView>
  );
});

// Estilos comunes para agregar en cada archivo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Changed from 'center' to align items to bottom
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02, // Changed from paddingVertical to paddingBottom
    paddingTop: height * 0.04, // Added extra padding top to extend header
    backgroundColor: Colors.white,
    minHeight: height * 0.12, // Added to ensure minimum height
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
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: height * 0.02,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Math.min(width * 0.035, 14), // Responsive font size with max limit
    color: Colors.textSecondary,
  },
  activeTabText: {
    fontSize: Math.min(width * 0.035, 14),
    color: Colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabContent: {
    padding: width * 0.04,
    gap: width * 0.04,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.01,
  },
});

const optionStyles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: width * 0.04,
    borderRadius: 16,
    marginBottom: height * 0.015,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionIcon: {
    marginRight: width * 0.04,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: height * 0.005,
  },
  optionSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: Colors.textSecondary,
  },
});

export default PantallaEnvio;