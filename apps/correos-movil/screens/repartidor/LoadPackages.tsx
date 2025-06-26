import * as React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { ArrowLeft, Truck } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function LoadPackages() {
    const navigation = useNavigation();
    const route = useRoute();
    const { transporteId } = route.params as { transporteId: string };

    const [nombreVehiculo, setNombreVehiculo] = React.useState<string>('Cargando...');

    React.useEffect(() => {
        const fetchNombre = async () => {
        try {
            const res = await fetch(`http://${IP}:3000/api/transportes/${transporteId}`);
            const transporte = await res.json();
            setNombreVehiculo(transporte.nombre ?? 'Vehículo no encontrado');
        } catch (error) {
            console.error(error);
            setNombreVehiculo('Error al obtener vehículo');
        }
        };

        if (transporteId) {
        fetchNombre();
        }
    }, [transporteId]);

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
                <Text style={styles.textIcon}>Cargar <Text style={{ fontWeight: 'bold' }}>0 bolsas</Text> y <Text style={{ fontWeight: 'bold' }}>69 paquetes</Text></Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("PackagesList")} style={styles.button}>
                <Text style={styles.textButton}>Ya cargue todo</Text>
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
        fontSize: moderateScale(40)
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
    }
})