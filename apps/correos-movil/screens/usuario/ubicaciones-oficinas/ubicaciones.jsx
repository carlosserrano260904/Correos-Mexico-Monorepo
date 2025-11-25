import React, { useState, useEffect, useRef, useMemo, useCallback  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

export default function UbicacionScreen() {
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesOriginales, setSucursalesOriginales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [mapaInicializado, setMapaInicializado] = useState(false); // 🆕 Nuevo estado
  const mapRef = useRef(null);
  const timeoutRef = useRef(null); 
  const navigation = useNavigation();
  const [regionVisible, setRegionVisible] = useState(null);

  // Obtener ubicación del usuario al montar el componente
  useEffect(() => {
    solicitarPermisoUbicacion();
  }, []);

  // Cuando ya se tenga la ubicación, cargar sucursales
  useEffect(() => {
    if (ubicacionUsuario) {
      obtenerSucursales();
    }
  }, [ubicacionUsuario]);

  const solicitarPermisoUbicacion = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permisos de ubicación',
          'Para mostrar las sucursales cercanas, necesitamos acceso a tu ubicación.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Configuración', onPress: () => Linking.openSettings() }
          ]
        );
        // 🆕 Cargar sucursales sin ubicación
        await obtenerSucursales();
        return;
      }

      await obtenerUbicacionActual();
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      // 🆕 Cargar sucursales sin ubicación en caso de error
      await obtenerSucursales();
    }
  };

  const obtenerUbicacionActual = async () => {
    try {
      setCargandoUbicacion(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 10000,
      });

      const coordenadas = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUbicacionUsuario(coordenadas);

      // 🆕 Si ya tenemos sucursales cargadas, reordenarlas por distancia
      if (sucursalesOriginales.length > 0) {
        const sucursalesOrdenadas = ordenarPorDistancia(sucursalesOriginales, coordenadas);
        setSucursales(sucursalesOrdenadas);
      }

    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación actual. Verifica que el GPS esté activado.'
      );
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const calcularDistancia = (coord1, coord2) => {
    const R = 6371;
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const ordenarPorDistancia = (sucursales, ubicacion) => {
    return sucursales.map(sucursal => ({
      ...sucursal,
      distancia: calcularDistancia(ubicacion, sucursal.coordenadas)
    })).sort((a, b) => a.distancia - b.distancia);
  };

  // 🚀 MÉTODO OPTIMIZADO - Una sola URL para todas las búsquedas
  const obtenerSucursales = async (query = '') => {
    try {
      setCargandoBusqueda(query !== '');

      const url = query
        ? `http://${IP}:3000/api/oficinas/buscar/${encodeURIComponent(query)}`
        : `http://${IP}:3000/api/oficinas`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al cargar oficinas');
      }

      const data = await response.json();

      // DEDUPLICACIÓN ADICIONAL en frontend (por si acaso)
      const dataDeduplicada = [];
      const domiciliosVistos = new Set();

      data.forEach((item) => {
        const domicilioNormalizado = item.domicilio?.toLowerCase().replace(/\s+/g, ' ').trim();
        if (domicilioNormalizado && !domiciliosVistos.has(domicilioNormalizado)) {
          domiciliosVistos.add(domicilioNormalizado);
          dataDeduplicada.push(item);
        }
      });

      // Transformar datos
      const dataTransformada = dataDeduplicada.map((item) => ({
        ...item,
        coordenadas: {
          latitude: parseFloat(item.latitud),
          longitude: parseFloat(item.longitud),
        },
      }));

      // Ordenar por distancia si hay ubicación del usuario
      let sucursalesOrdenadas = dataTransformada;
      if (ubicacionUsuario && query === '') {
        sucursalesOrdenadas = ordenarPorDistancia(dataTransformada, ubicacionUsuario);
      }

      setSucursales(sucursalesOrdenadas);

      // Guardar datos originales solo en la primera carga
      if (query === '') {
        setSucursalesOriginales(sucursalesOrdenadas);
      }

      // 🆕 CAMBIO PRINCIPAL: No seleccionar automáticamente ninguna sucursal al cargar inicialmente
      if (query !== '') {
        // Solo seleccionar sucursal cuando hay una búsqueda específica
        if (sucursalesOrdenadas.length > 0) {
          setSucursalSeleccionada(sucursalesOrdenadas[0]);
        } else {
          setSucursalSeleccionada(null);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setSucursales([]);
      setSucursalSeleccionada(null);
    } finally {
      setCargando(false);
      setCargandoBusqueda(false);
    }
  };

  // 🚀 BÚSQUEDA SIMPLIFICADA - Con una sola alerta cuando no encuentra resultados
  const buscarSucursales = async (query) => {
    const texto = query.trim();

    if (texto === '') {
      setSucursales(sucursalesOriginales);
      setSucursalSeleccionada(null); // 🆕 No seleccionar sucursal al limpiar búsqueda
      return;
    }

    try {
      setCargandoBusqueda(true);

      const url = `http://${IP}:3000/api/oficinas/buscar/${encodeURIComponent(texto)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error de conexión');
      }

      const data = await response.json();

      // DEDUPLICACIÓN
      const dataDeduplicada = [];
      const domiciliosVistos = new Set();

      data.forEach((item) => {
        const domicilioNormalizado = item.domicilio?.toLowerCase().replace(/\s+/g, ' ').trim();
        if (domicilioNormalizado && !domiciliosVistos.has(domicilioNormalizado)) {
          domiciliosVistos.add(domicilioNormalizado);
          dataDeduplicada.push(item);
        }
      });

      const dataTransformada = dataDeduplicada.map((item) => ({
        ...item,
        coordenadas: {
          latitude: parseFloat(item.latitud),
          longitude: parseFloat(item.longitud),
        },
      }));

      let sucursalesOrdenadas = dataTransformada;
      if (ubicacionUsuario) {
        sucursalesOrdenadas = ordenarPorDistancia(dataTransformada, ubicacionUsuario);
      }

      if (sucursalesOrdenadas.length > 0) {
        setSucursales(sucursalesOrdenadas);
        setSucursalSeleccionada(sucursalesOrdenadas[0]);

        setTimeout(() => {
          centrarEnSucursal(sucursalesOrdenadas[0]);
        }, 300);

        if (sucursalesOrdenadas.length > 1) {
          setTimeout(() => {
            ajustarVistaParaTodosLosResultados(sucursalesOrdenadas);
          }, 500);
        }
      } else {
        // Mostrar alerta pero mantener sucursales originales
        Alert.alert(
          'Sin resultados',
          `No se encontraron sucursales para "${texto}"`,
          [{ text: 'OK', style: 'default' }]
        );

        setSucursales(sucursalesOriginales);
        setSucursalSeleccionada(null); // 🆕 No seleccionar sucursal
      }

    } catch (error) {
      console.error('Error en búsqueda:', error);

      // Restaurar sucursales originales en caso de error
      setSucursales(sucursalesOriginales);
      setSucursalSeleccionada(null); // 🆕 No seleccionar sucursal

      Alert.alert(
        'Error',
        'Error de conexión. Verifica tu internet.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setCargandoBusqueda(false);
    }
  };

  const limpiarBusqueda = () => {
    setTextoBusqueda('');
    setSucursales(sucursalesOriginales);
    setSucursalSeleccionada(null); // 🆕 No seleccionar sucursal al limpiar
  };

  // 🎯 BOTÓN DE UBICACIÓN CORREGIDO - No interfiere con selección de sucursal
  const buscarCercanas = async () => {
    try {
      setCargandoUbicacion(true);

      // Solicitar permisos si no están concedidos
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a tu ubicación para encontrar sucursales cercanas.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Obtener ubicación actual (precisa y con timeout)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      const nuevaUbicacion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Guardar ubicación del usuario en el estado
      setUbicacionUsuario(nuevaUbicacion);

      // Limpiar búsqueda previa
      setTextoBusqueda('');

      // Ordenar sucursales por cercanía
      if (sucursalesOriginales.length > 0) {
        const sucursalesOrdenadas = ordenarPorDistancia(sucursalesOriginales, nuevaUbicacion);
        setSucursales(sucursalesOrdenadas);
      }

      // 🆕 No seleccionar sucursal automáticamente, solo centrar en usuario
      setSucursalSeleccionada(null);

      // CENTRAR EN LA UBICACIÓN DEL USUARIO
      setTimeout(() => {
        centrarEnUbicacionUsuario(nuevaUbicacion);
      }, 500);

    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.',
        [{ text: 'OK' }]
      );
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const centrarEnSucursal = useCallback((sucursal) => {
  if (mapRef.current && sucursal?.coordenadas) {
    mapRef.current.animateToRegion({
      ...sucursal.coordenadas,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setSucursalSeleccionada(sucursal);
  }
}, []);

  // 🆕 Nueva función específica para centrar en ubicación del usuario sin seleccionar sucursal
  const centrarEnUbicacionUsuario = (coords) => {
    if (!coords.latitude || !coords.longitude) return;

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01, // Un poco más amplio para mostrar sucursales cercanas
          longitudeDelta: 0.01,
        },
        800
      );
    }
  };

  const ajustarVistaParaTodosLosResultados = (sucursales) => {
    if (!mapRef.current || sucursales.length === 0) return;

    let minLat = sucursales[0].coordenadas.latitude;
    let maxLat = sucursales[0].coordenadas.latitude;
    let minLng = sucursales[0].coordenadas.longitude;
    let maxLng = sucursales[0].coordenadas.longitude;

    sucursales.forEach(sucursal => {
      const { latitude, longitude } = sucursal.coordenadas;
      minLat = Math.min(minLat, latitude);
      maxLat = Math.max(maxLat, latitude);
      minLng = Math.min(minLng, longitude);
      maxLng = Math.max(maxLng, longitude);
    });

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const deltaLat = Math.max(maxLat - minLat, 0.01) * 1.2;
    const deltaLng = Math.max(maxLng - minLng, 0.01) * 1.2;

    mapRef.current.animateToRegion(
      {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLng,
      },
      1000
    );
  };

  const abrirIndicaciones = () => {
    if (sucursalSeleccionada?.coordenadas) {
      const { latitude, longitude } = sucursalSeleccionada.coordenadas;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const manejarSubmitEditing = () => {
    const texto = textoBusqueda.trim();
    if (texto === '') {
      setSucursales(sucursalesOriginales);
      setSucursalSeleccionada(null); // 🆕 No seleccionar sucursal
    } else {
      buscarSucursales(texto);
    }
  };

  // 🆕 Función para obtener la región inicial del mapa
  const obtenerRegionInicial = useMemo(() => {
  if (ubicacionUsuario) {
    return {
      latitude: ubicacionUsuario.latitude,
      longitude: ubicacionUsuario.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }
  // región por defecto (CDMX, por ejemplo)
  return {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
}, [ubicacionUsuario]);

const sucursalesFiltradas = useMemo(() => {
  if (!regionVisible) return sucursales;

  const { latitude, longitude, latitudeDelta, longitudeDelta } = regionVisible;
  const minLat = latitude - latitudeDelta / 2;
  const maxLat = latitude + latitudeDelta / 2;
  const minLng = longitude - longitudeDelta / 2;
  const maxLng = longitude + longitudeDelta / 2;

  return sucursales.filter(s => {
    const lat = s.coordenadas?.latitude;
    const lng = s.coordenadas?.longitude;
    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  });
}, [sucursales, regionVisible]);


// 🌀 Pantalla de carga inicial
if (cargando) {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="#DE1484" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { paddingTop: Constants.statusBarHeight + 10 }]}>
        {/* Flecha de regresar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Input de búsqueda */}
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o código postal..."
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={manejarSubmitEditing}
            blurOnSubmit={true}
          />
          {cargandoBusqueda && (
            <ActivityIndicator size="small" color="#DE1484" style={styles.searchLoader} />
          )}
          {textoBusqueda.length > 0 && !cargandoBusqueda && (
            <TouchableOpacity onPress={limpiarBusqueda} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Botón ubicación */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={buscarCercanas}
          disabled={cargandoUbicacion}
        >
          {cargandoUbicacion ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="my-location" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Mapa */}
      {!cargando && sucursales.length > 0 && (
        <MapView
          ref={mapRef}
          style={styles.mapa}
          initialRegion={obtenerRegionInicial}
          showsUserLocation={!!ubicacionUsuario}
          showsMyLocationButton={false}
          onRegionChangeComplete={setRegionVisible} // 👈 Guarda la región visible
        >
          {sucursalesFiltradas.map((s) => (
            <Marker
              key={s.id_oficina}
              coordinate={s.coordenadas}
              pinColor="#DE1484"
              onPress={() => centrarEnSucursal(s)}
            />
          ))}
        </MapView>

      )}

      {/* Información de sucursal seleccionada */}
      {sucursalSeleccionada && (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={28} color="#DE1484" />
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{sucursalSeleccionada.nombre_cuo}</Text>
              <Text style={styles.direccion}>{sucursalSeleccionada.domicilio}</Text>
              <Text style={styles.codigoPostal}>CP: {sucursalSeleccionada.codigo_postal}</Text>

              {sucursalSeleccionada.distancia && (
                <Text style={styles.distancia}>
                  📍 {sucursalSeleccionada.distancia.toFixed(1)} km de distancia
                </Text>
              )}

              {sucursalSeleccionada.horario_atencion && (
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
      )}

      {/* Lista de sucursales */}
      {sucursales.length > 0 && (
        <FlatList
          data={sucursales.filter(s => !sucursalSeleccionada || s.id_oficina !== sucursalSeleccionada.id_oficina)}
          keyExtractor={item => item.id_oficina.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sugerenciaItem}
              onPress={() => centrarEnSucursal(item)}
            >
              <MaterialIcons name="location-on" size={22} color="#DE1484" style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sugerenciaNombre}>{item.nombre_cuo}</Text>
                <Text style={styles.sugerenciaDireccion}>{item.domicilio}</Text>
                <View style={styles.sugerenciaFooter}>
                  <Text style={styles.sugerenciaCP}>CP: {item.codigo_postal}</Text>
                  {item.distancia && (
                    <Text style={styles.sugerenciaDistancia}>
                      {item.distancia.toFixed(1)} km
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchLoader: {
    marginLeft: 10,
  },
  clearButton: {
    marginLeft: 10,
    padding: 4,
  },
  locationButton: {
    backgroundColor: '#DE1484',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  showAllButton: {
    backgroundColor: '#DE1484',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  showAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapa: {
    width: '100%',
    height: 280
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2
  },
  direccion: {
    color: '#333',
    marginBottom: 2
  },
  codigoPostal: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500'
  },
  distancia: {
    color: '#DE1484',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2
  },
  horario: {
    color: '#333',
    fontSize: 14
  },
  telefono: {
    color: '#333',
    fontSize: 14
  },
  boton: {
    backgroundColor: '#DE1484',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  sugerencias: {
    marginTop: 12,
    paddingHorizontal: 10
  },
  sugerenciasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
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
  sugerenciaNombre: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2
  },
  sugerenciaDireccion: {
    color: '#333',
    fontSize: 13,
    marginBottom: 4
  },
  sugerenciaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sugerenciaCP: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500'
  },
  sugerenciaDistancia: {
    color: '#DE1484',
    fontSize: 12,
    fontWeight: '600',
  },

  backButton: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

});