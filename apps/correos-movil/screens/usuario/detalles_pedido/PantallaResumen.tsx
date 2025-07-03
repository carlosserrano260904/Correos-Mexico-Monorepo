import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  type ScaledSize
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

interface Producto {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface Usuario {
  nombre: string;
}

interface Direccion {
  tipo_envio: string;
  direccion: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
}

interface DetalleOrden {
  productos: Producto[];
  usuario: Usuario;
  direccion: Direccion;
  total: number;
  fecha_orden: string;
  estatus: string;
}

type CheckoutStackParamList = {
  Envio: undefined;
  Pago: undefined
  Favoritos: undefined; // Si tienes una pantalla de Favoritos, agrégala aquí
  Resumen: undefined;
} & ParamListBase;

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

const { width, height } = Dimensions.get('window');

const PantallaResumen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<CheckoutStackParamList>>();
  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<ScaledSize>({
    width: width,
    height: height,
    scale: 1,
    fontScale: 1
  });

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
      setError('Error al navegar entre pantallas');
    }
  }, [navigation]);

  useEffect(() => {
    const fetchDetalleOrden = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<DetalleOrden>(
          `http://${IP}:3000/api/orden/5`
        );
        setDetalle(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar detalles:', err);
        setError('Error al cargar los detalles de la orden');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetalleOrden();
  }, []);

  // Añadir listener para cambios de dimensiones
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

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
            accessibilityLabel="Carrito"
            accessibilityHint="Ver tu carrito de compras">
            <Ionicons name="bag-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Envio')}>
          <Text style={styles.tabText}>Envío</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleNavigate('Pago')}>
          <Text style={styles.tabText}>Pago</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Resumen</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando resumen...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {detalle && !isLoading && (
          <View style={styles.tabContent}>
            <View style={styles.productSection}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80/FF6B9D/FFFFFF?text=Top' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{detalle.productos[0].nombre}</Text>
                <Text style={styles.productDetail}>Cantidad: {detalle.productos[0].cantidad}</Text>
                <Text style={styles.productDetail}>Precio unitario: MXN {detalle.productos[0].precio_unitario}</Text>
                <Text style={styles.productPrice}>Total: MXN {detalle.total}</Text>
              </View>
            </View>

            <View style={styles.orderSection}>
              <Text style={styles.sectionTitle}>Datos de la orden</Text>
              <Text style={styles.orderDetail}>Cliente: {detalle.usuario.nombre}</Text>
              <Text style={styles.orderDetail}>Tipo de envío: {detalle.direccion.tipo_envio}</Text>
              <Text style={styles.orderDetail}>Dirección: {detalle.direccion.direccion}</Text>
              <Text style={styles.orderDetail}>
                Ciudad: {detalle.direccion.codigo_postal}, {detalle.direccion.ciudad}, {detalle.direccion.estado}
              </Text>
              <Text style={styles.orderDetail}>
                Fecha: {new Date(detalle.fecha_orden).toLocaleString()}
              </Text>
              <Text style={styles.orderDetail}>Estatus: {detalle.estatus}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
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
  content: { 
    paddingHorizontal: width * 0.04 
  },
  sectionTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tabContent: { 
    gap: width * 0.06, 
    paddingVertical: height * 0.02 
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
  productSection: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: width * 0.04,
    borderRadius: Math.min(width * 0.03, 12),
    marginBottom: height * 0.02,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Math.min(width * 0.02, 8),
    elevation: 3,
  },
  productImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 8,
    marginRight: width * 0.04,
  },
  productInfo: { 
    flex: 1 
  },
  productName: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.005,
  },
  productDetail: { 
    fontSize: Math.min(width * 0.035, 14), 
    color: Colors.textSecondary 
  },
  productPrice: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: height * 0.01,
  },
  orderSection: {
    backgroundColor: Colors.white,
    padding: width * 0.04,
    borderRadius: Math.min(width * 0.03, 12),
    gap: height * 0.015,
    marginBottom: height * 0.02,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: Math.min(width * 0.02, 8),
    elevation: 3,
  },
  orderDetail: { 
    fontSize: Math.min(width * 0.035, 14), 
    color: Colors.textPrimary 
  },
  loadingContainer: { 
    padding: width * 0.05, 
    alignItems: 'center' 
  },
  loadingText: { 
    color: Colors.gray, 
    fontSize: Math.min(width * 0.035, 14) 
  },
  errorContainer: {
    padding: width * 0.05,
    alignItems: 'center',
  },
  errorText: {
    color: Colors.primary,
    fontSize: Math.min(width * 0.035, 14),
  },
});

export default PantallaResumen;
