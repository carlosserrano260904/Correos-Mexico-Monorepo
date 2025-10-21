import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import MapView, { LatLng, Marker, Polyline} from "react-native-maps";
import { Store } from "lucide-react-native";
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height

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
}

export default function MapRouteView({
    // Definición de las props que recibe el componente
    userLocation, 
    destination, 
    optimizedIntermediates, 
    routePoints, 
    packages}: 
    {
        // Tipado de las props
        userLocation: LatLng | null;
        destination: LatLng | null; 
        optimizedIntermediates: LatLng[]; 
        routePoints: LatLng[]; 
        packages: Package[]
    }) { 
    // Si no se tiene la ubicación del usuario, mostrar un mensaje de carga
    if (!userLocation) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Cargando mapa...</Text>
            </View>
        );
    }

    // Configuración de la región del mapa centrada en la ubicación del usuario
    const mapRegion = {
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    // Función para obtener la lista de paquetes correspondiente a una coordenada dada
    const getPackageByCoordinate = (coordinate: LatLng): Package | null => {

        return (
            // Buscar el paquete cuya latitud y longitud coincidan con la coordenada dada (con una pequeña tolerancia)
            packages.find(
                (pkg) =>
                    Math.abs(parseFloat(pkg.lat) - coordinate.latitude) < 0.0001 &&
                    Math.abs(parseFloat(pkg.lng) - coordinate.longitude) < 0.0001
            ) || null
        );
    }

    // Función para determinar el estilo del marcador según el estado del paquete
    const getMarkerStyle = (status: string | undefined) => {
        const statusLower = status?.toLowerCase() || 'en_ruta';
        switch (statusLower) {
            case 'entregado':
                return {
                    backgroundColor: 'green',
                    bordercolor: '#2E7D32',
                    description: 'Paquete entregado',
                };
            case 'fallido':
                return {
                    backgroundColor: 'red',
                    bordercolor: '#C62828',
                    description: 'Entrega fallida',
                };
            default:
                return {
                    backgroundColor: 'orange',
                    bordercolor: '#EF6C00',
                    description: 'En ruta',
                };
        }
    }

        
    return (
        <View style={styles.container}>
            {/* Mapa con la ubicación del repartidor*/}
            <MapView
                style={{ width: screenWidth, height: screenHeight * 0.7 }}
                showsUserLocation={true}
                zoomEnabled={true}
                initialRegion={{...mapRegion}}
            >   
                {/* Marcador de destino */}
                {destination && (<Marker 
                    coordinate={destination}
                    title="Ubicación Actual"
                    description="Aquí estás"
                > 
                    <View style={styles.destinationMarker}>
                        <Store size={moderateScale(20)} color="#DE1484" strokeWidth={3}/>
                    </View>
                </Marker>)}

                {optimizedIntermediates.map((point, index) => {
                    const packageItem = getPackageByCoordinate(point);
                    const status = packageItem?.estado_envio || 'en_ruta';
                    const markerStyle = getMarkerStyle(status);

                    return (
                        <Marker
                            key={`opt-${index}`}
                            coordinate={point}
                            title={packageItem ? `Rastreo: ${packageItem.numero_de_rastreo}` : `Punto ${index + 1}`}
                            description={packageItem ? `Estado: ${packageItem.estado_envio}` : ''}
                            >
                            <View
                                style={[
                                styles.numberMarker,
                                {
                                    backgroundColor: markerStyle.backgroundColor,
                                    borderColor: '#fff',
                                },
                                ]}
                            >
                                {packageItem?.estado_envio?.toLowerCase() === 'entregado' ? (
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="check" size={16} color="white" />
                                </View>
                                ) : packageItem?.estado_envio?.toLowerCase() === 'fallido' ? (
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="times" size={16} color="white" />
                                </View>
                                ) : (
                                <Text style={styles.numberText}>{index + 1}</Text>
                                )}
                            </View>
                        </Marker>
                    );
                })}

                {routePoints.length > 0 && (
                    <Polyline
                        coordinates={routePoints}
                        strokeColor="#DE1484"
                        strokeWidth={4}
                    />
                )}    

            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,    
    },
    destinationMarker: {
        padding: moderateScale(6),
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberMarker: {
        backgroundColor: 'orange',
        borderRadius: moderateScale(20),
        padding: moderateScale(6),
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberText: {
        color: 'white',
        fontWeight: 'bold',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});