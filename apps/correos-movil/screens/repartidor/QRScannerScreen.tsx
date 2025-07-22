import { CameraView, CameraType, Camera } from 'expo-camera';
import { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Dimensions, Linking } from 'react-native';
import { CircleX } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { Scan } from 'lucide-react-native';

const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const [facing, setFacing] = useState<CameraType>('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setCanAskAgain(canAskAgain);
    } catch (err) {
      console.warn("Error solicitando permisos:", err);
      setHasPermission(false);
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso a la cámara...</Text>;
  }

  if (hasPermission === false) {
    return(
      <View style={styles.errorContainer}>
        <View style={styles.errortitleContainer}>
          <View>
            <CircleX color={"white"} size={moderateScale(100)}/>
          </View>

          <View style={styles.errortextContainer}>
            <Text style={styles.errortextUp}>No se logró acceder a la cámara</Text>
            <Text style={styles.errortextDown}>Permisos insuficientes</Text>
          </View>
        </View>

        <View style={styles.permissionsButtonContainer}>
          <TouchableOpacity style={styles.permissionsButton} onPress={canAskAgain ? requestPermission : handleOpenSettings}>
            <Text style={styles.permissionsButtonText}>{canAskAgain ? "Otorgar Permisos" : "Abrir Configuración"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  const handleQRCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('Código QR escaneado', data, [
        {
          text: 'Aceptar',
          onPress: () => {
            setScanned(false);
            console.log(data)
            navigation.navigate("LoadPackages", { unidadId: data});
          },
        },
      ]);
    }
  };


  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleQRCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <Scan style={{position: "absolute", alignSelf: "center", top: moderateScale(128)}} size={moderateScale(300)} color={"white"} strokeWidth={0.5}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    position: "relative"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  button: {
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  errorContainer: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "red"
  },
  errortitleContainer: {
    height: "40%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  errortextContainer: {
    flexDirection: "column",
    alignItems: "center"
  },
  errortextUp: {
    color: "white",
    fontWeight: 400,
    fontSize: moderateScale(16)
  },
  errortextDown: {
    color: "white",
    fontWeight: 700,
    fontSize: moderateScale(20)
  },
  permissionsButtonContainer: {
    height: "60%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: moderateScale(12)
  },
  permissionsButton: {
    backgroundColor: "white",
    width: "100%",
    marginBottom: moderateScale(52),
    height: screenHeight * 0.06,
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center"
  },
  permissionsButtonText: {
    fontWeight: 700,
    fontSize: moderateScale(18),
    color: "red"
  }
});