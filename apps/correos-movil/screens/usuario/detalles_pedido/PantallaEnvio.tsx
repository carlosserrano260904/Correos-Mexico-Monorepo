import React, { memo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { Heart, ShoppingBag } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

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
  Perfil: undefined;
  MapaPuntosRecogida: undefined;
} & ParamListBase;

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

type OptionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  accessibilityRole?: 'button';
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
    accessibilityHint={accessibilityHint}
  >
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
  label,
  onPress 
}: { 
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity 
    style={styles.navItem}
    onPress={onPress}
    accessibilityLabel={label}
    accessibilityHint={`Ir a la sección de ${label.toLowerCase()}`}
  >
    <Ionicons name={iconName} size={24} color={color} />
  </TouchableOpacity>
));

const PantallaEnvio = memo(() => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigate = useCallback((screen: keyof CheckoutStackParamList) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigation]);

  const handlePickupPointSelection = useCallback(() => {
    navigation.navigate('MapaPuntosRecogida');
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
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Favoritos')}
          >
            <Heart color="#DE1484" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Carrito')}
          >
            <ShoppingBag color="#DE1484" size={28} />
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
          onPress={() => handleNavigate('Pago')}
        >
          <Text style={styles.tabText}>Pago</Text>
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
        <View style={styles.tabContent}>
          <ShippingOption 
            iconName="location-outline"
            title="Punto de recogida"
            subtitle="Consulta puntos de Correos de México"
            onPress={handlePickupPointSelection}
            accessibilityLabel="Punto de recogida"
            accessibilityHint="Selecciona un punto de recogida en el mapa"
          />
          <ShippingOption 
            iconName="home-outline"
            title="Domicilio"
            subtitle="Configura el envío a domicilio"
            onPress={() => navigation.navigate('Direcciones')}
            accessibilityLabel="Domicilio"
            accessibilityHint="Configura o selecciona una dirección de envío"
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
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  tabContent: {
    padding: width * 0.04,
    gap: width * 0.04,
  },
  bottomNav: {
    backgroundColor: Colors.white,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
