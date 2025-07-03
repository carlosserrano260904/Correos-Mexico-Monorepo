import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, useWindowDimensions, FlatList, Alert } from 'react-native'
import { User, Package, MapPin } from 'lucide-react-native'
import { ProgressBar } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters'
import * as Location from 'expo-location';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoutesMapView from './RoutesMapView'
import { LatLng } from 'react-native-maps';
import Constants from 'expo-constants';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

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

interface PackagesListDistributorProps {
  navigation?: any;
}

export default function PackagesListDistributor({ navigation }: PackagesListDistributorProps) {
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

  const [destination, setDestination] = React.useState<LatLng>({
    latitude: 24.009974534585247,
    longitude: -104.44447330485218,
  });

  const [intermediates, setIntermediates] = React.useState<LatLng[]>([]);
  const [optimizedIntermediates, setOptimizedIntermediates] = React.useState<LatLng[]>([]);
  const [userLocation, setUserLocation] = React.useState<LatLng | null>(null);
  const [routePoints, setRoutePoints] = React.useState<LatLng[]>([]);

  // Ref para rastrear solicitudes en curso y evitar concurrencia
  const fetchPackagesRequestId = React.useRef<number>(0);
  const routeRequestId = React.useRef<number>(0);

  React.useEffect(() => {
    fetchPackages();
    setupLocationTracking();
  }, []);

  const fetchPackages = async () => {
    // Incrementar ID de solicitud para cancelar solicitudes anteriores
    const currentRequestId = ++fetchPackagesRequestId.current;
    
    try {
      setLoading(true);
      const response = await axios.get(
        `http://${IP}:3000/api/asignacion-paquetes/paquetes/3e35a6e5-bf55-42b7-8f26-7a9f101838dd/c010bb71-4b19-4e56-bff3-f6c73061927a`
      );

      // Verificar si esta solicitud sigue siendo la más reciente
      if (currentRequestId !== fetchPackagesRequestId.current) {
        console.log('Solicitud de paquetes cancelada, hay una más reciente');
        return;
      }

      const packagesData = response.data;
      setPackages(packagesData);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('packages', JSON.stringify(packagesData));

      // Calcular estadísticas dinámicamente basado en el estatus
      const total = packagesData.length;
      const entregados = packagesData.filter((pkg: Package) =>
        pkg.estatus.toLowerCase() === 'entregado'
      ).length;
      const fallidos = packagesData.filter((pkg: Package) =>
        pkg.estatus.toLowerCase() === 'fallido'
      ).length;

      setPaquetesTotal(total);
      setPaquetesEntregados(entregados);
      setPaquetesFallidos(fallidos);

      // Generar coordenadas para paquetes que no están entregados ni fallidos
      const coordsForRoute: LatLng[] = packagesData
        .filter((pkg: Package) => 
          pkg.estatus.toLowerCase() !== 'entregado' && 
          pkg.estatus.toLowerCase() !== 'fallido'
        )
        .map((pkg: Package) => ({
          latitude: pkg.latitud,
          longitude: pkg.longitud,
        }));

      setIntermediates(coordsForRoute);

    } catch (error) {
        console.error('Error al obtener paquetes:', error);
        
        // Solo mostrar alerta si esta sigue siendo la solicitud más reciente
        if (currentRequestId === fetchPackagesRequestId.current) {
          Alert.alert('Error', 'No se pudieron cargar los paquetes');
        }

        // Intentar cargar desde AsyncStorage
        try {
          const storedPackages = await AsyncStorage.getItem('packages');
          if (storedPackages && currentRequestId === fetchPackagesRequestId.current) {
            const packagesData = JSON.parse(storedPackages);
            setPackages(packagesData);

            // Recalcular estadísticas desde storage
            const total = packagesData.length;
            const entregados = packagesData.filter((pkg: Package) =>
              pkg.estatus.toLowerCase() === 'entregado'
            ).length;
            const fallidos = packagesData.filter((pkg: Package) =>
              pkg.estatus.toLowerCase() === 'fallido'
            ).length;

            setPaquetesTotal(total);
            setPaquetesEntregados(entregados);
            setPaquetesFallidos(fallidos);
          }
        } catch (storageError) {
          console.error('Error al cargar desde storage:', storageError);
        }
    } finally {
      // Solo actualizar loading si esta es la solicitud más reciente
      if (currentRequestId === fetchPackagesRequestId.current) {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (userLocation && intermediates.length > 0) {
      // Solo calcula ruta si aún no se hizo
      if (!routeInitialized) {
        getRoute(userLocation, destination, intermediates);
        setRouteInitialized(true);
      } else if (isOffRoute(userLocation, routePoints)) {
        console.log("Recalculando ruta, fuera del camino...");
        getRoute(userLocation, destination, intermediates);
      }
    }
  }, [userLocation, destination, intermediates, routeInitialized, routePoints]);

  const setupLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      },
      (location) => {
        const newLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setUserLocation(newLoc);
      }
    );

    return () => subscription.remove();
  };

  const getRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
    // Evitar múltiples solicitudes simultáneas de ruta
    if (isRecalculating) return;
    
    const currentRequestId = ++routeRequestId.current;
    setIsRecalculating(true);

    try {
      const response = await axios.post(`http://${IP}:3000/api/routes`, {
        origin,
        destination,
        intermediates,
      });

      // Verificar si esta solicitud sigue siendo la más reciente
      if (currentRequestId !== routeRequestId.current) {
        console.log('Solicitud de ruta cancelada, hay una más reciente');
        return;
      }

      const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;
      const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;

      const orderedPoints = optimizedOrder.map((i: number) => intermediates[i]);
      setOptimizedIntermediates(orderedPoints);
      const points = decodePolyline(encodedPolyline);
      setRoutePoints(points);
    } catch (err) {
      // Solo mostrar alerta si esta sigue siendo la solicitud más reciente
      if (currentRequestId === routeRequestId.current) {
        Alert.alert('Error', 'No se pudo recalcular la ruta. Revisa tu conexión.');
      }
    } finally {
      // Solo actualizar estado si esta es la solicitud más reciente
      if (currentRequestId === routeRequestId.current) {
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

  function isOffRoute(userLoc: LatLng, route: LatLng[], threshold = 100): boolean {
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
        onPress={() => navigation?.navigate('PackageScreen', { package: item })}
      >
        <View style={styles.packageHeader}>
          <View style={styles.packageIconContainer}>
            <Text style={styles.routeNumber}>{routeIndex > 0 ? routeIndex : '?'}</Text>
          </View>
          <View style={styles.packageInfo}>
            <Text style={styles.packageSku}>SKU: {item.sku}</Text>
            <Text style={styles.packageGuia}>Guía: {item.numero_guia}</Text>
          </View>
          <View style={styles.packageStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estatus) }]}>
              <Text style={styles.statusText}>{item.estatus.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.packageAddress}>
          <MapPin color="#666" size={moderateScale(16)} />
          <Text style={styles.addressText} numberOfLines={2}>
            {item.calle}, {item.colonia}, CP {item.cp}
          </Text>
        </View>

        {item.indicaciones && (
          <Text style={styles.packageInstructions} numberOfLines={2}>
            {item.indicaciones}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#4CAF50';
      case 'fallido':
        return '#F44336';
      case 'pendiente':
        return '#FF9800';
      default:
        return '#9E9E9E';
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
        Math.abs(pkg.latitud - optimizedCoord.latitude) < 0.0001 &&
        Math.abs(pkg.longitud - optimizedCoord.longitude) < 0.0001
      );

      if (matchingPackage && !orderedPackages.includes(matchingPackage)) {
        orderedPackages.push(matchingPackage);
      }
    });

    // Agregar cualquier paquete que no se haya incluido (por si acaso)
    packages.forEach(pkg => {
      if (!orderedPackages.includes(pkg)) {
        orderedPackages.push(pkg);
      }
    });

    return orderedPackages;
  };

  const PackagesList = () => {
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
  };

  const renderScene = SceneMap({
    mapa: () => (
      <RoutesMapView
        userLocation={userLocation}
        destination={destination}
        optimizedIntermediates={optimizedIntermediates}
        routePoints={routePoints}
      />
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
          <TouchableOpacity style={styles.userButton}>
            <User color="white" size={moderateScale(20)} />
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