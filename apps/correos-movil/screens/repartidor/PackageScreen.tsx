import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../schemas/schemas';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { moderateScale } from 'react-native-size-matters';
import { ScanQrCode, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native'

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height

interface Package {
  id: string;
  sku: string;
  numero_guia: string;
  estatus: string;
  latitud: number;
  longitud: number;
  fecha_creacion: string;
  indicaciones: string;
  calle: string;
  colonia: string;
  cp: string;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

type Props = NativeStackScreenProps<RootStackParamList, 'PackageScreen'> & {
  route: {
    params: {
      package: Package;
    };
  };
};

const PackageScreen: React.FC<Props> = ({ route, navigation }) => {
  const { package: packageData } = route.params;
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<LocationCoords[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      getDirections();
    }
  }, [currentLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos de Ubicación',
          'Se necesitan permisos de ubicación para mostrar tu posición actual y calcular la ruta.',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
      setIsLoadingLocation(false);
    }
  };

  const getDirections = async () => {
    if (!currentLocation) return;

    // Siempre establecer una línea directa como fallback inmediato
    const directRoute = [
      currentLocation,
      { latitude: packageData.latitud, longitude: packageData.longitud }
    ];
    setRouteCoordinates(directRoute);

    try {
      // Usar Google Directions API
      const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
      const destination = `${packageData.latitud},${packageData.longitud}`;
      
      // Nota: Necesitarás una API key de Google Maps Platform
      const API_KEY = 'TU_GOOGLE_MAPS_API_KEY'; // Reemplazar con tu API key
      
      // Solo intentar la API si hay una API key válida
      if (API_KEY && API_KEY !== 'TU_GOOGLE_MAPS_API_KEY') {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${API_KEY}&mode=driving&language=es`
        );
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const points = decodePolyline(route.overview_polyline.points);
          setRouteCoordinates(points);
          
          // Extraer distancia y duración
          const leg = route.legs[0];
          setDistance(leg.distance.text);
          setDuration(leg.duration.text);
        }
      } else {
        console.log('Usando línea directa - API key no configurada');
        // Calcular distancia aproximada para línea directa
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          packageData.latitud,
          packageData.longitud
        );
        setDistance(`${distance.toFixed(1)} km`);
        setDuration('Ruta directa');
      }
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      // Ya tenemos el fallback establecido arriba
    }
  };

  // Función para calcular distancia aproximada entre dos puntos
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Función para decodificar polyline de Google Maps
  const decodePolyline = (encoded: string): LocationCoords[] => {
    const points: LocationCoords[] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenMap = () => {
    if (currentLocation) {
      const url = `https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${packageData.latitud},${packageData.longitud}`;
      console.log('Abrir mapa externo:', url);
    }
  };

  const handleDelivery = () => {
    console.log('Confirmar entrega del paquete:', packageData.id);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#4CAF50';
      case 'fallido':
        return '#F44336';
      case 'pendiente':
        return '#FF9800';
      case 'en_ruta':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'Entregado';
      case 'fallido':
        return 'Entrega Fallida';
      case 'pendiente':
        return 'Pendiente';
      case 'en_ruta':
        return 'En Ruta';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getMapRegion = () => {
    if (!currentLocation) {
      return {
        latitude: packageData.latitud,
        longitude: packageData.longitud,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    // Calcular región que incluya ambos puntos
    const midLat = (currentLocation.latitude + packageData.latitud) / 2;
    const midLng = (currentLocation.longitude + packageData.longitud) / 2;
    
    const latDelta = Math.abs(currentLocation.latitude - packageData.latitud) * 1.5;
    const lngDelta = Math.abs(currentLocation.longitude - packageData.longitud) * 1.5;

    return {
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={moderateScale(24)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Paquete</Text>
        <TouchableOpacity>
          <ScanQrCode color={"#DE1484"} size={moderateScale(24)}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mapa con Ruta */}
        <View style={styles.mapContainer}>
          {isLoadingLocation && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#DE1484" />
              <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
            </View>
          )}
          
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={getMapRegion()}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >

            {/* Marcador de destino */}
            <Marker
              coordinate={{
                latitude: packageData.latitud,
                longitude: packageData.longitud,
              }}
              title={`SKU: ${packageData.sku}`}
              description={`${packageData.calle}, ${packageData.colonia}`}
              pinColor="#DE1484"
            >
              <View style={styles.destinationMarker}>
                <Ionicons name="location" size={20} color="#FFFFFF" />
              </View>
            </Marker>

            {/* Ruta - Siempre visible */}
            {currentLocation && (
              <Polyline
                coordinates={routeCoordinates.length > 0 ? routeCoordinates : [
                  currentLocation,
                  { latitude: packageData.latitud, longitude: packageData.longitud }
                ]}
                strokeColor="#DE1484"
                strokeWidth={5}
                strokeOpacity={0.8}
                lineDashPattern={[0]}
                lineJoin="round"
                lineCap="round"
              />
            )}
          </MapView>

          {/* Información de ruta */}
          {(distance || duration) && (
            <View style={styles.routeInfo}>
              {distance && (
                <View style={styles.routeInfoItem}>
                  <Ionicons name="resize" size={16} color="#666" />
                  <Text style={styles.routeInfoText}>{distance}</Text>
                </View>
              )}
              {duration && (
                <View style={styles.routeInfoItem}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.routeInfoText}>{duration}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(packageData.estatus) }]}>
            <Text style={styles.statusText}>{getStatusText(packageData.estatus)}</Text>
          </View>
        </View>

        {/* Información Principal */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>SKU:</Text>
            <Text style={styles.value}>{packageData.sku}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Número de Guía:</Text>
            <Text style={styles.value}>{packageData.numero_guia}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID del Paquete:</Text>
            <Text style={styles.value}>{packageData.id}</Text>
          </View>
        </View>

        {/* Indicaciones */}
        {packageData.indicaciones && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Indicaciones Especiales</Text>
            <Text style={styles.instructions}>{packageData.indicaciones}</Text>
          </View>
        )}

        {/* Dirección */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
          
          <View style={styles.addressGrid}>
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Calle</Text>
                <Text style={styles.addressValue}>{packageData.calle}</Text>
              </View>
            </View>

            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Colonia</Text>
                <Text style={styles.addressValue}>{packageData.colonia}</Text>
              </View>
            </View>
            
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Código Postal</Text>
                <Text style={styles.addressValue}>{packageData.cp}</Text>
              </View>
            </View>
        
          </View>
        </View>
      </ScrollView>

      {/* Botón de Entrega */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deliveryButton} onPress={() => navigation.navigate('RecibirPaquete', { package: packageData })}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.deliveryButtonText}>Confirmar Entrega</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(40),
    paddingBottom: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#000',
  },
  mapButton: {
    padding: moderateScale(8),
  },
  content: {
    
  },
  mapContainer: {
    height: screenHeight * 0.3,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#666',
  },
  currentLocationMarker: {
    backgroundColor: '#2196F3',
    borderRadius: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  destinationMarker: {
    backgroundColor: '#DE1484',
    borderRadius: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  routeInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    flexDirection: 'row',
    gap: moderateScale(16),
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  routeInfoText: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: moderateScale(16),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: moderateScale(12)
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: moderateScale(14),
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: moderateScale(14),
    color: '#000',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: moderateScale(12),
  },
  instructions: {
    fontSize: moderateScale(14),
    color: '#666',
    lineHeight: 20,
  },
  addressGrid: {
    gap: moderateScale(12),
  },
  addressRow: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },
  addressItem: {
    flex: 1,
  },
  addressLabel: {
    fontSize: moderateScale(12),
    color: '#666',
    fontWeight: '500',
    marginBottom: moderateScale(4),
  },
  addressValue: {
    fontSize: moderateScale(14),
    color: '#000',
    fontWeight: '600',
    backgroundColor: '#F8F9FA',
    padding: moderateScale(8),
    borderRadius: moderateScale(6),
    textAlign: 'left',
  },
  buttonContainer: {
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(52),
    paddingTop: moderateScale(12),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  deliveryButton: {
    backgroundColor: '#DE1484',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  deliveryButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default PackageScreen;