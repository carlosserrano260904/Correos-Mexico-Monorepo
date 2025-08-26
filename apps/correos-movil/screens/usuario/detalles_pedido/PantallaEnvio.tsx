import React, { memo, useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  background: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

type NavigationProp = StackNavigationProp<any>;

type OptionProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
};

const ShippingOption = memo(({ iconName, title, subtitle, onPress, disabled }: OptionProps) => (
  <TouchableOpacity style={[optionStyles.option, disabled && { opacity: 0.6 }]} onPress={onPress} disabled={disabled}>
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
  const [loadingMapa, setLoadingMapa] = useState(false);

  const abrirMapaPuntos = useCallback(async () => {
    try {
      setLoadingMapa(true);
      await AsyncStorage.setItem('modoEnvio', 'puntoRecogida');
      navigation.navigate('MapaPuntosRecogida');
    } finally {
      setLoadingMapa(false);
    }
  }, [navigation]);

  const irADomicilio = useCallback(async () => {
    await AsyncStorage.setItem('modoEnvio', 'domicilio');
    navigation.navigate('Direcciones', { modoSeleccion: true });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.content}>
        <View style={styles.tabContent}>
          <ShippingOption
            iconName="location-outline"
            title="Punto de recogida"
            subtitle="Consulta puntos de Correos de México"
            onPress={abrirMapaPuntos}
            disabled={loadingMapa}
          />

          {loadingMapa && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Cargando mapa y sucursales…</Text>
            </View>
          )}

          <ShippingOption
            iconName="home-outline"
            title="Domicilio"
            subtitle="Configura el envío a domicilio"
            onPress={irADomicilio}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, backgroundColor: Colors.background },
  tabContent: { padding: width * 0.04, gap: width * 0.04 },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.01,
  },
  loadingText: { color: Colors.textSecondary, marginLeft: 8 },
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
  optionIcon: { marginRight: width * 0.04 },
  optionContent: { flex: 1 },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: height * 0.005,
  },
  optionSubtitle: { fontSize: 14, color: Colors.textSecondary },
});

export default PantallaEnvio;