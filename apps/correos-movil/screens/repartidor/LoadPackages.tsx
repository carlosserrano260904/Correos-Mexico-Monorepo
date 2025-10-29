import * as React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { ArrowLeft, Truck } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function LoadPackages() {
    const navigation = useNavigation();
    const route = useRoute();
    const { unidadId } = route.params as { unidadId: string };
    const { placas } = route.params as { placas: string };
    const [paquetesTotal, setPaquetesTotal] = React.useState(0);

    const [nombreVehiculo, setNombreVehiculo] = React.useState<string>('Cargando...');

    const handleInicioTurno = async () => {
        try {
            const res = await fetch(`http://${IP}:3000/api/envios/iniciar-ruta/hoy/unidad/${unidadId}`, {
                method: 'PATCH',
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`${data.updated} envíos actualizados a "en_ruta".`);
            } else {
                const errorData = await res.json();
                console.warn('Advertencia al iniciar ruta:', errorData.message);
            }
        } catch (error) {
            console.error('Error de red al iniciar la ruta:', error);
        }

        await AsyncStorage.setItem('turno_activo', 'true');
        navigation.reset({
            index: 0,
           routes: [{ name: 'MainLoadPackagesDistributor', params: { unidadId: unidadId } }],
        });
    };

    React.useEffect(() => {
        const fetchNombre = async () => {
        try {
            const res = await fetch(`http://${IP}:3000/api/envios/unidad/${unidadId}`);

            const envio = await res.json();
            if (envio.length > 0) {
            setNombreVehiculo(envio[0].unidad?.placas ?? 'Vehículo no encontrado');
            } else {
            setNombreVehiculo(placas);
            }
        } catch (error) {
            console.error(error);
            setNombreVehiculo('Error al obtener vehículo');
        }
        };

        const fetchPaquetes = async () => {
        try {
            const paq = await fetch(`http://${IP}:3000/api/envios/unidad/${unidadId}/hoy`);

            if (!paq.ok) {
                // Si el status es 404 o cualquier error
                console.warn(`Error HTTP: ${paq.status}`);
                setPaquetesTotal(0);
                return;
            }

            const paquete = await paq.json();
            console.log("Paquetes: ", paquete)
            setPaquetesTotal(paquete.length)
        } catch (err) {
            console.log(err);
            setPaquetesTotal(0);
        }
        };

        if (unidadId) {
        fetchNombre();
        fetchPaquetes();
        }

    }, [unidadId]);


  return (
    <View style={styles.container}>
        <View style={styles.arrowContainer}>
            <TouchableOpacity style={styles.arrow} onPress={() => navigation.navigate('DistributorPage')}>
                <ArrowLeft color={"white"} size={moderateScale(24)}/>
            </TouchableOpacity>
        </View>

        <View style={styles.intructionsContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.textup}>Escaneaste el vehículo:</Text>
                <Text style={styles.textMiddle}>{nombreVehiculo}</Text>
            </View>

            <View style={styles.iconContainer}>
                <Truck color={"white"} size={moderateScale(120)}/>
                <Text style={styles.textIcon}>Cargar {paquetesTotal} paquetes</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleInicioTurno}
                style={[
                styles.button,
                paquetesTotal === 0 && styles.buttonDisabled,
                ]}
                disabled={paquetesTotal === 0}
            >
                <Text
                style={[
                    styles.textButton,
                    paquetesTotal === 0 && styles.textButtonDisabled,
                ]}
                >
                {paquetesTotal === 0 ? 'No hay paquetes asignados' : 'Ya cargue todo'}
                </Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        width: screenWidth,
        height: screenHeight,
        backgroundColor: "#DE1484",
        paddingHorizontal: moderateScale(12)
    },
    arrowContainer: {
        height: "20%",
    },
    intructionsContainer: {
        height: "60%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
    }, 
    buttonContainer: {
        height: "20%"
    },
    arrow: {
        marginTop: moderateScale(40),
    },
    textup: {
        color: "white",
        fontWeight: 700,
        fontSize: moderateScale(20),
        marginBottom: moderateScale(20)
    },
    textMiddle: {
        color: "white",
        fontWeight: 700,
        fontSize: moderateScale(40),
        textAlign: "center"
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    iconContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: moderateScale(60)
    },
    textIcon: {
        color: "white",
        fontSize: moderateScale(20),
        marginTop: moderateScale(12),
        fontWeight: 700
    },
    button: {
        backgroundColor: "white",
        borderRadius: moderateScale(8),
        alignItems: "center",
        justifyContent: "center",
        height: screenHeight * 0.06
    },
    textButton: {
        color: "#DE1484",
        fontSize: moderateScale(16),
        fontWeight: 700,
    },

    buttonDisabled: {
        backgroundColor: '#ccc',
    },

    textButtonDisabled: {
        color: '#888',
    },
})