import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import Constants from 'expo-constants';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

type RouteProps = {
  destination: LatLng;
  onRouteDataUpdate?: (routeData: { distance: string | null; duration: string | null }) => void;
};

const Route: React.FC<RouteProps> = ({ destination, onRouteDataUpdate }) => {
  // Eliminamos los puntos intermedios fijos
  const [intermediates, setIntermediates] = useState<LatLng[]>([]);

  const [optimizedIntermediates, setOptimizedIntermediates] = useState<LatLng[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [routeInitialized, setRouteInitialized] = useState(false);
  const routeRequestId = useRef(0);

  function decodePolyline(encoded: string): LatLng[] {
    let index = 0, lat = 0, lng = 0;
    const coordinates: LatLng[] = [];

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0; result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  }

  const isOffRoute = (location: LatLng, route: LatLng[]): boolean => {
    return route.length > 0 &&
      !route.some(
        (point) =>
          Math.abs(point.latitude - location.latitude) < 0.0005 &&
          Math.abs(point.longitude - location.longitude) < 0.0005
      );
  };

  const calculateDistance = (origin: LatLng, destination: LatLng): number => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
    const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (distanceKm: number): string => {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
  };

  const estimateDuration = (distanceKm: number): string => {
    const averageSpeedKmh = 40; // Velocidad promedio en ciudad
    const durationHours = distanceKm / averageSpeedKmh;
    const durationMinutes = Math.round(durationHours * 60);
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    }
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        onRouteDataUpdate?.({ distance: null, duration: null });
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const newLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(newLoc);
          
          // Calcular distancia y duración cuando se obtiene la ubicación
          if (onRouteDataUpdate) {
            const distance = calculateDistance(newLoc, destination);
            const formattedDistance = formatDistance(distance);
            const estimatedDuration = estimateDuration(distance);
            
            onRouteDataUpdate({
              distance: formattedDistance,
              duration: estimatedDuration
            });
          }
        }
      );
    };

    startTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [destination, onRouteDataUpdate]);

  const getRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
    if (isRecalculating) return;

    const currentRequestId = ++routeRequestId.current;
    setIsRecalculating(true);

    try {
      const response = await axios.post(`http://${IP}:3000/api/routes`, {
        origin,
        destination,
        intermediates,
      });

      if (currentRequestId !== routeRequestId.current) return;

      const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;
      
      // Solo procesamos el orden optimizado si hay puntos intermedios
      if (intermediates.length > 0) {
        const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;
        const orderedPoints = optimizedOrder.map((i: number) => intermediates[i]);
        setOptimizedIntermediates(orderedPoints);
      } else {
        setOptimizedIntermediates([]);
      }
      
      setRoutePoints(decodePolyline(encodedPolyline));
    } catch (err) {
      if (currentRequestId === routeRequestId.current) {
        Alert.alert('Error', 'No se pudo recalcular la ruta. Revisa tu conexión.');
      }
    } finally {
      if (currentRequestId === routeRequestId.current) {
        setIsRecalculating(false);
      }
    }
  };

  useEffect(() => {
    if (userLocation) {
      if (!routeInitialized) {
        getRoute(userLocation, destination, intermediates);
        setRouteInitialized(true);
      } else if (isOffRoute(userLocation, routePoints)) {
        console.log('Fuera de la ruta. Recalculando...');
        getRoute(userLocation, destination, intermediates);
      }
    }
  }, [userLocation, destination, intermediates]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Solo mostrar el marcador del destino */}
        <Marker coordinate={destination} title="Destino" />

        {/* Solo mostrar marcadores intermedios si existen */}
        {optimizedIntermediates.map((point, index) => (
          <Marker key={`opt-${index}`} coordinate={point}>
            <View style={styles.numberMarker}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {routePoints.length > 0 && (
          <Polyline coordinates={routePoints} strokeWidth={5} strokeColor="pink" />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  numberMarker: {
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Route;