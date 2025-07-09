import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LatLng } from 'react-native-maps';

const carImage = require('../../assets/icon_maps/flecha-gps.png');

export default function RoutesListView({ optimizedIntermediates }: { optimizedIntermediates: LatLng[] }) {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ width: '100%' }}>
      {optimizedIntermediates.map((point, index) => (
        <TouchableOpacity
          key={`card-${index}`}
          onPress={() => navigation.navigate('Package', { point })}
          style={styles.containerCardAddress}
        >
          <View style={styles.containerCardImage}>
            <Image source={carImage} style={{ width: 50, height: 50 }} />
          </View>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Paquete {index + 1}</Text>
            <Text style={{ fontSize: 16, paddingBottom: 8 }}>
              Dirección lat: {point.latitude.toFixed(5)}, lon: {point.longitude.toFixed(5)}
            </Text>
            <Text style={{ color: 'blue' }}>Voy para allá</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerCardAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  containerCardImage: {
    paddingRight: 12,
  },
});
