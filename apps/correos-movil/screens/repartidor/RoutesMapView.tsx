import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import { Check, X, Store } from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';

interface Package {
  id: string;
  estado_envio: string;
  numero_de_rastreo: string;
  calle: string;
  numero: string;
  numero_interior: string | null;
  asentamiento: string;
  codigo_postal: string;
  localidad: string;
  estado: string;
  pais: string;
  lat: string;
  lng: string;
  referencia: string;
}

export default function RoutesMapView({
  userLocation,
  destination,
  optimizedIntermediates,
  routePoints,
  packages,
}: {
  userLocation: LatLng | null;
  destination: LatLng;
  optimizedIntermediates: LatLng[];
  routePoints: LatLng[];
  packages: Package[];
}) {
  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  const mapRegion = {
    ...userLocation,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  };

  const getPackageByCoordinate = (coordinate: LatLng): Package | null => {
    return (
      packages.find(
        (pkg) =>
          Math.abs(parseFloat(pkg.lat) - coordinate.latitude) < 0.0001 &&
          Math.abs(parseFloat(pkg.lng) - coordinate.longitude) < 0.0001
      ) || null
    );
  };

  const getMarkerStyle = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || 'en_ruta';
    switch (statusLower) {
      case 'entregado':
        return {
          backgroundColor: '#4CAF50',
          borderColor: '#2E7D32',
        };
      case 'fallido':
        return {
          backgroundColor: '#F44336',
          borderColor: '#C62828',
        };
      default:
        return {
          backgroundColor: '#FF9800',
          borderColor: '#F57C00',
        };
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || 'en_ruta';
    switch (statusLower) {
      case 'entregado':
        return <Check size={16} color="white" strokeWidth={3} />;
      case 'fallido':
        return <X size={16} color="white" strokeWidth={3} />;
      default:
        return null;
    }
  };

  const allPackagesDelivered = packages.every(
    (pkg) =>
      pkg.estado_envio?.toLowerCase() === 'entregado' ||
      pkg.estado_envio?.toLowerCase() === 'fallido'
  );

  console.log("optimizedIntermediates:", optimizedIntermediates);
  

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >

        <Marker coordinate={destination} title="Sucursal destino">
          <View style={styles.destinationMarker}>
            <Store size={moderateScale(20)} color="#DE1484" strokeWidth={3}/>
          </View>
        </Marker>

        {optimizedIntermediates.map((point, index) => {
          const packageItem = getPackageByCoordinate(point);
          const status = packageItem?.estado_envio || 'en_ruta';
          const markerStyle = getMarkerStyle(status);

          console.log(`Rendering marker ${index}:`, {
            lat: point.latitude,
            lng: point.longitude,
            status,
            packageFound: !!packageItem,
            rastreo: packageItem?.numero_de_rastreo,
          });

          return (
            <Marker
              key={`opt-${index}`}
              coordinate={point}
              title={packageItem ? `Rastreo: ${packageItem.numero_de_rastreo}` : `Punto ${index + 1}`}
              description={packageItem ? `Estado: ${packageItem.estado_envio}` : ''}
            >
              <View
                style={[
                  styles.numberMarker,
                  {
                    backgroundColor: markerStyle.backgroundColor,
                    borderColor: '#fff',
                  },
                ]}
              >
                {packageItem?.estado_envio?.toLowerCase() === 'entregado' ? (
                  <View style={styles.iconContainer}>
                    <FontAwesome name="check" size={16} color="white" />
                  </View>
                ) : packageItem?.estado_envio?.toLowerCase() === 'fallido' ? (
                  <View style={styles.iconContainer}>
                    <FontAwesome name="times" size={16} color="white" />
                  </View>
                ) : (
                  <Text style={styles.numberText}>{index + 1}</Text>
                )}
              </View>
            </Marker>
          );
        })}

        {routePoints.length > 0 && (
          <Polyline
            coordinates={routePoints}
            strokeWidth={5}
            strokeColor="#DE1484"
            strokePattern={allPackagesDelivered ? [10, 10] : undefined}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  numberMarker: {
    backgroundColor: 'orange',
    borderRadius: moderateScale(20),
    padding: moderateScale(6),
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    padding: moderateScale(6),
    alignItems: 'center',
    justifyContent: 'center',
  }
});
