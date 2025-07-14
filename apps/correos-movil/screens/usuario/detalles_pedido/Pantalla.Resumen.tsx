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
import { Heart, ShoppingBag } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

const BASE_URL = 'https://correos-mexico-monorepo.onrender.com';

interface Producto {
  nombre: string;
  cantidad: number;
  precio?: number; // Puede ser precio o precio_unitario, según tu back
  precio_unitario?: number;
  talla?: string;
  color?: string;
}

interface Usuario {
  nombre: string;
}

interface Direccion {
  tipo_envio?: string;
  direccion?: string;
  codigo_postal?: string;
  codigoPostal?: string;
  ciudad: string;
  estado: string;
  colonia?: string;
}

interface Pago {
  metodo?: string;
  referencia?: string;
}

interface DetalleOrden {
  id?: number;
  total: number | string;
  fecha?: string;
  usuario: Usuario;
  direccion: Direccion;
  pago?: Pago;
  productos: Producto[];
  fecha_orden?: string;
  estatus?: string;
  fecha_entrega_esperada?: string;
  guia_seguimiento?: string;
}

type CheckoutStackParamList = {
  Envio: undefined;
  Pago: undefined;
  Favoritos: undefined;
  Carrito: undefined;
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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<ScaledSize>({
    width: width,
    height: height,
    scale: 1,
    fontScale: 1
  });

  const handleToggleProductDetails = useCallback((idx: number) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  }, [expandedIdx]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigate = useCallback((screen: keyof CheckoutStackParamList) => {
    try {
      if (!navigation) {
        throw new Error('Navigation is not initialized');
      }
      navigation.navigate(screen);
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
          `${BASE_URL}/api/orden/1`
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

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Acción al confirmar compra (vacía, sin alerta)
  const handleConfirmarCompra = () => {
    // Aquí puedes poner tu lógica real, navegación, etc.
  };

  // Calcula el total sumando todos los productos (en caso de que 'total' no sea confiable)
  const totalCalculado = detalle?.productos
    ? detalle.productos.reduce((sum, prod) =>
        sum + ((prod.precio ?? prod.precio_unitario ?? 0) * (prod.cantidad || 1)), 0)
    : 0;

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
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Favoritos')}
            accessibilityLabel="Favoritos"
            accessibilityHint="Ver tus artículos favoritos">
            <Heart color="#DE1484" size={28} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconCircle}
            onPress={() => navigation.navigate('Carrito')}
            accessibilityLabel="Carrito"
            accessibilityHint="Ver tu carrito de compras">
            <ShoppingBag color="#DE1484" size={28} />
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
            {/* Renderizar TODOS los productos */}
            {detalle.productos.map((producto, idx) => (
              <View key={idx}>
                <TouchableOpacity 
                  style={styles.productSection}
                  onPress={() => handleToggleProductDetails(idx)}
                  activeOpacity={0.7}>
                  <View style={styles.productImageContainer}>
                    <Image
                      source={{ uri: 'https://via.placeholder.com/120x120/FF6B9D/FFFFFF?text=Top' }}
                      style={styles.productImage}
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{producto.nombre}</Text>
                    <View style={styles.productDetails}>
                      <Text style={styles.productDetail}>
                        {producto.cantidad} ud. 
                        {/* Si tienes talla/color en el back, descomenta las siguientes líneas */}
                        {/* | Talla {producto.talla || 'N/A'} | {producto.color || 'N/A'} */}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>MXN {(producto.precio ?? producto.precio_unitario ?? 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.expandIconContainer}>
                    <Ionicons 
                      name={expandedIdx === idx ? "chevron-up" : "chevron-down"} 
                      size={24} 
                      color={Colors.textSecondary} 
                    />
                  </View>
                </TouchableOpacity>

                {/* Detalles expandidos de cada producto */}
                {expandedIdx === idx && (
                  <View style={styles.productDetailsExpanded}>
                    <Text style={styles.productDetailsTitle}>Detalles del producto</Text>
                    
                    <View style={styles.productDetailRow}>
                      <Text style={styles.productDetailLabel}>Nombre</Text>
                      <Text style={styles.productDetailValue}>{producto.nombre}</Text>
                    </View>
                    
                    <View style={styles.productDetailRow}>
                      <Text style={styles.productDetailLabel}>Cantidad</Text>
                      <Text style={styles.productDetailValue}>{producto.cantidad} unidades</Text>
                    </View>
                    
                    <View style={styles.productDetailRow}>
                      <Text style={styles.productDetailLabel}>Precio unitario</Text>
                      <Text style={styles.productDetailValue}>MXN {(producto.precio ?? producto.precio_unitario ?? 0).toFixed(2)}</Text>
                    </View>
                    
                    {producto.talla && (
                      <View style={styles.productDetailRow}>
                        <Text style={styles.productDetailLabel}>Talla</Text>
                        <Text style={styles.productDetailValue}>{producto.talla}</Text>
                      </View>
                    )}
                    
                    {producto.color && (
                      <View style={styles.productDetailRow}>
                        <Text style={styles.productDetailLabel}>Color</Text>
                        <Text style={styles.productDetailValue}>{producto.color}</Text>
                      </View>
                    )}
                    
                    <View style={styles.productDetailRow}>
                      <Text style={styles.productDetailLabel}>Subtotal</Text>
                      <Text style={[styles.productDetailValue, styles.subtotalText]}>
                        MXN {((producto.precio ?? producto.precio_unitario ?? 0) * (producto.cantidad || 1)).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Dirección y método de pago (una sola vez) */}
            <View style={styles.productDetailsExpanded}>
              <Text style={styles.productDetailsTitle}>Resumen de envío y pago</Text>

              {/* Dirección */}
              <View style={[styles.productDetailRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                <Text style={[styles.productDetailLabel, { marginBottom: 2 }]}>Dirección de envío</Text>
                <Text style={[styles.productDetailValue, { textAlign: 'left', fontWeight: '400' }]}>
                  {detalle.direccion
                    ? `${detalle.direccion.colonia ?? ''}, ${detalle.direccion.ciudad}, ${detalle.direccion.estado}, CP ${detalle.direccion.codigo_postal ?? detalle.direccion.codigoPostal ?? ''}`
                    : 'No especificada'}
                </Text>
              </View>

              {/* Método de pago */}
              <View style={styles.productDetailRow}>
                <Text style={styles.productDetailLabel}>Método de pago</Text>
                <Text style={styles.productDetailValue}>
                  {detalle.pago?.metodo || 'No seleccionado'}
                </Text>
              </View>
            </View>

            {/* Total de la orden */}
            <View style={styles.productDetailsExpanded}>
              <View style={styles.productDetailRow}>
                <Text style={styles.productDetailsTitle}>Total:</Text>
                <Text style={[styles.productDetailsTitle, { color: Colors.primary }]}>
                  MXN {Number(detalle.total || totalCalculado).toLocaleString('es-MX')}
                </Text>
              </View>
            </View>

            {/* BOTÓN CONFIRMAR COMPRA */}
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmarCompra}
            >
              <Text style={styles.confirmButtonText}>Confirmar compra</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  content: { 
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContent: { 
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    gap: height * 0.02,
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
    padding: width * 0.05,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  expandIconContainer: {
    marginLeft: width * 0.02,
    padding: width * 0.01,
  },
  productDetailsExpanded: {
    backgroundColor: Colors.white,
    padding: width * 0.05,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
    marginTop: -height * 0.01,
  },
  productDetailsTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.025,
  },
  productDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  productDetailLabel: {
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textSecondary,
    flex: 1,
  },
  productDetailValue: {
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  subtotalText: {
    fontWeight: '600',
    color: Colors.primary,
  },
  productImageContainer: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: width * 0.02,
    marginRight: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: 8,
  },
  productInfo: { 
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.008,
  },
  productDetails: {
    marginBottom: height * 0.015,
  },
  productDetail: { 
    fontSize: Math.min(width * 0.035, 14), 
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  orderDetailsSection: {
    backgroundColor: Colors.white,
    padding: width * 0.05,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, shadow: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderDetailsTitle: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: height * 0.025,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  orderDetailLabel: {
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textPrimary,
    flex: 1,
  },
  orderDetailValue: {
    fontSize: Math.min(width * 0.04, 16),
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
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
});

export default PantallaResumen;
