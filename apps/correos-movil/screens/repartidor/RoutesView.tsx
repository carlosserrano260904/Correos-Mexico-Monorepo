import * as React from 'react';
import * as Location from 'expo-location';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

//imagen del DOT de la ubicacion del usuario
const carImage = require('../../assets/icon_maps/flecha-gps.png')

export default function RoutesView() {
    const navigation = useNavigation();

  const [destination, setDestination] = React.useState({
    latitude: 24.009974534585247, 
    longitude: -104.44447330485218
  });

  const [intermediates, setIntermediates] = React.useState<LatLng[]>([
    { latitude: 24.03607544743889, longitude: -104.65042708051433 },
    { latitude: 24.030763356272793, longitude: -104.61984483069332 },
    { latitude: 24.026240946925842, longitude: -104.62899847198052 },
  ]);

  const [optimizedIntermediates, setOptimizedIntermediates] = React.useState<LatLng[]>([]);

  const [userLocation, setUserLocation] = React.useState<LatLng | null>(null);
  
  const [routePoints, setRoutePoints] = React.useState<LatLng[]>([]);

  React.useEffect(() => {
    
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso denegado');
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (location) => {
          const newLoc = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          // Actualiza estado y obtiene nueva ruta
          setUserLocation(newLoc);
          getRoute(newLoc, destination, intermediates);
        }
      );

      return () => {
        subscription.remove();
      };
      })();
    }, []);

    const getRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
      try {
        const response = await axios.post('http://192.168.0.170:3000/api/routes', {
          origin,
          destination,
          intermediates
        });

        const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;

        const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;


        const orderedPoints = optimizedOrder.map((i: number) => intermediates[i]);
        setOptimizedIntermediates(orderedPoints);
        // Decodificar polyline a coordenadas
        const points = decodePolyline(encodedPolyline);
        setRoutePoints(points);
      } catch (error) {
        console.error('Error al obtener la ruta:', error);
      }
    };

    const mapRegion = userLocation
      ? {
        ...userLocation,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
      }
      : undefined;

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={mapRegion}
      >
       
        {userLocation && <Marker coordinate={userLocation} title="Tu ubicación" image={carImage} />}

        <Marker 
          coordinate={destination}
          title="destino"
        />

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

      <ScrollView style={{width: "100%", height: "60%"}}>
        {optimizedIntermediates.map((point, index) => (
        <TouchableOpacity key={`card-${index}`} onPress={() => navigation.navigate('Package', {point})} style={styles.containerCardAddress}>
          <View style={styles.containerCardImage}>
            <Image source={carImage} style={{ width: 50, height: 50 }} />
          </View>

          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Paquete {index + 1}
            </Text>
            <Text style={{ fontSize: 16, paddingBottom: 8 }}>
            Dirección lat: {point.latitude.toFixed(5)}, lon: {point.longitude.toFixed(5)}
            </Text>
            <Text style={{ color: 'blue' }}>Voy para allá</Text>
          </View>
        </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

function decodePolyline(encoded: string): LatLng[] {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates: LatLng[] = [];

  while (index < encoded.length) {
    let b,
      shift = 0,
      result = 0;
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: "100%",
    height: "40%",
    
  },
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
  containerCardAddress: {
    /*backgroundColor: "pink",*/
    flexDirection: "row",
    alignItems: "center",
    padding: 20
  },
  containerCardImage: {
    paddingRight: 12
  }
});

