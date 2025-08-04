import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  SafeAreaView, 
  Platform, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  background: '#F5F5F5',
};

const oficinasCorreos = [
  {
    id: 1,
    nombre: 'Centro Durango',
    lat: 24.025720,
    lng: -104.653175,
    direccion: 'Av. 20 de Noviembre 123, Centro',
    horario: 'Lunes a Viernes 9:00 - 18:00',
  },
  {
    id: 2,
    nombre: 'Plaza Bicentenario',
    lat: 24.033074,
    lng: -104.666043,
    direccion: 'Blvd. Felipe Pescador 456, Bicentenario',
    horario: 'Lunes a Sábado 8:30 - 19:30',
  },
  {
    id: 3,
    nombre: 'Guadalupe Victoria',
    lat: 24.448093,
    lng: -104.111154,
    direccion: 'Calle Hidalgo 789, Guadalupe Victoria',
    horario: 'Lunes a Viernes 8:00 - 17:00',
  },
  {
    id: 4,
    nombre: 'Lerdo',
    lat: 25.544398,
    lng: -103.523998,
    direccion: 'Av. Juárez 101, Centro Lerdo',
    horario: 'Lunes a Sábado 9:00 - 19:00',
  },
];

const INITIAL_REGION = {
  latitude: 24.025720,
  longitude: -104.653175,
  latitudeDelta: 1.0,
  longitudeDelta: 1.0,
};

const MapaPuntosRecogidaScreen = () => {
  const navigation = useNavigation();
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [loading, setLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permiso denegado',
            'Necesitamos acceso a tu ubicación para mostrarte las oficinas más cercanas',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        });
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirmSelection = async () => {
    if (!selectedOffice) {
      Alert.alert(
        'Selección requerida',
        'Por favor selecciona un punto de recogida antes de continuar',
        [{ text: 'OK' }]
      );
      return;
    }

    const selected = oficinasCorreos.find(o => o.id === selectedOffice);
    if (selected) {
      try {
        await AsyncStorage.setItem('modoEnvio', 'puntoRecogida');
        await AsyncStorage.setItem('puntoRecogidaSeleccionado', JSON.stringify(selected));
        
        // Navegamos de regreso a la pantalla de Envío que está dentro del CheckoutTabs
        navigation.goBack();
        
        // Opcional: Si necesitas ir directamente al Resumen, puedes usar:
        // navigation.navigate('CheckoutTabs', { screen: 'Resumen' });
        
      } catch (error) {
        console.error('Error al guardar la selección:', error);
        Alert.alert('Error', 'No se pudo guardar la selección');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puntos de Recogida</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapaContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingText}>Buscando tu ubicación...</Text>
          </View>
        ) : (
          <>
            <MapView
              style={styles.map}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              region={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              {oficinasCorreos.map((oficina) => (
                <Marker
                  key={oficina.id}
                  coordinate={{ latitude: oficina.lat, longitude: oficina.lng }}
                  title={oficina.nombre}
                  description={`${oficina.direccion}\n${oficina.horario}`}
                  pinColor={selectedOffice === oficina.id ? Colors.primary : '#4285F4'}
                  onPress={() => setSelectedOffice(oficina.id)}
                />
              ))}
            </MapView>

            {selectedOffice && (
              <View style={styles.selectedOfficeContainer}>
                <Text style={styles.selectedOfficeTitle}>
                  {oficinasCorreos.find(o => o.id === selectedOffice)?.nombre}
                </Text>
                <Text style={styles.selectedOfficeAddress}>
                  {oficinasCorreos.find(o => o.id === selectedOffice)?.direccion}
                </Text>
                <Text style={styles.selectedOfficeSchedule}>
                  Horario: {oficinasCorreos.find(o => o.id === selectedOffice)?.horario}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.confirmButton,
          { backgroundColor: selectedOffice ? Colors.primary : '#CCCCCC' }
        ]}
        onPress={handleConfirmSelection}
        disabled={!selectedOffice}
      >
        <Text style={styles.confirmButtonText}>
          {selectedOffice ? 'Confirmar punto de recogida' : 'Selecciona un punto'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: width * 0.02,
  },
  headerTitle: {
    fontSize: Math.min(width * 0.045, 20),
    color: Colors.dark,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginLeft: -24,
  },
  mapaContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 0,
  },
  map: {
    flex: 1,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.dark,
  },
  selectedOfficeContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  selectedOfficeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  selectedOfficeAddress: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  selectedOfficeSchedule: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
  },
  confirmButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapaPuntosRecogidaScreen;