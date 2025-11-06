import React, { memo, useCallback, useState, useEffect } from 'react';
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
import { ChevronLeft, ArrowRight } from 'lucide-react-native';

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
  isSelected?: boolean;
};

const ShippingOption = memo(({ iconName, title, subtitle, onPress, disabled, isSelected }: OptionProps) => (
  <TouchableOpacity 
    style={[
      optionStyles.option, 
      disabled && { opacity: 0.6 },
      isSelected && optionStyles.optionSelected
    ]} 
    onPress={onPress} 
    disabled={disabled}
  >
    <View style={optionStyles.optionIcon}>
      <Ionicons name={iconName} size={24} color={isSelected ? Colors.primary : Colors.dark} />
    </View>
    <View style={optionStyles.optionContent}>
      <Text style={[
        optionStyles.optionTitle,
        isSelected && optionStyles.optionTitleSelected
      ]}>
        {title}
      </Text>
      <Text style={optionStyles.optionSubtitle}>{subtitle}</Text>
    </View>
    {isSelected ? (
      <View style={optionStyles.selectedIndicator}>
        <View style={optionStyles.selectedDot} />
      </View>
    ) : (
      <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
    )}
  </TouchableOpacity>
));

const PantallaEnvio = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loadingMapa, setLoadingMapa] = useState(false);
  const [metodoEnvioSeleccionado, setMetodoEnvioSeleccionado] = useState<string | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<any>(null);

  const handleBack = useCallback(() => {
    navigation.navigate('Carrito');
  }, [navigation]);

  const cargarSeleccionPrevia = useCallback(async () => {
    try {
      const metodoGuardado = await AsyncStorage.getItem('modoEnvio');
      const direccionGuardada = await AsyncStorage.getItem('direccionSeleccionada');
      
      if (metodoGuardado) {
        setMetodoEnvioSeleccionado(metodoGuardado);
      }
      if (direccionGuardada) {
        setDireccionSeleccionada(JSON.parse(direccionGuardada));
      }
    } catch (error) {
      console.error('Error al cargar selección previa:', error);
    }
  }, []);

  const abrirMapaPuntos = useCallback(async () => {
    try {
      setLoadingMapa(true);
      await AsyncStorage.setItem('modoEnvio', 'puntoRecogida');
      setMetodoEnvioSeleccionado('puntoRecogida');
      navigation.navigate('MapaPuntosRecogida');
    } finally {
      setLoadingMapa(false);
    }
  }, [navigation]);

  const irADomicilio = useCallback(async () => {
    await AsyncStorage.setItem('modoEnvio', 'domicilio');
    setMetodoEnvioSeleccionado('domicilio');
    navigation.navigate('Direcciones', { modoSeleccion: true });
  }, [navigation]);

  const irAPantallaPago = useCallback(() => {
    if (metodoEnvioSeleccionado) {
      navigation.navigate('Pago' as never);
    }
  }, [metodoEnvioSeleccionado, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarSeleccionPrevia();
    });
    
    cargarSeleccionPrevia();
    
    return unsubscribe;
  }, [navigation, cargarSeleccionPrevia]);

  const tieneDireccionValida = metodoEnvioSeleccionado === 'domicilio' && direccionSeleccionada;
  const tienePuntoRecogida = metodoEnvioSeleccionado === 'puntoRecogida';
  const puedeAvanzar = metodoEnvioSeleccionado && 
    ((metodoEnvioSeleccionado === 'domicilio' && direccionSeleccionada) || 
     (metodoEnvioSeleccionado === 'puntoRecogida'));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Selecciona método de envío</Text>

        <View style={styles.optionsContainer}>
          <ShippingOption
            iconName="location-outline"
            title="Punto de recogida"
            subtitle="Consulta puntos de Correos de México"
            onPress={abrirMapaPuntos}
            disabled={loadingMapa}
            isSelected={metodoEnvioSeleccionado === 'puntoRecogida'}
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
            isSelected={metodoEnvioSeleccionado === 'domicilio'}
          />
        </View>

        {/* Información de la selección actual */}
        {tieneDireccionValida && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionTitle}>Dirección seleccionada:</Text>
            <Text style={styles.selectionText}>
              {direccionSeleccionada.calle}, {direccionSeleccionada.ciudad}
            </Text>
          </View>
        )}

        {tienePuntoRecogida && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionTitle}>Método seleccionado:</Text>
            <Text style={styles.selectionText}>Recogida en punto Correos de México</Text>
          </View>
        )}
      </ScrollView>

      {/* Botón dinámico */}
      <View style={styles.footer}>
        {puedeAvanzar ? (
          <TouchableOpacity 
            style={styles.advanceButton} 
            onPress={irAPantallaPago}
            activeOpacity={0.8}
          >
            <Text style={styles.advanceButtonText}>Avanzar al Pago</Text>
            <ArrowRight size={20} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton}>
            <Text style={styles.placeholderButtonText}>
              {metodoEnvioSeleccionado === 'domicilio' && !direccionSeleccionada 
                ? 'Selecciona una dirección para continuar' 
                : 'Selecciona un método de envío para continuar'
              }
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  placeholder: {
    width: 40,
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.dark,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  loadingText: { 
    color: Colors.textSecondary, 
    fontSize: 14 
  },
  selectionInfo: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginTop: 8,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 4,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.gray,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  advanceButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  advanceButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  placeholderButton: {
    backgroundColor: '#E0E0E0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderButtonText: {
    color: Colors.gray,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
});

const optionStyles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: '#FCE4EC',
  },
  optionIcon: { 
    marginRight: 16 
  },
  optionContent: { 
    flex: 1 
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  optionSubtitle: { 
    fontSize: 14, 
    color: Colors.textSecondary 
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
});

export default PantallaEnvio;