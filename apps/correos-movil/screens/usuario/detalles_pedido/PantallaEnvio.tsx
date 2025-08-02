import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  background: '#F5F5F5',
  border: '#E0E0E0',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

type NavigationProp = StackNavigationProp<any>;

type OptionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

const ShippingOption = memo(({ iconName, title, subtitle, onPress }: OptionProps) => (
  <TouchableOpacity style={optionStyles.option} onPress={onPress}>
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

const PantallaEnvio = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = useCallback(() => {
    navigation.navigate('Carrito');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opciones de Envío</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.tabContent}>
          <ShippingOption
            iconName="location-outline"
            title="Punto de recogida"
            subtitle="Consulta puntos de Correos de México"
            onPress={() => navigation.navigate('MapaPuntosRecogida')}
          />
          <ShippingOption
            iconName="home-outline"
            title="Domicilio"
            subtitle="Configura el envío a domicilio"
            onPress={() => navigation.navigate('Direcciones')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.02,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContent: {
    padding: width * 0.04,
    gap: width * 0.04,
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
    elevation: 3,
  },
  optionIcon: {
    marginRight: width * 0.04,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: height * 0.005,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default PantallaEnvio;
