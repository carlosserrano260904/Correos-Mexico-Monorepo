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
    const [paquetesTotal, setPaquetesTotal] = React.useState(0);

    const [nombreVehiculo, setNombreVehiculo] = React.useState<string>('Cargando...');

    const handleInicioTurno = async () => {
        await AsyncStorage.setItem('turno_activo', 'true');
        navigation.reset({
            index: 0,
            routes: [{ name: 'PackagesList', params: { unidadId } }],
        });
    };

    React.useEffect(() => {
        const fetchEnviosDelDia = async () => {
            // 1. Obtener la fecha actual y formatearla a YYYY-MM-DD
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
            const day = String(today.getDate()).padStart(2, '0');
            const fechaFormateada = `${year}-${month}-${day}`;

            try {
                // 2. Realizar la petición al nuevo endpoint
                const res = await fetch(`http://${IP}:3000/api/envios/unidad/${unidadId}/fecha/${fechaFormateada}`);
                const data = await res.json(); // { count: number, vehicleName: string | null }

                // 3. Actualizar el estado con la respuesta
                if (data && data.count > 0) {
                    setNombreVehiculo(data.vehicleName ?? 'Vehículo no encontrado');
                    setPaquetesTotal(data.count);
                } else {
                    setNombreVehiculo('Sin envíos asignados para hoy');
                    setPaquetesTotal(0);
                }
            } catch (error) {
                console.error("Error al obtener los envíos del día:", error);
                setNombreVehiculo('Error al obtener datos');
                setPaquetesTotal(0);
            }
        };

        if (unidadId) {
            fetchEnviosDelDia();
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
                <Text style={styles.textIcon}>Cargar <Text style={{ fontWeight: 'bold' }}>0 bolsas</Text> y <Text style={{ fontWeight: 'bold' }}>{paquetesTotal} paquetes</Text></Text>
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
        marginTop: moderateScale(12)
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