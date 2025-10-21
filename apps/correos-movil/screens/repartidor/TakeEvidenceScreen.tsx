import * as React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { CameraType, CameraView, Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { CircleX, Aperture, Package2 } from 'lucide-react-native';
import Constants from 'expo-constants';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../schemas/schemas';

type TakeEvidenceRouteProp = RouteProp<RootStackParamList, 'TomarEvidencia'>;

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const screenWidth = Dimensions.get("screen").width
const screenHeight = Dimensions.get("screen").height

export default function TakeEvidenceScreen() {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [photoUri, setPhotoUri] = React.useState<string | null>(null);
  const [cameraRef, setCameraRef] = React.useState<any>(null);
  const [canAskAgain, setCanAskAgain] = React.useState(true);
  const route = useRoute<TakeEvidenceRouteProp>();
  const packageData = route.params.package;
  const destinatario = route.params.destinatario;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);


  React.useEffect(() => {
    console.log("Destinatario: ",destinatario)
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
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errortitleContainer}>
          <View>
            <CircleX color={"white"} size={moderateScale(100)} />
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

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync({ quality: 0.7 });
      setPhotoUri(photo.uri);
    }
  };

  const handleRetake = () => setPhotoUri(null);

  const handleConfirm = async () => {
    if (!photoUri) return;

    setIsLoading(true);

    try {
      const evidenciaUrl = await subirEvidencia(packageData.id, photoUri);

      if (!evidenciaUrl) {
        alert('Error al subir la evidencia. Intenta de nuevo.');
        return;
      }

      await actualizarEstatusPaquete(packageData.id, 'entregado', destinatario);
      setShowSuccess(true);

      setTimeout(() => {
        navigation.navigate('MainLoadPackagesDistributor');
      }, 2500); // 2.5 segundos visible

    } catch (err) {
      console.error(err);
      alert('Hubo un problema. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const actualizarEstatusPaquete = async (id: string, nuevoEstatus: string, nombreReceptor: string): Promise<void> => {
    try {
      const body: any = {
        estado: nuevoEstatus,
        nombre_receptor: nombreReceptor
      };
      console.log("Body que se enviará:", body);

      const response = await fetch(`http://${IP}:3000/api/envios/${id}/estatus`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });


      if (!response.ok) {
        const error = await response.json();
        console.error('Error al actualizar estatus:', error);
        return;
      }

      const data = await response.json();
      console.log('Estatus actualizado correctamente:', data);
    } catch (error) {
      console.error('Error de red al actualizar estatus:', error);
    }
  };

  const subirEvidencia = async (id: string, uri: string): Promise<string | null> => {
    const formData = new FormData();

    const filename = uri.split('/').pop() ?? `evidencia-${id}.jpg`;
    const fileType = filename.split('.').pop();

    formData.append('file', {
      uri,
      name: filename,
      type: `image/${fileType}`,
    } as any);

    try {
      const response = await fetch(`http://${IP}:3000/api/envios/${id}/evidencia`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Status subirEvidencia:', response.status);
      const text = await response.text();
      console.log('Body subirEvidencia:', text);

      if (!response.ok) {
        console.error('Respuesta no OK:', text);
        return null;
      }

      const data = JSON.parse(text);
      console.log('Evidencia subida:', data);
      return data.envio.evidencia_entrega;
    } catch (error) {
      console.error('Error de red en subir evidencia:', error);
      return null;
    }
  };


  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <View style={styles.controls}>
            <TouchableOpacity onPress={handleRetake} style={styles.button}>
              <Text style={styles.buttonText}>Repetir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Usar Foto</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            ref={(ref) => setCameraRef(ref)}
          />
          <TouchableOpacity onPress={handleTakePicture} style={styles.captureButton}>
            <View style={{ alignItems: 'center' }}>
              <Aperture size={moderateScale(40)} />
            </View>
          </TouchableOpacity>
        </>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Subiendo evidencia...</Text>
          </View>
        </View>
      )}

      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Package2 size={moderateScale(120)} color={'white'}/>
            <Text style={styles.successText}>¡Paquete entregado!</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },

  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  preview: {
    flex: 1, resizeMode: 'contain'
  },
  controls: {
    position: 'absolute',
    bottom: moderateScale(52),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    backgroundColor: '#DE1484',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(20),
    borderRadius: 100,
    marginHorizontal: moderateScale(10),
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold'
  },
  captureButton: {
    position: 'absolute',
    bottom: moderateScale(52),
    backgroundColor: '#fff',
    borderRadius: 100,
    width: moderateScale(64),
    height: moderateScale(64),
    justifyContent: 'center',
    alignSelf: "center"
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: moderateScale(20),
    borderRadius: moderateScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingText: {
    color: '#DE1484',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },

  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#22BB33',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successBox: {
    alignItems: 'center',
  },
  successText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: 'white',
  },
})
