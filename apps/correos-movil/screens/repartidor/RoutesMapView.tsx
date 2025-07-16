import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';
import { Check, X } from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';

const carImage = require('../../assets/icon_maps/flecha-gps.png');

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

export default function RoutesMapView({ 
  userLocation, 
  destination, 
  optimizedIntermediates, 
  routePoints, 
  packages 
}: {
  userLocation: LatLng | null;
  destination: LatLng;
  optimizedIntermediates: LatLng[];
  routePoints: LatLng[];
  packages: Package[];
}) {
  const mapRegion = userLocation
    ? {
      ...userLocation,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04,
    }
    : undefined;

  // Función para obtener el paquete correspondiente a una coordenada
  const getPackageByCoordinate = (coordinate: LatLng): Package | null => {
    return packages.find(pkg =>
      Math.abs(pkg.latitud - coordinate.latitude) < 0.0001 &&
      Math.abs(pkg.longitud - coordinate.longitude) < 0.0001
    ) || null;
  };

  // Función para obtener el estilo del marcador según el estado
  const getMarkerStyle = (status: string) => {
    switch (status.toLowerCase()) {
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

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return <Check size={16} color="white" strokeWidth={3} />;
      case 'fallido':
        return <X size={16} color="white" strokeWidth={3} />;
      default:
        return null;
    }
  };

  // Verificar si todos los paquetes fueron entregados
  const allPackagesDelivered = packages.every(pkg => 
    pkg.estatus.toLowerCase() === 'entregado' || pkg.estatus.toLowerCase() === 'fallido'
  );

  return (
    <View style={{ flex: 1 }}>
      <MapView 
        style={StyleSheet.absoluteFillObject} 
        initialRegion={mapRegion} 
        showsUserLocation={true} 
        showsMyLocationButton={true}
      >
        {/* Marcador de destino - más grande si todos los paquetes fueron entregados */}
        <Marker 
          coordinate={destination} 
          title="Destino"
        />

        {/* Marcadores para paquetes optimizados */}
        {optimizedIntermediates.map((point, index) => {
          const packageItem = getPackageByCoordinate(point);
          const status = packageItem?.estatus || 'pendiente';
          const markerStyle = getMarkerStyle(status);
          const statusIcon = getStatusIcon(status);

          return (
<Marker
  key={`opt-${index}`}
  coordinate={point}
  title={packageItem ? `SKU: ${packageItem.sku}` : `Punto ${index + 1}`}
  description={packageItem ? `Estado: ${packageItem.estatus}` : ''}
>
  <View
    style={[
      styles.numberMarker,
      {
        backgroundColor:
          packageItem?.estatus === 'Entregado'
            ? 'green'
            : packageItem?.estatus === 'fallido'
            ? 'red'
            : 'orange',
        borderColor: '#fff',
      },
    ]}
  >
    {packageItem?.estatus === 'Entregado' ? (
      <View style={styles.iconContainer}>
        <FontAwesome name="check" size={16} color="white" />
      </View>
    ) : packageItem?.estatus === 'fallido' ? (
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

        {/* Línea de ruta - siempre visible */}
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
  backgroundColor: 'orange', // color por defecto
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
iconContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
});