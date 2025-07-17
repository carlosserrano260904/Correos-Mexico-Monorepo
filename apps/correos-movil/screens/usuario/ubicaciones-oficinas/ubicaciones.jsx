import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';

export default function UbicacionScreen() {
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

    useEffect(() => {
    const obtenerSucursales = async () => {
        try {
        const response = await fetch(`http://${IP}:3000/api/oficinas`); 
        if (!response.ok) throw new Error('Error al cargar oficinas');

        const data = await response.json();

        // Transforma latitud y longitud en coordenadas (como objeto con números)
        const dataTransformada = data.map((item) => ({
            ...item,
            coordenadas: {
            latitude: parseFloat(item.latitud),
            longitude: parseFloat(item.longitud),
            },
        }));

        // console.log('Sucursales transformadas:', dataTransformada);

        if (dataTransformada.length > 0) {
            setSucursales(dataTransformada);
            setSucursalSeleccionada(dataTransformada[0]);
        } else {
            throw new Error('No se encontraron sucursales válidas');
        }
        } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar oficinas');
        } finally {
        setCargando(false);
        }
    };

    obtenerSucursales();
    }, []);


  const centrarEnSucursal = (sucursal) => {
    if (!sucursal?.coordenadas) return;
    setSucursalSeleccionada(sucursal);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: sucursal.coordenadas.latitude,
          longitude: sucursal.coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const abrirIndicaciones = () => {
    if (sucursalSeleccionada?.coordenadas) {
      const { latitude, longitude } = sucursalSeleccionada.coordenadas;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DE1484" />
      </View>
    );
  }

  if (!sucursalSeleccionada || !sucursalSeleccionada.coordenadas) {
    return (
      <View style={styles.container}>
        <Text>No hay información de ubicación disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.mapa}
        initialRegion={{
          latitude: sucursalSeleccionada.coordenadas.latitude,
          longitude: sucursalSeleccionada.coordenadas.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {sucursales.map((s) => (
          s.coordenadas && (
            <Marker
               key={s.id_oficina}
              coordinate={s.coordenadas}
              pinColor="#DE1484"
              onPress={() => centrarEnSucursal(s)}
            />
          )
        ))}
      </MapView>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={28} color="#DE1484" />
          <View style={{ flex: 1 }}>
            <Text style={styles.nombre}>{sucursalSeleccionada.nombre_cuo}</Text>
            <Text style={styles.direccion}>{sucursalSeleccionada.domicilio}</Text>

            {sucursalSeleccionada.horario && (
              <View style={styles.infoIconRow}>
                <Feather name="clock" size={18} color="#DE1484" style={{ marginRight: 6 }} />
                <Text style={styles.horario}>{sucursalSeleccionada.horario_atencion}</Text>
              </View>
            )}

            {sucursalSeleccionada.telefono && (
              <View style={styles.infoIconRow}>
                <FontAwesome name="phone" size={18} color="#DE1484" style={{ marginRight: 6 }} />
                <Text style={styles.telefono}>{sucursalSeleccionada.telefono}</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.boton} onPress={abrirIndicaciones}>
          <Text style={styles.botonTexto}>Obtener indicaciones</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sugerencias} showsVerticalScrollIndicator={false}>
        {sucursales
          .filter((s) => s.id !== sucursalSeleccionada.id)
          .map((s) => (
            <TouchableOpacity
              key={s.id_oficina}
              style={styles.sugerenciaItem}
              onPress={() => centrarEnSucursal(s)}
            >
              <MaterialIcons name="location-on" size={22} color="#DE1484" style={{ marginRight: 8 }} />
              <View>
                <Text style={styles.sugerenciaNombre}>{s.nombre_cuo}</Text>
                <Text style={styles.sugerenciaDireccion}>{s.direccion}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapa: { width: '100%', height: 320 },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: -30,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  nombre: { fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
  direccion: { color: '#333', marginBottom: 4 },
  infoIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  horario: { color: '#333', fontSize: 14 },
  telefono: { color: '#333', fontSize: 14 },
  boton: {
    backgroundColor: '#DE1484',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sugerencias: { marginTop: 12, paddingHorizontal: 10 },
  sugerenciaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sugerenciaNombre: { fontWeight: 'bold', fontSize: 15, color: '#333', marginBottom: 2 },
  sugerenciaDireccion: { color: '#333', fontSize: 13 },
});
