import React, { use, useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";
import { moderateScale } from "react-native-size-matters";
import { LogOut } from "lucide-react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapRouteView from "./MapRouteView";
import ListViewDistributor from "./ListViewDistributor";
import * as Location from 'expo-location';
import { LatLng } from "react-native-maps";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import axios from "axios";
import PackageCard from "../../components/DistributorComponents/PackageCard";

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

// Obtener la IP desde las variables de entorno
const IP = Constants.expoConfig?.extra?.IP_LOCAL;

// Definición de la interfaz para los paquetes
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


export default function MainLoadPackagesDistributor({navigation}: any) {
    // Ruta del stack de navegación
    const route = useRoute();
    // Estado para almacenar el id de la unidad
    const [unidadId, setUnidadId] = useState<string | null>(null);
    // Index para el TabView
    const [index, setIndex] = useState(0);
    // Ref para evitar múltiples configuraciones de ubicación
    const locationSetupInProgress = useRef(false);
    // Ref para almacenar la suscripción de ubicación
    const locationSubscription = useRef<Location.LocationSubscription | null>(null);
    // Ref para manejar el estado de montaje del componente
    const isMountedRef = React.useRef(true);
    // Estado para la ubicación del usuario
    const [userLocation, setUserLocation] = useState<LatLng | null>(null);
    // Ref para el controlador de abortar fetch
    const fetchPackagesController = React.useRef<AbortController | null>(null);
    // Estado para manejar la carga de datos
    const [loading, setLoading] = React.useState(true);
    // Estado para almacenar los paquetes
    const [packages, setPackages] = React.useState<Package[]>([]);
    // Estado para el conteo de paquetes
    const [paquetesTotales, setPaquetesTotales] = React.useState(0);
    // Estados para el conteo de paquetes entregados
    const [paquetesEntregados, setPaquetesEntregados] = React.useState(0);
    // Estado para el conteo de paquetes fallidos
    const [paquetesFallidos, setPaquetesFallidos] = React.useState(0);
    // Estado para las coordenadas de los paquetes
    const [intermediatePoints, setIntermediatePoints] = useState<LatLng[]>([]);
    // Estado para la ubicación del destino
    const [destination, setDestination] = useState<LatLng | null>(null);
    // Estado para las paradas intermedias optimizadas
    const [optimizedIntermediates, setOptimizedIntermediates] = useState<LatLng[]>([]);
    // Estado para los puntos de la ruta
    const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
    // Estado para manejar si se está recalculando la ruta
    const [isRecalculatingRoute, setIsRecalculatingRoute] = useState(false);
    // Ref para el controlador de abortar el cálculo de la ruta
    const routeController = useRef<AbortController | null>(null);
    // Estado para indicar si la ruta ha sido inicializada
    const [routeInitialized, setRouteInitialized] = useState(false);
    // Estado para almacenar la fecha y hora del último cálculo de ruta
    const [lastRouteCalculation, setLastRouteCalculation] = useState<Date | null>(null);
    // Rutas a las que apunta el TabView 
    const [routes] = React.useState([
        { key: 'first', title: 'Mapa' },
        { key: 'second', title: 'Paquetes' },
    ]);


    useEffect(() => {
        // Función para inicializar el id de la unidad
        const initUnidadId = async () => {
            isMountedRef.current = true;
            // Verificar si el parámetro unidadId está presente en la ruta
            if (route.params?.unidadId) {
                // Si está presente, actualizar el estado y almacenarlo en AsyncStorage
                setUnidadId(route.params.unidadId);
                // almacenar en AsyncStorage
                await AsyncStorage.setItem('unidadId', route.params.unidadId);
            } else {
                // Si no está presente, intentar obtenerlo de AsyncStorage
                const storedUnidadId = await AsyncStorage.getItem('unidadId');
                // Si se encuentra en AsyncStorage, actualizar el estado
                if (storedUnidadId) {
                    // Actualizar el estado solo si el componente sigue montado
                    if (!isMountedRef.current) return;
                    setUnidadId(storedUnidadId);
                    // Si no se encuentra en AsyncStorage, mostrar una advertencia
                } else {
                    console.warn('No se encontró unidadId en los parámetros ni en AsyncStorage');
                }
            }
        };
        // Iniciar la función para obtener el id de la unidad
        initUnidadId();
        // Limpiar el estado de montaje al desmontar el componente
        return () => { isMountedRef.current = false; };
        // Ejecutar este efecto cada vez que cambien los parámetros de la ruta
    }, [route.params]);

    // Efecto para obtener los paquetes cuando cambia el id de la unidad
    useEffect(() => {
        // Si se tiene el id de la unidad, obtener los paquetes asignados
        if (unidadId) {
            fetchPackages(unidadId);
        }
    }, [unidadId]);

    // Efecto para configurar el seguimiento de ubicación al montar el componente
    useEffect(() => {
        // Establecer el seguimiento de la ubicación cuando el componente se monta
        setupLocationTracking();
        
        // Limpiar la suscripción de ubicación al desmontar el componente
        return () => {
            if (locationSubscription.current) {
            locationSubscription.current.remove();
        }
        };
    }, []);

    useEffect(() => {
        // Funcion para obtener las coordenadas de la oficina asociada a la unidad
        const fetchOficinaCoords = async (unidadId: string) => {
            if (!unidadId) return;

            try {
                // Petición GET a la API con un timeout de 10 segundos
                const response = await axios.get(`http://${IP}:3000/api/unidades/${unidadId}`, { timeout: 10000 });
                // Si el componente ya no está montado, salir
                if (!isMountedRef.current) return;
                // Extraer las coordenadas de la oficina de la respuesta
                const unidad = response.data;

                // Si la unidad y su oficina existen, actualizar el estado de destino
                if (unidad && unidad.oficina && unidad.oficina.latitud && unidad.oficina.longitud) {
                    const oficinaCoords = {
                        latitude: parseFloat(unidad.oficina.latitud),
                        longitude: parseFloat(unidad.oficina.longitud),
                    };

                    console.log('Coordenadas de la oficina obtenidas:', oficinaCoords);
                    // Actualizar el estado de destino
                    setDestination(oficinaCoords);
                    // Si la oficina no tiene coordenadas válidas, mostrar una advertencia
                } else {
                    console.warn('La unidad no tiene coordenadas de oficina válidas');
                }
                // Manejar errores en la solicitud
            } catch (error) {
                console.error('Error al obtener las coordenadas de la oficina:', error);
            }
        };

        // Si se tiene el id de la unidad, obtener las coordenadas de la oficina
        if (unidadId) {
            fetchOficinaCoords(unidadId);
        }
    }, [unidadId]);

    useEffect(() => {
        // Si se tiene la ubicación del usuario, los paquetes y el destino, calcular la ruta
        if (userLocation && packages.length > 0 && destination) {
            // Extraer las coordenadas de los paquetes
            const allCoords: LatLng[] = packages.map(pkg => ({
                latitude: parseFloat(pkg.lat),
                longitude: parseFloat(pkg.lng), 
            }));

            // Actualizar el estado de los puntos intermedios
            setIntermediatePoints(allCoords);

            // Obtener la fecha y hora actual
            const now = new Date();
            
            // Condiciones para recalcular la ruta
            if (!routeInitialized || !lastRouteCalculation || (now.getTime() - lastRouteCalculation.getTime()) > 5 * 60 * 1000 || isOffRoute(userLocation, routePoints)) {
                // Calcular la ruta optimizada
                calculateRoute(userLocation, destination, allCoords);
                // Establecer que la ruta ha sido inicializada
                setRouteInitialized(true);
                // Actualizar la fecha y hora del último cálculo de ruta
                setLastRouteCalculation(new Date());
                // Si la ruta ya fue inicializada, pero han pasado más de 5 minutos o el usuario está fuera de la ruta
            } else if (isOffRoute(userLocation, routePoints)) {
                // Recalcular la ruta optimizada
                calculateRoute(userLocation, destination, allCoords);
                // Actualizar la fecha y hora del último cálculo de ruta
                setLastRouteCalculation(new Date());
            }
        }
        // Ejecutar este efecto cuando cambien la ubicación del usuario, los paquetes, el destino, la inicialización de la ruta o el último cálculo de ruta
    }, [userLocation, packages, destination, routePoints, routeInitialized, lastRouteCalculation]);


    // Función para manejar el cierre de turno
    const handleTerminarTurno = () => {
        // Mostrar una alerta de confirmación
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
            // Cuando se confirme, limpiar AsyncStorage y navegar a DistributorPage
            onPress: async () => {
            try {
                // Eliminar los datos relacionados con el turno y la unidad de AsyncStorage
                await AsyncStorage.removeItem('turno_activo');
                await AsyncStorage.removeItem('sucursal');
                await AsyncStorage.removeItem('unidadId');
                await AsyncStorage.removeItem('datosExtra');
                await AsyncStorage.removeItem('tipoUnidad');
                
                // Navegar a la pantalla DistributorPage y resetear el stack de navegación
                if (navigation?.reset) {
                    navigation.reset({
                    index: 0,
                    routes: [{ name: 'DistributorPage' }],
                    });
                } else {
                    console.warn('navigation.reset no está disponible');
                }
                  // Intentar atrapar cualquier error
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
    

    // Funcion para configurar el seguimiento de ubicación del usuario
    const setupLocationTracking = async () => {
        // Validacion de que no se este ya configurando la ubicacion
        if (locationSetupInProgress.current) return;
        locationSetupInProgress.current = true;
        
        
        try {
            // Solicitar permisos de ubicación
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se requieren permisos de ubicación para esta función.');
                return;
            }
            
            // Si existe una suscripción previa, eliminarla
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }

            // Suscribirse a actualizaciones de ubicación
            locationSubscription.current = await Location.watchPositionAsync(
                { 
                    // Usar alta precisión para mejor exactitud
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 20, //cada 10 metros
                },
                // Callback para manejar la nueva ubicación
                (location) => {
                    if (isMountedRef.current) {
                        const newLocation = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        };
                        // Actualizar el estado con la nueva ubicación
                        setUserLocation(newLocation);
                    }   
                }
            );
            // Manejar errores potenciales
        } catch (error) {
            console.error('Error al configurar el seguimiento de ubicación:', error);
            Alert.alert('Error', 'No se pudo configurar el seguimiento de ubicación.');
            // Asegurarse de que la bandera se reinicie en caso de error
        } finally {
            locationSetupInProgress.current = false;
        }
    };

    // Función para obtener los paquetes asignados a la unidad
    const fetchPackages = async (unidadId: string) => {
        // Abortar cualquier fetch en curso
        if (fetchPackagesController.current) {
            fetchPackagesController.current.abort();
        }
        // Crear un nuevo controlador de abortar para esta solicitud
        fetchPackagesController.current = new AbortController();

        // Realizar la solicitud para obtener los paquetes
        try {
            // Indicar que se está cargando
            setLoading(true);
            // Petición GET a la API con un timeout de 10 segundos
            const response = await axios.get(`http://${IP}:3000/api/envios/unidad/${unidadId}/hoy`,
            { signal: fetchPackagesController.current.signal, timeout: 10000 } // Timeout de 10 segundos
            );
            // Si el componente ya no está montado, salir
            if (!isMountedRef.current) return;
            // Actualizar el estado con los datos recibidos
            const packagesData: Package[] = response.data;
            // Validar que la respuesta es un array
            if(!Array.isArray(packagesData)){
                throw new Error('La respuesta de la API no es un array');
            }

            // Filtrar paquetes con coordenadas inválidas
            const validPackages = packagesData.filter((pkg: Package) => {
                // Validar que lat y lng son números y están en rangos válidos
                const lat = parseFloat(pkg.lat);
                const lng = parseFloat(pkg.lng);
                const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
                const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
                // Regresar true solo si ambas coordenadas son válidas
                return {
                    pkg,
                    isValidLat,
                    isValidLng
                };
            }   );

            // Actualizar el estado con los paquetes válidos
            setPackages(validPackages);
            // Actualizar las estadísticas de los paquetes
            updatePackageStats(validPackages);
            // Extraer las coordenadas de los paquetes válidos
            const coordsForRoute: LatLng[] = validPackages.map(pkg => ({
                latitude: parseFloat(pkg.lat),
                longitude: parseFloat(pkg.lng),
            }));
            // Actualizar el estado de las coordenadas de los paquetes
            setIntermediatePoints(coordsForRoute);
            // Indicar que la carga ha terminado
            setLoading(false);
            // Manejar errores en la solicitud
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Solicitud de paquetes abortada');
            } else {
                console.error('Error al obtener los paquetes:', error);
                if (isMountedRef.current) {
                    Alert.alert('Error', 'No se pudieron cargar los paquetes. Intenta de nuevo.');
                    setLoading(false);
                }
            }
        }
    };

    const updatePackageStats = (packagesData: Package[]) => {
        // Calcular el total de paquetes
        const total = packagesData.length;
        // Calcular el número de paquetes entregados
        const entregados = packagesData.filter(pkg => pkg.estado_envio === 'entregado').length;
        // Calcular el número de paquetes con entrega fallida
        const fallidos = packagesData.filter(pkg => pkg.estado_envio === 'fallido').length;
        // Actualizar los estados correspondientes
        setPaquetesTotales(total);
        setPaquetesEntregados(entregados);
        setPaquetesFallidos(fallidos);
    };

    // Función para calcular la ruta optimizada
    const calculateRoute = async (origin: LatLng, destination: LatLng, intermediates: LatLng[]) => {
        if (isRecalculatingRoute) return; // Evitar múltiples cálculos simultáneos

        // Abortar cualquier cálculo de ruta en curso
        if (routeController.current) {
            routeController.current.abort();
        }

        // Crear un nuevo controlador de abortar para esta solicitud
        routeController.current = new AbortController();

        // Indicar que se está recalculando la ruta
        setIsRecalculatingRoute(true);

        try {
            // Petición POST a la API con un timeout de 15 segundos
            const response = await axios.post(`http://${IP}:3000/api/routes`, {
                origin,
                destination,
                intermediates,
            }, { signal: routeController.current.signal, timeout: 15000 }); // Timeout de 15 segundos
            // Si el componente ya no está montado, salir
            if (!isMountedRef.current) return;
            // Extraer los datos de la respuesta
            const encodedPolyline = response.data.routes[0].polyline.encodedPolyline;
            const optimizedOrder = response.data.routes[0].optimizedIntermediateWaypointIndex;

            // Decodificar la polilínea y actualizar los estados correspondientes
            let orderedPoints: LatLng[] = [];
            
            // Manejar el caso especial donde solo hay un punto intermedio y no se optimiza
            if (optimizedOrder.length === 1 && optimizedOrder[0] === -1 && intermediates.length === 1) {
                orderedPoints = intermediates;
            } else {
                // Reordenar los puntos intermedios según el orden optimizado
                orderedPoints = optimizedOrder.map((index: number) => intermediates[index]).filter((point: LatLng | null) => point !== null);
            }

            // Actualizar los estados con los puntos optimizados y la ruta decodificada
            setOptimizedIntermediates(orderedPoints);


            // Puntos de la ruta
            const points = decodePolyline(encodedPolyline);
            // Actualizar los puntos de la ruta
            setRoutePoints(points);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Cálculo de ruta abortado');
            } else {
                console.error('Error al calcular la ruta:', error);
                if (isMountedRef.current) {
                    Alert.alert('Error', 'No se pudo calcular la ruta. Intenta de nuevo.');
                }
            }
        } finally {
            if (isMountedRef.current) {
                setIsRecalculatingRoute(false);
            }   
        }
    };

    // Funcion para calcular la distancia entre dos puntos
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
    
    // Funcion para determinar si el usuario esta fuera de la ruta
    function isOffRoute(userLoc: LatLng, route: LatLng[], threshold = 150): boolean {
        if (!route || route.length === 0) return true;
        return !route.some(point => getDistanceMeters(userLoc, point) <= threshold);
    }

    // Escenas para el TabView
    const renderScene = SceneMap({
        first: () => 
        <MapRouteView userLocation={userLocation} 
            destination={destination} 
            optimizedIntermediates={optimizedIntermediates} 
            routePoints={routePoints}
            packages={packages}/>,
        
        second: () => <PackageCard packages={packages} optimizedIntermediates={optimizedIntermediates} />,
    });
    
return (
    <View>
        <View style={styles.remainingPackegesContainer}>
            <Text style={styles.remainingPackagesText}>{paquetesTotales} paquetes restantes</Text>
            <TouchableOpacity style={styles.logOutButton} onPress={handleTerminarTurno}>
                <LogOut color="white" size={moderateScale(16)} strokeWidth={3}/>
            </TouchableOpacity>
        </View>

        <View style={styles.deliveriesContainer}>
            <View style={styles.deliveriesTextContainer}>
                <Text style={styles.deliveredText}>{paquetesEntregados} entregados</Text>
                <Text style={styles.separationText}>|</Text>
                <Text style={styles.failedText}>{paquetesFallidos} entregas fallidas</Text>
            </View>
        </View>

        <View style={styles.progressBarContainer}>
            <ProgressBar progress={(1/((paquetesTotales)/(paquetesEntregados + paquetesFallidos)))} color='rgba(252, 135, 211, 1)' style={{height: moderateScale(8), borderRadius: moderateScale(100)}} />
            <Text style={styles.progressBarText}>{100/((paquetesTotales)/(paquetesEntregados + paquetesFallidos)) | 0}% completado</Text>
        </View>

        <View style={styles.tabViewContainer}>
            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: screenWidth }}
                renderTabBar={props =>
                    <TabBar 
                        {...props}
                        indicatorStyle={{ backgroundColor: 'white' }}
                        style={{ backgroundColor: '#DE1484' }}
                    />
                }
            />
        </View>

    </View>
)
}

// Función para decodificar una polilínea codificada en formato Google Maps
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
    remainingPackegesContainer: {
        paddingHorizontal: moderateScale(20),
        backgroundColor: '#DE1484',
        paddingTop: moderateScale(48),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: moderateScale(12),
    },
    logOutButton: {
        padding: moderateScale(8),
        borderRadius: moderateScale(100),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    remainingPackagesText: {
        color: 'white',
        fontWeight: '700',
        fontSize: moderateScale(18),
        fontFamily: 'system-ui',
    },
    deliveriesContainer: {
        paddingHorizontal: moderateScale(20),
        backgroundColor: '#DE1484',
    },
    deliveriesTextContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: moderateScale(100),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: moderateScale(12),
        padding: moderateScale(12),
    },
    deliveredText: {
        color: 'white',
        fontWeight: '700',
        fontSize: moderateScale(14),
        fontFamily: 'system-ui',
    },
    failedText: {
        color: 'white',
        fontWeight: '700',
        fontSize: moderateScale(14),    
        fontFamily: 'system-ui',
    },
    separationText:{
        color: 'white',
        fontWeight: '700',
        fontSize: moderateScale(14),
        fontFamily: 'system-ui',
    },
    progressBarContainer: {
        paddingHorizontal: moderateScale(20),
        backgroundColor: '#DE1484',
        paddingVertical: moderateScale(12),
    },
    progressBarText: {
        color: 'white',
        fontWeight: '500',
        fontSize: moderateScale(12),
        fontFamily: 'system-ui',
        marginTop: moderateScale(8),
        textAlign: 'center'
    },
    tabViewContainer: {
        height: screenHeight,
    }
})
