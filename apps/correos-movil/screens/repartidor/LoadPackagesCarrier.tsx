import * as React from 'react'
import { Text, TouchableOpacity, View, StyleSheet, Dimensions, FlatList } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import { ArrowLeft, Truck, Package } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function LoadPackagesCarrier() {
  const navigation = useNavigation();
    const route = useRoute();
    const { unidadId } = route.params as { unidadId: string };
    const { sucursal } = route.params as { sucursal: [] }
    const [ datosExtra, setDatosExtra ] = React.useState<string>("");
    const { placas } = route.params as { placas: string };
    const [paquetesTotal, setPaquetesTotal] = React.useState(0);
    const [paquetes, setPaquetes] = React.useState< typeof Package[]>([]);

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
        await AsyncStorage.setItem('unidadId', unidadId)
        await AsyncStorage.setItem('datosExtra', datosExtra);
        await AsyncStorage.setItem('sucursal', JSON.stringify(sucursal));

        navigation.reset({
            index: 0,
           routes: [{ name: 'PackagesListCarrier', params: { unidadId: unidadId, datosExtras: datosExtra, sucursal } }],
        });
    };

    React.useEffect(() => {
        const fetchNombre = async () => {
        try {
            const res = await fetch(`http://${IP}:3000/api/envios/unidad/${unidadId}`);

            const envio = await res.json();
            if (envio.length > 0) {
            setNombreVehiculo(envio[0].unidad?.placas ?? 'Vehículo no encontrado');
            setDatosExtra(envio[0].unidad?.zonaAsignada)
            } else {
            setNombreVehiculo(placas);
            }

            console.log("Sucursal en LoadPackagesCarrier: ", sucursal)
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
            setPaquetes(paquete);
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

    const renderPackageItem = ({ item }: { item: typeof Package }) => {
    
        return (
          <View
            style={styles.packageItem}
          >
            <View style={styles.packageHeader}>

                <View style={styles.packageIconContainer}>
                    <Package size={moderateScale(20)} color={"#DE1484"}/>
                </View>
    
              <View style={styles.packageInfo}>
                <Text style={styles.packageSku} numberOfLines={1}>Guia: {item.numero_de_rastreo}</Text>
              </View>
    
              <View style={styles.packageStatus}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado_envio || 'desconocido') }]}>
                  <Text style={styles.statusText}>{(item.estado_envio || 'Desconocido').toUpperCase()}</Text>
                </View>
              </View>
              
            </View>
    
          </View>
        );
      };
    
    const getStatusColor = (status: string) => {
        switch (status){
        case 'entregado':
            return '#4CAF50';
        case 'fallido':
            return '#F44336';
        default:
            return '#9E9E9E';
        }
    };


  return (
    <View style={styles.container}>
        <View style={styles.arrowContainer}>
            <TouchableOpacity style={styles.arrow} onPress={() => navigation.navigate('DistributorPage')}>
                <ArrowLeft color={"white"} size={moderateScale(24)}/>
            </TouchableOpacity>
        </View>

        <View style={styles.intructionsContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.textup}>Escaneaste el transporte:</Text>
                <Text style={styles.textMiddle}>{nombreVehiculo}</Text>
            </View>

            <View style={styles.iconContainer}>
                <Truck color={"white"} size={moderateScale(120)}/>
                <Text style={styles.textIcon}>Cargar {paquetesTotal} paquetes</Text>
            </View>

            <View style={{ width: "100%", height: screenHeight * 0.20 }}>
                <FlatList
                    data={paquetes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPackageItem}
                    contentContainerStyle={{ paddingVertical: moderateScale(8) }}
                    showsVerticalScrollIndicator={false}
                />
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
        height: "20%",
        justifyContent: "flex-end",
        paddingBottom: moderateScale(52),
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
        alignItems: "center",
    },
    iconContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: moderateScale(60),
        justifyContent: "center"
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

    packageItem: {
        backgroundColor: '#fff',
        borderRadius: moderateScale(12),
        padding: moderateScale(16),
        marginBottom: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    packageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: moderateScale(12),
    },
    packageIconContainer: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        backgroundColor: '#FFE8F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: moderateScale(12),
    },
    packageInfo: {
        flex: 1,
    },
    packageSku: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#333',
        marginBottom: moderateScale(4),
    },
    packageGuia: {
        fontSize: moderateScale(14),
        color: '#666',
    },
    packageStatus: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: moderateScale(8),
        paddingVertical: moderateScale(4),
        borderRadius: moderateScale(12),
    },
    statusText: {
        color: '#fff',
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    packageAddress: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: moderateScale(8),
    },
    addressText: {
        flex: 1,
        marginLeft: moderateScale(8),
        fontSize: moderateScale(14),
        color: '#666',
        lineHeight: moderateScale(20),
    },
    packageInstructions: {
        fontSize: moderateScale(14),
        color: '#888',
        fontStyle: 'italic',
        marginTop: moderateScale(4),
    },
    routeNumber: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#DE1484',
    },
})