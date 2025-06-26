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

  const [intermediates] = React.useState<LatLng[]>([
    { latitude: 24.03607544743889, longitude: -104.65042708051433 },
    { latitude: 24.030763356272793, longitude: -104.61984483069332 },
    { latitude: 24.026240946925842, longitude: -104.62899847198052 },
    { latitude: 24.03607544743889, longitude: -104.62899847198045 },
  ]);

  const [optimizedIntermediates, setOptimizedIntermediates] = React.useState<LatLng[]>([]);
  const [userLocation, setUserLocation] = React.useState<LatLng | null>(null);
  const [routePoints, setRoutePoints] = React.useState<LatLng[]>([]);

  React.useEffect(() => {
    fetchPackages();
    setupLocationTracking();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://${IP}:3000/api/asignacion-paquetes/paquetes/3e35a6e5-bf55-42b7-8f26-7a9f101838dd/c010bb71-4b19-4e56-bff3-f6c73061927a`
      );
      
      const packagesData = response.data;
      setPackages(packagesData);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('packages', JSON.stringify(packagesData));
      
      // Calcular estadísticas
      const total = packagesData.length;
      const entregados = packagesData.filter((pkg: Package) => pkg.estatus === 'entregado').length;
      const fallidos = packagesData.filter((pkg: Package) => pkg.estatus === 'fallido').length;
      
      setPaquetesTotal(total);
      setPaquetesEntregados(entregados);
      setPaquetesFallidos(fallidos);
      
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      Alert.alert('Error', 'No se pudieron cargar los paquetes');
      
      // Intentar cargar desde AsyncStorage
      try {
        const storedPackages = await AsyncStorage.getItem('packages');
        if (storedPackages) {
          const packagesData = JSON.parse(storedPackages);
          setPackages(packagesData);
          setPaquetesTotal(packagesData.length);
        }
      } catch (storageError) {
        console.error('Error al cargar desde storage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

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
        getRoute(newLoc, destination, intermediates);
      }
    );

    return () => subscription.remove();
  };

  const getRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
    try {
      const response = await axios.post(`http://${IP}:3000/api/routes`, {
        origin,
        destination,
        intermediates,
      });

      const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;
      const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;

      const orderedPoints = optimizedOrder.map((i: number) => intermediates[i]);
      setOptimizedIntermediates(orderedPoints);
      const points = decodePolyline(encodedPolyline);
      setRoutePoints(points);
    } catch (error) {
      console.error('Error al obtener la ruta:', error);
    }
  };

  const renderPackageItem = ({ item }: { item: Package }) => (
    <TouchableOpacity
      style={styles.packageItem}
      onPress={() => navigation?.navigate('PackageScreen', { package: item })}
    >
      <View style={styles.packageHeader}>
        <View style={styles.packageIconContainer}>
          <Package color="#DE1484" size={moderateScale(24)} />
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

  const PackagesList = () => (
    <View style={styles.packagesContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando paquetes...</Text>
        </View>
      ) : (
        <FlatList
          data={packages}
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
            <User color="white" size={moderateScale(24)} />
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
    paddingTop: moderateScale(52),
    backgroundColor: '#DE1484',
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  packagesAndUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(16),
  },
  packagesText: {
    fontWeight: '700',
    color: 'white',
    fontSize: moderateScale(22),
  },
  userButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  packetCounterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(16),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
  },
  packetCounterItemLeft: {
    paddingRight: moderateScale(16),
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  packetCounterItemRight: {
    paddingLeft: moderateScale(16),
  },
  counterText: {
    fontWeight: '400',
    color: 'white',
    fontSize: moderateScale(16),
  },
  counterNumber: {
    fontWeight: '700',
    fontSize: moderateScale(18),
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressText: {
    color: 'white',
    fontSize: moderateScale(12),
    marginTop: moderateScale(8),
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
    fontSize: moderateScale(16),
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
});