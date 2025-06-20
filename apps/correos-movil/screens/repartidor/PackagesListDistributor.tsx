import * as React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, useWindowDimensions } from 'react-native'
import { User } from 'lucide-react-native'
import { ProgressBar } from 'react-native-paper'
import { moderateScale } from 'react-native-size-matters'
import * as Location from 'expo-location';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import RoutesMapView from './RoutesMapView'
import RoutesListView from './RoutesListView'
import { LatLng } from 'react-native-maps';
import Constants from 'expo-constants';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const IP = Constants.expoConfig?.extra?.IP_LOCAL;
console.log("IP: " + IP)

export default function PackagesListDistributor() {

  const [paquetesTotal, setPaquetesTotal] = React.useState(89);
  const [paquetesEntregados, setPaquetesEntregados] = React.useState(50);
  const [paquetesFallidos, setPaquetesFallidos] = React.useState(1);

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
    (async () => {
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
    })();
  }, []);

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

  const renderScene = SceneMap({
    mapa: () => (
      <RoutesMapView
        userLocation={userLocation}
        destination={destination}
        optimizedIntermediates={optimizedIntermediates}
        routePoints={routePoints}
      />
    ),
    lista: () => <RoutesListView optimizedIntermediates={optimizedIntermediates} />,
  });

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <View style={styles.packagesAndUserContainer}>
                <Text style={styles.packagesText}>{paquetesTotal - paquetesEntregados - paquetesFallidos} paquetes restantes</Text>
                <TouchableOpacity>
                  <User color={"white"} size={moderateScale(24)}/>
                </TouchableOpacity>
            </View>

            <View style={styles.packetCounterContainer}>
                <View style={styles.packetCounterItemLeft}>
                  <Text style={{fontWeight: 400, color: "white", fontSize: moderateScale(16)}}><Text style={{fontWeight: 700, color: "white", fontSize: moderateScale(16)}}>{paquetesEntregados}</Text> entregados</Text>
                </View>
                <View style={styles.packetCounterItemRight}>
                    <Text style={{fontWeight: 400, color: "white", fontSize: moderateScale(16)}}><Text style={{fontWeight: 700, color: "white", fontSize: moderateScale(16)}}>{paquetesFallidos}</Text> entregas fallidas</Text>
                </View>
            </View>

            <View>
                <ProgressBar progress={(1/paquetesTotal)*(paquetesEntregados + paquetesFallidos)} color='#eb636b'/>
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
              indicatorStyle={{ backgroundColor: '#fff', height: 4 }}
              style={{ backgroundColor: '#DE1484' }}
              activeColor="white"
              inactiveColor="#aaa"
              labelStyle={{ fontWeight: 'bold', textTransform: 'none' }}
              pressColor="#fff"
            />
          )}
        />
    </View>
  )
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
    width: screenWidth,
    height: screenHeight,
  },
  headerContainer: {
    paddingTop: moderateScale(52),
    backgroundColor: "#DE1484",
    paddingHorizontal: moderateScale(12),
    paddingBottom: moderateScale(12)
  },
  packagesAndUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: moderateScale(12)
  },
  packagesText: {
    fontWeight: 700,
    color: "white",
    fontSize: moderateScale(20)
  },
  packetCounterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: moderateScale(12)
  },
  packetCounterItemLeft: {
    paddingRight: moderateScale(8),
    borderRightWidth: 2,
    borderColor: "white"
  },
  packetCounterItemRight: {
    paddingLeft: moderateScale(8),
  }
})