import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Location from 'expo-location';


export default function UbicacionScreen() {
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesOriginales, setSucursalesOriginales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [error, setError] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const mapRef = useRef(null);
  const timeoutRef = useRef(null);

  // Obtener ubicación del usuario al montar el componente
  useEffect(() => {
    solicitarPermisoUbicacion();
  }, []);

  // Cuando ya se tenga la ubicación, cargar sucursales
  useEffect(() => {
    if (ubicacionUsuario) {
      obtenerSucursales(); // Ahora ya tenemos coordenadas reales
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
        return;
      }

      await obtenerUbicacionActual();
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
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

      // Ordenar sucursales por distancia si hay ubicación
      if (sucursalesOriginales.length > 0) {
        const sucursalesOrdenadas = ordenarPorDistancia(sucursalesOriginales, coordenadas);
        setSucursales(sucursalesOrdenadas);
        if (sucursalesOrdenadas.length > 0) {
          setSucursalSeleccionada(sucursalesOrdenadas[0]);
        }
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
    const R = 6371; // Radio de la Tierra en km
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

  const obtenerSucursales = async (query = '') => {
    try {
      setCargandoBusqueda(query !== '');
      const url = query
        ? `http://${IP}:3000/api/oficinas?search=${encodeURIComponent(query)}`
        : `http://${IP}:3000/api/oficinas`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar oficinas');

      const data = await response.json();

      // Transforma latitud y longitud en coordenadas
      const dataTransformada = data.map((item) => ({
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

      // Seleccionar la primera sucursal si existe
      if (sucursalesOrdenadas.length > 0) {
        setSucursalSeleccionada(sucursalesOrdenadas[0]);
      } else if (query !== '') {
        setSucursalSeleccionada(null);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar oficinas');
    } finally {
      setCargando(false);
      setCargandoBusqueda(false);
    }
  };

  const buscarSucursales = async (query) => {
    const texto = query.trim();

    // Si el campo está vacío, restaurar sucursales originales
    if (texto === '') {
      setSucursales(sucursalesOriginales);
      setError(null); // Limpiar cualquier error previo
      if (sucursalesOriginales.length > 0) {
        setSucursalSeleccionada(sucursalesOriginales[0]);
        // Centrar en la primera sucursal original
        centrarEnSucursal(sucursalesOriginales[0]);
      }
      return;
    }

    try {
      setCargandoBusqueda(true);
      setError(null); // Limpiar errores previos

      // Determinar si es búsqueda por código postal o por nombre de entidad
      let url = '';
      if (/^\d{5}$/.test(texto)) {
        // Si el texto es un código postal, se hace la búsqueda por código postal
        url = `http://${IP}:3000/api/oficinas/buscar/cp/${encodeURIComponent(texto)}`;
      } else if (/^[a-zA-Z\s]+$/.test(texto)) {
         // De lo contrario, busca por nombre de entidad
        url = `http://${IP}:3000/api/oficinas/buscar/nombre/${encodeURIComponent(texto)}`;
      } // else {
      //   // De lo contrario, busca por nombre de entidad
      //   // Si el texto parece ser un nombre de municipio (solo letras y espacios), se busca por municipio
      //   url = `http://${IP}:3000/api/oficinas/buscar/municipio/${encodeURIComponent(texto)}`;
      // }

      const response = await fetch(url);

      // Si la respuesta no es exitosa (404, 500, etc.)
      if (!response.ok) {
        let errorMessage = `No se encontraron oficinas para "${texto}"`;

        // Intentar obtener el mensaje del servidor si existe
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
        }

        console.warn("Error del servidor:", errorMessage);

        // Mostrar mensaje en el estado (no crashear la app)
        setError(errorMessage);
        setSucursales([]); // Limpiar resultados
        setSucursalSeleccionada(null);

        // Mostrar alert
        Alert.alert(
          'Sin resultados',
          errorMessage,
          [{ text: 'OK', style: 'default' }]
        );

        return; // Salir sin lanzar excepción
      }

      // Si la respuesta es exitosa, procesar los datos
      const data = await response.json();

      // Verificar si hay datos (doble verificación)
      if (!data || data.length === 0) {
        const mensaje = `No se encontraron oficinas para "${texto}"`;
        console.warn(mensaje);
        setError(mensaje);
        setSucursales([]);
        setSucursalSeleccionada(null);

        Alert.alert(
          'Sin resultados',
          mensaje,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      // Transformar los datos
      const dataTransformada = data.map((item) => ({
        ...item,
        coordenadas: {
          latitude: parseFloat(item.latitud),
          longitude: parseFloat(item.longitud),
        },
      }));

      // Ordenar por distancia si es necesario
      let sucursalesOrdenadas = dataTransformada;
      if (ubicacionUsuario) {
        sucursalesOrdenadas = ordenarPorDistancia(dataTransformada, ubicacionUsuario);
      }

      // Establecer los resultados
      setSucursales(sucursalesOrdenadas);
      setError(null); // Limpiar cualquier error previo

      if (sucursalesOrdenadas.length > 0) {
        setSucursalSeleccionada(sucursalesOrdenadas[0]);

        // ⭐ AQUÍ ESTÁ LA MAGIA: Centrar automáticamente el mapa en el primer resultado
        setTimeout(() => {
          centrarEnSucursal(sucursalesOrdenadas[0]);
        }, 300); // Pequeño delay para asegurar que el estado se actualice

        // Si hay múltiples resultados, ajustar el zoom para mostrar todos
        if (sucursalesOrdenadas.length > 1) {
          setTimeout(() => {
            ajustarVistaParaTodosLosResultados(sucursalesOrdenadas);
          }, 500);
        }
      }

    } catch (error) {
      console.error('=== ERROR EN BÚSQUEDA ===');
      console.error('Error completo:', error);
      console.error('Mensaje:', error.message);

      // Mensaje de error más amigable
      const mensajeError = error.message.includes('fetch')
        ? 'Error de conexión. Verifica tu conexión a internet.'
        : `Error al buscar: ${error.message}`;

      setError(mensajeError);

      // Mostrar alert de error
      Alert.alert(
        'Error de búsqueda',
        mensajeError,
        [{ text: 'OK', style: 'default' }]
      );

      setSucursales([]);
      setSucursalSeleccionada(null);

    } finally {
      setCargandoBusqueda(false);
    }
  };





  const limpiarBusqueda = () => {
    setTextoBusqueda('');
    setError(null); // Limpiar cualquier error
    setSucursales(sucursalesOriginales);
    if (sucursalesOriginales.length > 0) {
      setSucursalSeleccionada(sucursalesOriginales[0]);
    }
  };

  const buscarCercanas = () => {
    if (ubicacionUsuario) {
      // Si ya tenemos ubicación, re-ordenar
      const sucursalesOrdenadas = ordenarPorDistancia(sucursalesOriginales, ubicacionUsuario);
      setSucursales(sucursalesOrdenadas);
      if (sucursalesOrdenadas.length > 0) {
        setSucursalSeleccionada(sucursalesOrdenadas[0]);
        centrarEnSucursal(sucursalesOrdenadas[0]);
      }
    } else {
      // Si no tenemos ubicación, solicitarla
      obtenerUbicacionActual();
    }
  };

  if (cargando) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#DE1484" />
      </View>
    );
  }

  const centrarEnSucursal = (sucursal) => {
    if (!sucursal?.coordenadas) return;

    setSucursalSeleccionada(sucursal);

    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: sucursal.coordenadas.latitude,
          longitude: sucursal.coordenadas.longitude,
          latitudeDelta: 0.005, // Zoom más cercano para búsquedas específicas
          longitudeDelta: 0.005,
        },
        800 // Animación más suave
      );
    }
  };

  // Agrega esta nueva función después de la función centrarEnSucursal

  const ajustarVistaParaTodosLosResultados = (sucursales) => {
    if (!mapRef.current || sucursales.length === 0) return;

    // Calcular los límites de todas las sucursales encontradas
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

    // Calcular el centro y los deltas
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const deltaLat = Math.max(maxLat - minLat, 0.01) * 1.2; // Agregar padding del 20%
    const deltaLng = Math.max(maxLng - minLng, 0.01) * 1.2;

    // Animar a la nueva región
    mapRef.current.animateToRegion(
      {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLng,
      },
      1000 // Duración de la animación en ms
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
      // Si está vacío, restaurar todas
      setSucursales(sucursalesOriginales);
      setError(null);
      if (sucursalesOriginales.length > 0) {
        setSucursalSeleccionada(sucursalesOriginales[0]);
        centrarEnSucursal(sucursalesOriginales[0]);
      }
    } else {
      // Ejecutar búsqueda
      buscarSucursales(texto);
    }
  };

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={{ color: 'red' }}>{error}</Text>
  //     </View>
  //   );
  // }

  // Reemplaza la parte del return en tu componente principal:

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda con padding para notch */}
      <View style={[styles.searchContainer, { paddingTop: Constants.statusBarHeight + 10 }]}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o código postal... (presiona Enter)"
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
            placeholderTextColor="#999"
            returnKeyType="search" // ✅ Mostrar "Buscar" en el teclado
            onSubmitEditing={manejarSubmitEditing} // ✅ Ejecutar al presionar Enter
            blurOnSubmit={true} // ✅ Cerrar teclado después de buscar
          />
          {cargandoBusqueda && (
            <ActivityIndicator size="small" color="#DE1484" style={styles.searchLoader} />
          )}
          {textoBusqueda.length > 0 && !cargandoBusqueda && (
            <TouchableOpacity onPress={limpiarBusqueda} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
          {/* ❌ QUITAR EL BOTÓN DE BÚSQUEDA MANUAL */}
        </View>

        {/* Botón de ubicación */}
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


      {/* Mensaje si no hay resultados O hay error */}
      {(sucursales.length === 0 && textoBusqueda.length > 0 && !cargandoBusqueda) && (
        <View style={styles.noResultsContainer}>
          <MaterialIcons name="search-off" size={48} color="#ccc" />
          <Text style={styles.noResultsText}>
            {error || `No se encontraron sucursales que coincidan con "${textoBusqueda}"`}
          </Text>
          <TouchableOpacity onPress={limpiarBusqueda} style={styles.showAllButton}>
            <Text style={styles.showAllButtonText}>Mostrar todas las sucursales</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mapa y información solo si hay sucursales */}
      {sucursales.length > 0 && sucursalSeleccionada && (
        <>
          <MapView
            ref={mapRef}
            style={styles.mapa}
            initialRegion={{
              latitude: sucursalSeleccionada.coordenadas.latitude,
              longitude: sucursalSeleccionada.coordenadas.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={ubicacionUsuario ? true : false}
            showsMyLocationButton={false}
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
                <Text style={styles.codigoPostal}>CP: {sucursalSeleccionada.codigo_postal}</Text>

                {/* Mostrar distancia si está disponible */}
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

          {/* Lista de sucursales */}
          <ScrollView style={styles.sugerencias} showsVerticalScrollIndicator={false}>
            <Text style={styles.sugerenciasTitle}>
              {textoBusqueda
                ? `Resultados (${sucursales.length})`
                : ubicacionUsuario
                  ? 'Sucursales cercanas'
                  : 'Otras sucursales'
              }
            </Text>
            {sucursales
              .filter((s) => s.id_oficina !== sucursalSeleccionada.id_oficina)
              .map((s) => (
                <TouchableOpacity
                  key={s.id_oficina}
                  style={styles.sugerenciaItem}
                  onPress={() => centrarEnSucursal(s)}
                >
                  <MaterialIcons name="location-on" size={22} color="#DE1484" style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sugerenciaNombre}>{s.nombre_cuo}</Text>
                    <Text style={styles.sugerenciaDireccion}>{s.domicilio}</Text>
                    <View style={styles.sugerenciaFooter}>
                      <Text style={styles.sugerenciaCP}>CP: {s.codigo_postal}</Text>
                      {s.distancia && (
                        <Text style={styles.sugerenciaDistancia}>
                          {s.distancia.toFixed(1)} km
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </>
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
});