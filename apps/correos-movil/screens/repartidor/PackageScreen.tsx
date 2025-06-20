import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const carIcon = require('../../assets/icon_maps/flecha-gps.png');

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

export default function PackageScreen({ route }) {
  const { point } = route.params;
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [heading, setHeading] = useState(0);

  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [instruction, setInstruction] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
          mayShowUserSettingsDialog: true,
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(coords);
          setHeading(location.coords.heading ?? 0);
          getRoute(coords, point);
        }
      );

      return () => subscription.remove();
    })();
  }, []);

  const getRoute = async (origin: LatLng, destination: LatLng) => {
    try {
      const response = await axios.post(`http://${IP}:3000/api/routes`, {
        origin,
        destination,
      });

      const polyline = response.data.routes[0].polyline.encodedPolyline;
      const instructions = response.data.routes[0].legs?.[0]?.steps?.[0]?.navigationInstruction?.instructions;
      if (instructions) setInstruction(instructions);

      const decoded = decodePolyline(polyline);
      setRoutePoints(decoded);
    } catch (error) {
      console.error('Error obteniendo la ruta:', error);
    }
  };

   return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
        >
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            flat
            rotation={heading}
          >
            <Image source={carIcon} style={{ width: 40, height: 40, transform: [{ rotate: `${heading}deg` }] }} />
          </Marker>

          <Marker coordinate={point} title="Destino" />

          {routePoints.length > 0 && (
            <Polyline coordinates={routePoints} strokeWidth={5} strokeColor="blue" />
          )}
        </MapView>
      )}

      {instruction && (
        <View style={styles.instructionBox}>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>
      )}
    </View>
  );
}

function decodePolyline(encoded: string): LatLng[] {
  let index = 0, lat = 0, lng = 0, coordinates: LatLng[] = [];

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  instructionBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
