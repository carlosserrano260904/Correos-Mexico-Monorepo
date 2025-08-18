import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, useWindowDimensions, FlatList, Alert, BackHandler } from 'react-native'
import { User, MapPin, LogOut } from 'lucide-react-native'
import { ProgressBar } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters'
import * as Location from 'expo-location';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import RoutesMapView from './RoutesMapView'
import { LatLng } from 'react-native-maps';
import Constants from 'expo-constants';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

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
  destinatario: string;
}

interface PackagesListDistributorProps {
  navigation?: any;
}

export default function PackagesListDistributor({ navigation }: PackagesListDistributorProps) {
  const route = useRoute();
  const [unidadId, setUnidadId] = React.useState<string | null>(null);

  // 1. Inicializar unidadId desde route o AsyncStorage
  React.useEffect(() => {
    const initUnidadId = async () => {
      if (route.params?.unidadId) {
        await AsyncStorage.setItem('unidadId', route.params.unidadId);
        setUnidadId(route.params.unidadId);
      } else {
        const storedUnidad = await AsyncStorage.getItem('unidadId');
        if (storedUnidad) {
          setUnidadId(storedUnidad);
        } else {
          Alert.alert('Error', 'No se encontró unidadId');
        }
      }
    };

    initUnidadId();
  }, [route.params]);

  // 2. Ejecutar fetchPackages una vez que unidadId esté definido
  React.useEffect(() => {
    if (unidadId) {
      console.log('unidadId listo:', unidadId);
      fetchPackages();
    }
  }, [unidadId]);

  // 3. Setup ubicación una vez (no depende de unidadId)
  React.useEffect(() => {
    setupLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);


  const [paquetesTotal, setPaquetesTotal] = React.useState(0);
  const [paquetesEntregados, setPaquetesEntregados] = React.useState(0);
  const [paquetesFallidos, setPaquetesFallidos] = React.useState(0);
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [routeInitialized, setRouteInitialized] = React.useState(false);
  const [isRecalculating, setIsRecalculating] = React.useState(false);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'mapa', title: 'Mapa' },
    { key: 'lista', title: 'Paquetes' },
  ]);

  const [destination, setDestination] = React.useState<LatLng>();
  
  React.useEffect(() => {
    const fetchOficinaCoords = async () => {
      if (!unidadId) return;
  
      try {
        const response = await fetch(`http://${IP}:3000/api/unidades/${unidadId}`);
        const unidad = await response.json();
  
        if (
          unidad?.oficina?.latitud &&
          unidad?.oficina?.longitud &&
          !isNaN(parseFloat(unidad.oficina.latitud)) &&
          !isNaN(parseFloat(unidad.oficina.longitud))
        ) {
          setDestination({
            latitude: parseFloat(unidad.oficina.latitud),
            longitude: parseFloat(unidad.oficina.longitud),
          });
        } else {
          console.warn("No se encontraron coordenadas válidas en la oficina de la unidad.");
        }
      } catch (error) {
        console.error("Error al obtener coordenadas de la oficina:", error);
      }
    };
  
    fetchOficinaCoords();
  }, [unidadId]);

  const [intermediates, setIntermediates] = React.useState<LatLng[]>([]);
  const [optimizedIntermediates, setOptimizedIntermediates] = React.useState<LatLng[]>([]);
  const [userLocation, setUserLocation] = React.useState<LatLng | null>(null);
  const [routePoints, setRoutePoints] = React.useState<LatLng[]>([]);

  // Refs para control de concurrencia
  const fetchPackagesController = React.useRef<AbortController | null>(null);
  const routeController = React.useRef<AbortController | null>(null);
  const locationSubscription = React.useRef<Location.LocationSubscription | null>(null);
  const isMountedRef = React.useRef(true);

  // Ref para evitar múltiples llamadas de localización
  const locationSetupInProgress = React.useRef(false);

  // Ref para rastrear el último timestamp de recálculo de ruta
  const lastRouteCalculation = React.useRef<number>(0);
  const ROUTE_DEBOUNCE_MS = 10000; // 5 segundos mínimo entre recálculos

  // Cleanup al desmontar
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Limpiar controladores
      if (fetchPackagesController.current) {
        fetchPackagesController.current.abort();
      }
      if (routeController.current) {
        routeController.current.abort();
      }
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const handleTerminarTurno = () => {
    Alert.alert(
      'Terminar Turno',
      '¿Estás seguro de que quieres terminar tu turno? No podrás volver a esta pantalla hasta que inicies uno nuevo.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, terminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('turno_activo');
              await AsyncStorage.removeItem('sucursal');
              await AsyncStorage.removeItem('unidadId');
              await AsyncStorage.removeItem('datosExtra');
              await AsyncStorage.removeItem('tipoUnidad');
              
              if (navigation?.reset) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'DistributorPage' }],
                });
              } else {
                console.warn('navigation.reset no está disponible');
              }
            } catch (error) {
              console.error('Error al terminar turno:', error);
              Alert.alert('Error', 'No se pudo terminar el turno. Intenta de nuevo.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const fetchPackages = async () => {
    // Cancelar solicitud anterior si existe

    console.log("prueba unidadId: " + unidadId)
    if (fetchPackagesController.current) {
      fetchPackagesController.current.abort();
    }

    // Crear nuevo controlador
    fetchPackagesController.current = new AbortController();

    try {
      setLoading(true);

      const response = await axios.get(
        `http://${IP}:3000/api/envios/unidad/${unidadId}/hoy`,
        {
          signal: fetchPackagesController.current.signal,
          timeout: 10000 // 10 segundos timeout
        }
      );


      // Verificar si el componente sigue montado
      if (!isMountedRef.current) return;

      const packagesData = response.data;

      // Validar que los datos sean un arreglo
      if (!Array.isArray(packagesData)) {
        throw new Error('La respuesta de la API no es un arreglo');
      }

      // Filtrar paquetes válidos
      const validPackages = packagesData.filter((pkg: Package) => {
        const lat = parseFloat(pkg.lat);
        const lng = parseFloat(pkg.lng);
        const isLatValid = !isNaN(lat) && lat >= -90 && lat <= 90;
        const isLngValid = !isNaN(lng) && lng >= -180 && lng <= 180;

        return (
          pkg &&
          typeof pkg.id === 'string' &&
          typeof pkg.estado_envio === 'string' &&
          typeof pkg.numero_de_rastreo === 'string' &&
          typeof pkg.calle === 'string' &&
          typeof pkg.asentamiento === 'string' &&
          typeof pkg.codigo_postal === 'string' &&
          typeof pkg.localidad === 'string' &&
          typeof pkg.estado === 'string' &&
          typeof pkg.pais === 'string' &&
          typeof pkg.destinatario === 'string' &&
          isLatValid &&
          isLngValid
        );
      });

      setPackages(validPackages);

      // Calcular estadísticas
      updatePackageStats(validPackages);

      // Generar coordenadas para paquetes pendientes
      const coordsForRoute: LatLng[] = validPackages
        .map((pkg: Package) => ({
          latitude: parseFloat(pkg.lat),
          longitude: parseFloat(pkg.lng),
        }))
        .filter(coord => !isNaN(coord.latitude) && !isNaN(coord.longitude));

      setIntermediates(coordsForRoute);

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Solicitud de paquetes cancelada');
        return;
      }

      console.error('Error al obtener paquetes:', error);

      if (isMountedRef.current) {
        Alert.alert('Error', 'No se pudieron cargar los paquetes');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const updatePackageStats = (packagesData: Package[]) => {
    const total = packagesData.length;
    const entregados = packagesData.filter((pkg: Package) =>
      typeof pkg.estado_envio === 'string' && pkg.estado_envio === 'entregado'
    ).length;
    const fallidos = packagesData.filter((pkg: Package) =>
      typeof pkg.estado_envio === 'string' && pkg.estado_envio === 'fallido'
    ).length;

    setPaquetesTotal(total);
    setPaquetesEntregados(entregados);
    setPaquetesFallidos(fallidos);
  };

  // Efecto para cálculo de ruta con debounce
  React.useEffect(() => {
    if (userLocation && packages.length > 0) {
      // Generar coordenadas para TODOS los paquetes
      const allCoords: LatLng[] = packages.map(pkg => ({
        latitude: parseFloat(pkg.lat),
        longitude: parseFloat(pkg.lng),
      }));
      
      setIntermediates(allCoords);
      
      const now = Date.now();
      
      if (!routeInitialized) {
        // Primera vez - calcular inmediatamente
        calculateRoute(userLocation, destination, allCoords);
        setRouteInitialized(true);
      } else if (now - lastRouteCalculation.current > ROUTE_DEBOUNCE_MS) {
        // Verificar si está fuera de ruta con debounce
        if (isOffRoute(userLocation, routePoints)) {
          console.log("Recalculando ruta, fuera del camino...");
          calculateRoute(userLocation, destination, allCoords);
        }
      }
    }
  }, [userLocation, destination, packages, routeInitialized, routePoints]);

  const setupLocationTracking = async () => {
    // Prevenir múltiples configuraciones simultáneas
    if (locationSetupInProgress.current) return;
    locationSetupInProgress.current = true;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permisos de ubicación denegados');
        return;
      }

      // Limpiar suscripción anterior si existe
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 15000, // Reducir frecuencia a 15 segundos
          distanceInterval: 20, // Aumentar distancia mínima
        },
        (location) => {
          if (isMountedRef.current) {
            const newLoc = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            setUserLocation(newLoc);
          }
        }
      );
    } catch (error) {
      console.error('Error configurando ubicación:', error);
    } finally {
      locationSetupInProgress.current = false;
    }
  };

  const calculateRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
    // Prevenir múltiples cálculos simultáneos
    if (isRecalculating) return;

    // Cancelar solicitud anterior
    if (routeController.current) {
      routeController.current.abort();
    }

    // Crear nuevo controlador
    routeController.current = new AbortController();

    setIsRecalculating(true);
    lastRouteCalculation.current = Date.now();

    try {
      const response = await axios.post(
        `http://${IP}:3000/api/routes`,
        {
          origin,
          destination,
          intermediates,
        },
        {
          signal: routeController.current.signal,
          timeout: 15000 // 15 segundos timeout
        }
      );

      

      if (!isMountedRef.current) return;

      const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;
      const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;
      console.log("optimizedOrder from API:", optimizedOrder);

      console.log("optimizedOrder from API:", optimizedOrder);
      console.log("intermediates (input):", intermediates);

      let orderedPoints: LatLng[] = [];

      if (optimizedOrder.length === 1 && optimizedOrder[0] === -1 && intermediates.length === 1) {
        // Caso especial: solo hay un paquete y el API devolvió -1
        console.log("Solo un punto, sin optimización. Usando intermediates directamente.");
        orderedPoints = intermediates;
      } else {
        // Filtramos cualquier índice inválido (-1 o fuera de rango)
        orderedPoints = optimizedOrder
          .map((i: number) => intermediates[i])
          .filter((point): point is LatLng => point !== undefined);
      }

      setOptimizedIntermediates(orderedPoints);


      const points = decodePolyline(encodedPolyline);
      setRoutePoints(points);

    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Solicitud de ruta cancelada');
        return;
      }

      console.error('Error calculando ruta:', error);

      if (isMountedRef.current) {
        Alert.alert('Error', 'No se pudo calcular la ruta. Revisa tu conexión.');
      }
    } finally {
      if (isMountedRef.current) {
        setIsRecalculating(false);
      }
    }
  };

  function getDistanceMeters(p1: LatLng, p2: LatLng): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // Radio de la tierra en metros
    const dLat = toRad(p2.latitude - p1.latitude);
    const dLng = toRad(p2.longitude - p1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(p1.latitude)) *
      Math.cos(toRad(p2.latitude)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function isOffRoute(userLoc: LatLng, route: LatLng[], threshold = 150): boolean {
    if (!route || route.length === 0) return true;
    return !route.some(point => getDistanceMeters(userLoc, point) <= threshold);
  }

  const getPackageRouteIndex = (packageItem: Package): number => {
    const orderedPackages = getOrderedPackages();
    const packageIndex = orderedPackages.findIndex(pkg => pkg.id === packageItem.id);
    return packageIndex >= 0 ? packageIndex + 1 : 0;
  };



  const renderPackageItem = ({ item }: { item: Package }) => {
    const routeIndex = getPackageRouteIndex(item);

    return (
      <TouchableOpacity
        style={styles.packageItem}
        onPress={() => {
          if (item.estado_envio && item.estado_envio !== 'entregado' && item.estado_envio !== 'fallido') {
            // Mapear el objeto del paquete al formato que espera PackageScreen
            const packageForScreen = {
              id: item.id,
              numero_guia: item.numero_de_rastreo,
              estatus: item.estado_envio,
              latitud: parseFloat(item.lat),
              longitud: parseFloat(item.lng),
              fecha_creacion: new Date().toISOString(), // No hay fecha de creación, se usa la actual
              indicaciones: item.referencia || 'No hay indicaciones especiales.',
              calle: `${item.calle} ${item.numero || ''}${item.numero_interior ? ` Int. ${item.numero_interior}` : ''}`.trim(),
              colonia: item.asentamiento,
              cp: item.codigo_postal,
              destinatario: item.destinatario,
            };
            navigation?.navigate('PackageScreen', { package: packageForScreen });
          }
        }}
      >
        <View style={styles.packageHeader}>
          <View style={styles.packageIconContainer}>
            <Text style={styles.routeNumber}>{routeIndex > 0 ? routeIndex : '?'}</Text>
          </View>

          <View style={styles.packageInfo}>
            <Text style={styles.packageSku} numberOfLines={1}>Guia: {item.numero_de_rastreo}</Text>
          </View>

          <View style={styles.packageStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado_envio || 'desconocido') }]}>
              <Text style={styles.statusText}>{getStatusText(item.estado_envio || 'Desconocido')}</Text>
            </View>
          </View>
          
        </View>

        <View style={styles.packageAddress}>
          <MapPin color="#666" size={moderateScale(16)} />
          <Text style={styles.addressText} numberOfLines={2}>
            {item.calle} {item.numero}{item.numero_interior ? ` Int. ${item.numero_interior}` : ''}, {item.asentamiento}
          </Text>
        </View>

        <Text
          style={styles.packageInstructions}
          numberOfLines={2}
        >
          {item.referencia && item.referencia.trim() !== '' 
            ? item.referencia 
            : 'No hay referencias'}
        </Text>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status){
      case 'entregado':
        return '#4CAF50';
      case 'fallido':
        return '#F44336';
      case 'pendiente':
        return '#FF9800';
      case 'en_ruta':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'Entregado';
      case 'fallido':
        return 'Fallido';
      case 'pendiente':
        return 'Pendiente';
      case 'en_ruta':
        return 'En Ruta';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getOrderedPackages = (): Package[] => {
    if (optimizedIntermediates.length === 0 || packages.length === 0) {
      return packages;
    }

    const orderedPackages: Package[] = [];

    // Para cada coordenada optimizada, encontrar el paquete correspondiente
    optimizedIntermediates.forEach(optimizedCoord => {
      const matchingPackage = packages.find(pkg =>
        Math.abs(parseFloat(pkg.lat) - optimizedCoord.latitude) < 0.0001 &&
        Math.abs(parseFloat(pkg.lng) - optimizedCoord.longitude) < 0.0001
      );

      if (matchingPackage && !orderedPackages.includes(matchingPackage)) {
        orderedPackages.push(matchingPackage);
      }
    });

    // Agregar cualquier paquete que no se haya incluido
    packages.forEach(pkg => {
      if (!orderedPackages.includes(pkg)) {
        orderedPackages.push(pkg);
      }
    });

    return orderedPackages;
  };

  const PackagesList = React.memo(() => {
    const orderedPackages = getOrderedPackages();

    return (
      <View style={styles.packagesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando paquetes...</Text>
          </View>
        ) : (
          <FlatList
            data={orderedPackages}
            renderItem={renderPackageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.packagesList}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchPackages}
          />
        )}
      </View>
    );
  });

  const renderScene = SceneMap({
    mapa: () =>
      userLocation && routePoints.length > 0 ? (
        <RoutesMapView
          userLocation={userLocation}
          destination={destination}
          optimizedIntermediates={optimizedIntermediates}
          routePoints={routePoints}
          packages={packages}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando mapa...</Text>
        </View>
      ),
    lista: PackagesList,
  });

  const paquetesRestantes = paquetesTotal - paquetesEntregados - paquetesFallidos;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.packagesAndUserContainer}>
          <Text style={styles.packagesText}>
            {paquetesRestantes} paquetes restantes
          </Text>
          <TouchableOpacity style={styles.userButton} onPress={handleTerminarTurno}>
            <LogOut color="white" size={moderateScale(20)} />
          </TouchableOpacity>
        </View>

        <View style={styles.packetCounterContainer}>
          <View style={styles.packetCounterItemLeft}>
            <Text style={styles.counterText}>
              <Text style={styles.counterNumber}>{paquetesEntregados}</Text> entregados
            </Text>
          </View>
          <View style={styles.packetCounterItemRight}>
            <Text style={styles.counterText}>
              <Text style={styles.counterNumber}>{paquetesFallidos}</Text> entregas fallidas
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <ProgressBar
            progress={paquetesTotal > 0 ? (paquetesEntregados + paquetesFallidos) / paquetesTotal : 0}
            color="#fff"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {paquetesTotal > 0 ? Math.round(((paquetesEntregados + paquetesFallidos) / paquetesTotal) * 100) : 0}% completado
          </Text>
        </View>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            activeColor="white"
            inactiveColor="#FFB3D9"
            labelStyle={styles.tabLabel}
            pressColor="rgba(255, 255, 255, 0.2)"
          />
        )}
      />
    </View>
  );
}

function decodePolyline(encoded: string): LatLng[] {
  let index = 0, lat = 0, lng = 0, coordinates: LatLng[] = [];

  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0; result = 0;
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
  },
  headerContainer: {
    paddingTop: moderateScale(40),
    backgroundColor: '#DE1484',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(12),
  },
  packagesAndUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
  },
  packagesText: {
    fontWeight: '700',
    color: 'white',
    fontSize: moderateScale(20),
  },
  userButton: {
    padding: moderateScale(6),
    borderRadius: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  packetCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(8),
  },
  packetCounterItemLeft: {
    paddingRight: moderateScale(12),
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  packetCounterItemRight: {
    paddingLeft: moderateScale(12),
  },
  counterText: {
    fontWeight: '400',
    color: 'white',
    fontSize: moderateScale(14),
  },
  counterNumber: {
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressText: {
    color: 'white',
    fontSize: moderateScale(11),
    marginTop: moderateScale(6),
    fontWeight: '500',
  },
  tabBar: {
    backgroundColor: '#DE1484',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#fff',
    height: 3,
    borderRadius: moderateScale(2),
  },
  tabLabel: {
    fontWeight: '600',
    textTransform: 'none',
    fontSize: moderateScale(14),
  },
  packagesContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  packagesList: {
    padding: moderateScale(16),
  },
  packageItem: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(12),
  },
  packageIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFE8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  packageInfo: {
    flex: 1,
  },
  packageSku: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: '#333',
    marginBottom: moderateScale(4),
  },
  packageGuia: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  packageStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statusText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  packageAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScale(8),
  },
  addressText: {
    flex: 1,
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: '#666',
    lineHeight: moderateScale(20),
  },
  packageInstructions: {
    fontSize: moderateScale(14),
    color: '#888',
    fontStyle: 'italic',
    marginTop: moderateScale(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: '#666',
  },
  routeNumber: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#DE1484',
  },
});