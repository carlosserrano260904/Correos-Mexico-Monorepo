import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  background: '#F5F5F5',
};

type Coordenadas = { latitude: number; longitude: number };

type Sucursal = {
  id_oficina?: string | number;
  id?: string | number;
  nombre_cuo?: string;
  domicilio?: string;
  codigo_postal?: string | number;
  horario_atencion?: string;
  telefono?: string;
  latitud?: number | string;
  longitud?: number | string;
  lat?: number | string;
  lng?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  coordenadas?: Coordenadas;
  distancia?: number;
  [k: string]: any;
};

// Preferimos EXPO_PUBLIC_API_URL; si no existe, caemos a IP_LOCAL:3000
const API_BASE =
  (process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || '') ||
  (Constants.expoConfig?.extra?.IP_LOCAL ? `http://${Constants.expoConfig.extra.IP_LOCAL}:3000` : '');

const MapaPuntosRecogidaScreen = () => {
  const navigation = useNavigation();

  const mapRef = useRef<MapView | null>(null);

  const [ubicacionUsuario, setUbicacionUsuario] = useState<Coordenadas | null>(null);
  const [loadingUbicacion, setLoadingUbicacion] = useState(true);

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
  const [loadingOficinas, setLoadingOficinas] = useState(false);

  // 1) Permisos + ubicación
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos de ubicación',
            'Para mostrar las sucursales cercanas, necesitamos acceso a tu ubicación.'
          );
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 10000,
        });
        setUbicacionUsuario({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } finally {
        setLoadingUbicacion(false);
      }
    })();
  }, []);

  // 2) Cargar oficinas desde /api/oficinas
  useEffect(() => {
    if (!API_BASE) {
      setLoadingOficinas(false);
      Alert.alert('Configuración', 'Falta configurar EXPO_PUBLIC_API_URL o extra.IP_LOCAL');
      return;
    }
    (async () => {
      setLoadingOficinas(true);
      try {
        const res = await fetch(`${API_BASE}/api/oficinas`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as Sucursal[];

        // Deduplicar por domicilio
        const vistos = new Set<string>();
        const dedup: Sucursal[] = [];
        for (const item of data) {
          const dom = item.domicilio?.toLowerCase()?.replace(/\s+/g, ' ')?.trim();
          if (dom && !vistos.has(dom)) {
            vistos.add(dom);
            dedup.push(item);
          }
        }

        // Normalizar coordenadas
        const transformado = dedup
          .map((it) => {
            const lat = it.latitud ?? it.lat ?? it.latitude;
            const lon = it.longitud ?? it.lng ?? it.longitude;
            const coordenadas =
              it.coordenadas?.latitude && it.coordenadas?.longitude
                ? it.coordenadas
                : lat != null && lon != null
                ? { latitude: Number(lat), longitude: Number(lon) }
                : undefined;

            return { ...it, id_oficina: it.id_oficina ?? it.id, coordenadas } as Sucursal;
          })
          .filter((x) => x.coordenadas?.latitude && x.coordenadas?.longitude);

        // Ordenar por distancia si tenemos ubicación
        const withDistance = ubicacionUsuario
          ? transformado
              .map((s) => ({
                ...s,
                distancia: distanciaKm(ubicacionUsuario, s.coordenadas as Coordenadas),
              }))
              .sort((a, b) => (a.distancia ?? 0) - (b.distancia ?? 0))
          : transformado;

        setSucursales(withDistance);
        setSucursalSeleccionada(withDistance[0] ?? null);
      } catch {
        Alert.alert('Error', 'No se pudieron cargar las oficinas.');
      } finally {
        setLoadingOficinas(false);
      }
    })();
  }, [ubicacionUsuario]);

  // 3) Región inicial
  const initialRegion: Region | null = useMemo(() => {
    const base =
      sucursalSeleccionada?.coordenadas ||
      sucursales.find((s) => s.coordenadas)?.coordenadas ||
      ubicacionUsuario ||
      null;

    return base
      ? { latitude: base.latitude, longitude: base.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }
      : null;
  }, [sucursalSeleccionada, sucursales, ubicacionUsuario]);

  const distanciaKm = (c1: Coordenadas, c2: Coordenadas) => {
    const R = 6371;
    const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
    const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((c1.latitude * Math.PI) / 180) *
        Math.cos((c2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const centrarEnSucursal = (s: Sucursal) => {
    if (!s?.coordenadas) return;
    setSucursalSeleccionada(s);
    mapRef.current?.animateToRegion(
      {
        latitude: s.coordenadas.latitude,
        longitude: s.coordenadas.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      350
    );
  };

  const handleConfirmSelection = async () => {
    if (!sucursalSeleccionada) {
      Alert.alert('Selecciona un punto', 'Toca un marcador para elegir una sucursal.');
      return;
    }
    // Guarda y regresa (Patrón sin callback → no hay warning)
    await AsyncStorage.setItem('puntoRecogidaSeleccionado', JSON.stringify(sucursalSeleccionada));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puntos de Recogida</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapaContainer}>
        {(!initialRegion && (loadingUbicacion || loadingOficinas)) ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingText}>Cargando mapa y oficinas…</Text>
          </View>
        ) : initialRegion ? (
          <MapView
            ref={(ref) => (mapRef.current = ref)}
            style={styles.mapa}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={initialRegion}
            showsUserLocation={!!ubicacionUsuario}
            showsMyLocationButton={false}
          >
            {sucursales.map((s, idx) =>
              s.coordenadas ? (
                <Marker
                  key={String(s.id_oficina ?? s.id ?? idx)}
                  coordinate={s.coordenadas}
                  pinColor="#DE1484"
                  onPress={() => centrarEnSucursal(s)}
                  title={s.nombre_cuo || undefined}
                  description={s.domicilio || undefined}
                />
              ) : null
            )}
          </MapView>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No hay coordenadas disponibles para mostrar.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          { backgroundColor: sucursalSeleccionada ? Colors.primary : '#CCCCCC' },
        ]}
        onPress={handleConfirmSelection}
        disabled={!sucursalSeleccionada}
      >
        <Text style={styles.confirmButtonText}>
          {sucursalSeleccionada ? 'Confirmar punto de recogida' : 'Selecciona un punto'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  backButton: { padding: width * 0.02 },
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
  },
  mapa: { flex: 1, borderRadius: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: Colors.dark },
  confirmButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

export default MapaPuntosRecogidaScreen;
