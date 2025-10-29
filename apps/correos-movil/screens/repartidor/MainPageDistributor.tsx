import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { QrCode, LogOut } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyAuth } from '../../context/AuthContext';

const screenWidth = Dimensions.get('screen').width
const screenHeight = Dimensions.get('screen').height


export default function MainPageDistributor() {
    const navigation = useNavigation();
    const { logout } = useMyAuth();
    React.useEffect(() => {
        const checkTurnoActivo = async () => {
            const activo = await AsyncStorage.getItem('turno_activo');
            const tipo = await AsyncStorage.getItem('tipoUnidad');
            if (activo === 'true' && [1, 2, 3].includes(Number(tipo))) {
                navigation.reset({
                index: 0,
                routes: [{ name: 'PackagesListCarrier' }],
            });
            } else {
                if(activo === 'true'){
                    navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainLoadPackagesDistributor' }],
                });
            }
            }
        };

        checkTurnoActivo();
    }, []);

    const handleSignOut = async () => {
        try {
        await logout();
        } catch (err) {
        console.error('Logout error:', JSON.stringify(err, null, 2));
        }
    };

  return (
    <View style={styles.container}>
        <View style={styles.userButtonContainer}>
            <TouchableOpacity style={styles.userButton} onPress={handleSignOut}>
                <LogOut color="white" size={moderateScale(20)} />
            </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
            <View style={{marginBottom: moderateScale(8)}}>
                <QrCode color={"white"} size={moderateScale(100)}/>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.textUp}>Escanea el</Text>
                <Text style={styles.textDown}>QR de tu vehivulo</Text>
            </View>
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("QRScanner")}>
                <Text style={styles.buttonText}>Escanear</Text>
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
        flexDirection: "column",
    },
    titleContainer: {
        height: screenHeight * 0.3,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    buttonContainer: {
        height: screenHeight * 0.6,
        justifyContent: "flex-end",
        alignItems: "center",
        marginHorizontal: moderateScale(12)
    },
    textContainer: {
        flexDirection: "column",
        alignItems: "center"
    },
    textUp: {
        color: "white",
        fontWeight: 400,
        fontSize: moderateScale(16)
    },
    textDown: {
        color: "white",
        fontWeight: 700,
        fontSize: moderateScale(20)
    },
    button: {
        backgroundColor: "white",
        width: "100%",
        marginBottom: moderateScale(52),
        height: screenHeight * 0.06,
        borderRadius: moderateScale(8),
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontWeight: 700,
        fontSize: moderateScale(18),
        color: "#DE1484"
    },
    userButton: {
        padding: moderateScale(6),
        borderRadius: moderateScale(100),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    userButtonContainer: {
        height: screenHeight * 0.1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginHorizontal: moderateScale(12)
    }
})