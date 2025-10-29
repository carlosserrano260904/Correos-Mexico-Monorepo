import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { CameraType, CameraView, Camera } from "expo-camera";
import { Aperture, Package2, CircleX } from "lucide-react-native";
import Constants from "expo-constants";
import { RootStackParamList } from "../../schemas/schemas";
import { set } from "zod";

// Define la ruta de navegación para este componente y sus parámetros
type TakeEvidenceRouteProp = RouteProp<RootStackParamList, 'TomarEvidencia'>;

// Obtiene la IP del archivo de configuración de Expo
const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function TakeEvidencePhotoScreen() {
    // Estado para permiso de la camera
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    // Estado para la cámara frontal o trasera
    const [facing, setFacing] = useState<CameraType>('back');
    // Estado para controlar si se puede volver a pedir permiso
    const [canAskAgain, setCanAskAgain] = useState(true);
    // Estado para controlar la carga de la foto
    const [isLoading, setIsLoading] = useState(false);
    // Estado para mostrar el éxito de la carga
    const [showSuccess, setShowSuccess] = useState(false);
    // Referencia a la cámara
    const [cameraRef, setCameraRef] = useState<any>(null);
    // Estado para la URI de la foto tomada
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    // Routa y parámetros de navegación
    const route = useRoute<TakeEvidenceRouteProp>();
    // Datos del paquete
    const packageData = route.params.package;
    // Nombre del destinatario
    const addressee = route.params.destinatario;
    // Navegación
    const Navigation = useNavigation();

    // Efecto para solicitar permiso de la cámara al montar el componente
    useEffect(() => {
        requestPermission();
    }, [])

    // Función para solicitar permiso de la cámara
    const requestPermission = async () => {
        try {
            // Solicita permiso para usar la cámara
            const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
            // Actualiza el estado según el resultado
            setHasPermission(status === 'granted');
            // Actualiza si se puede volver a pedir permiso
            setCanAskAgain(canAskAgain);
        } catch (error) {
            console.error("Error pidiendo permisos a la camara:", error);
        }
    }

    // Función para abrir la configuración de la aplicación
    const handleOpenSettings = () => {
        // Abre la configuración de la aplicación para que el usuario pueda otorgar permisos manualmente
        Linking.openSettings();
    }

    // Funcion para renderizar la interfaz según el estado de los permisos
    if (hasPermission === null) {
        return <Text>Solicitando permiso a la cámara...</Text>;
    }

    // Si no se tienen permisos, muestra un mensaje de error y opciones para otorgar permisos
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

    // Función para tomar la foto
    const handleTakePicture = async () => {
        // Asegura que la referencia de la cámara esté disponible
        if (cameraRef) {
            try {
                // Toma la foto con calidad del 70%
                const photo = await cameraRef.takePictureAsync({ quality: 0.7, base64: false });
                // Guarda la URI de la foto en el estado
                setPhotoUri(photo.uri);
            } catch (error) {
                console.error("Error tomando la foto:", error);
            }
        }
    }

    // Función para volver a tomar la foto
    const handleRetakePicture = () => {
        // Resetea la URI de la foto para permitir tomar una nueva foto
        setPhotoUri(null);
    }

    // Función para subir la evidencia al servidor
    const uploadEvidence = async (id: string, uri: string): Promise<string | null> => {
        // Crea un objeto FormData para enviar la imagen
        const formData = new FormData();

        // Extrae el nombre del archivo y su tipo
        const filename = uri.split('/').pop() || `evidencia-${id}.jpg`;
        // Obtiene la extensión del archivo
        const fileType = filename.split('.').pop();

        // Agrega el archivo al FormData
        formData.append('file', {
            uri,
            name: filename,
            type: `image/${fileType}`,
        } as any);

        try {
            // Realiza la solicitud PATCH para subir la evidencia
            const response = await fetch(`http://${IP}:3000/api/envios/${id}/evidencia`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            // Lee la respuesta como texto
            const text = await response.text();

            // Maneja errores en la respuesta
            if (!response.ok) {
                console.error("Error subiendo la evidencia:", text);
                return null;
            }

            // Parsea la respuesta JSON y retorna la URL de la evidencia subida
            const data = JSON.parse(text);
            return data.envio.evidencia_entrega;
        } catch (error) {
            console.error("Error en la solicitud de subida de evidencia:", error);
            return null;
        }
    }

    // Función para actualizar el estatus del paquete
    const updatePackgeStatus = async (id: string, newStatus: string, name: string): Promise<void> => {
        try {
            // Cuerpo de la solicitud
            const body = { estado: newStatus, nombre_receptor: name };
            // Realiza la solicitud PATCH para actualizar el estatus del paquete
            const response = await fetch(`http://${IP}:3000/api/envios/${id}/estatus`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // Maneja errores en la respuesta
            if (!response.ok) {
                const text = await response.text();
                console.error("Error actualizando el estatus del paquete:", text);
                return;
            }

            // Parsea la respuesta JSON
            const data = await response.json();

        } catch (error) {
            console.error("Error en la solicitud de actualización del estatus del paquete:", error);
        }
    }
    
    const handleConfirm = async () => {
        if (!packageData || !photoUri) return;
        setIsLoading(true);

        try {
            // Sube la evidencia y obtiene la URL
            const evidenciaUrl = await uploadEvidence(packageData.id, photoUri);
            
            if (!evidenciaUrl) {
                alert("Error subiendo la evidencia. Intenta de nuevo.");
                setIsLoading(false);
                return;
            }

            await updatePackgeStatus(packageData.id, 'entregado', addressee);
            setShowSuccess(true);

            setTimeout(() => {
                Navigation.navigate('MainLoadPackagesDistributor' as never);
            }, 2000);

        } catch (error) {
            console.error("Error confirmando la entrega:", error);
            alert("Ocurrió un error al confirmar la entrega. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <View style={styles.container}>
            {photoUri ? (
                <>
                    <Image source={{ uri: photoUri }} style={styles.preview} />
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={handleRetakePicture} style={styles.button}>
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
        fontSize: moderateScale(16),
        fontFamily: 'system-ui'
    },
    errortextDown: {
        color: "white",
        fontWeight: 700,
        fontSize: moderateScale(20),
        fontFamily: 'system-ui'
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
        color: "red",
        fontFamily: 'system-ui'
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
        borderRadius: moderateScale(100),
        marginHorizontal: moderateScale(10),
    },
    buttonText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        fontFamily: 'system-ui'
    },
    captureButton: {
        position: 'absolute',
        bottom: moderateScale(52),
        backgroundColor: '#fff',
        borderRadius: moderateScale(100),
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
        shadowRadius: moderateScale(5),
        elevation: moderateScale(5),
    },
    loadingText: {
        color: '#DE1484',
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        fontFamily: 'system-ui'
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
        fontFamily: 'system-ui'
    },
})