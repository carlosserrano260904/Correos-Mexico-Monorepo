import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';

const carImage = require('../../assets/icon_maps/flecha-gps.png');

export default function RoutesMapView({ userLocation, destination, optimizedIntermediates, routePoints, intermediates }: {
  userLocation: LatLng | null;
  destination: LatLng;
  optimizedIntermediates: LatLng[];
  routePoints: LatLng[];
  intermediates: LatLng[];
}) {
  const mapRegion = userLocation
    ? {
      ...userLocation,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04,
    }
    : undefined;

  return (
    <View style={{ flex: 1 }}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={mapRegion} showsUserLocation={true} showsMyLocationButton={true}>

        <Marker coordinate={destination} title="Destino" />

        {optimizedIntermediates.map((point, index) => (
          <Marker
            key={`opt-${index}`}
            coordinate={point}
          
          >
            <View style={styles.numberMarker}><Text style={styles.numberText}>{index+1}</Text></View>
          </Marker>
        ))}

        {routePoints.length > 0 && (
          <Polyline coordinates={routePoints} strokeWidth={5} strokeColor="pink" />
        )}
      </MapView>
    </View>
  );
}

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
