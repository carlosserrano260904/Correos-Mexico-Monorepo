import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, FlatList } from "react-native";
import { MapPin } from "lucide-react-native";
import { LatLng } from "react-native-maps";
import { moderateScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

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

export default function PackageCard ({
        packages,
        optimizedIntermediates} :
    {
        packages: Package[],
        optimizedIntermediates: LatLng[]
    }
){
    const navigation = useNavigation();
    const [loading, setLoading] = React.useState(false);

    const getStatusColor = (status: string) => {
        switch (status){
        case 'entregado':
            return '#4CAF50';
        case 'fallido':
            return '#F44336';
        case 'pendiente':
            return '#FF9800';
        case 'en_ruta':
            return '#2196F3';
        default:
            return '#9E9E9E';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status.toLowerCase()) {
        case 'entregado':
            return 'Entregado';
        case 'fallido':
            return 'Fallido';
        case 'pendiente':
            return 'Pendiente';
        case 'en_ruta':
            return 'En Ruta';
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    const getOrderedPackages = (): Package[] => {
        if (optimizedIntermediates.length === 0 || packages.length === 0) {
        return packages;
        }

        const orderedPackages: Package[] = [];

        // Para cada coordenada optimizada, encontrar el paquete correspondiente
        optimizedIntermediates.forEach(optimizedCoord => {
        const matchingPackage = packages.find(pkg =>
            Math.abs(parseFloat(pkg.lat) - optimizedCoord.latitude) < 0.0001 &&
            Math.abs(parseFloat(pkg.lng) - optimizedCoord.longitude) < 0.0001
        );

        if (matchingPackage && !orderedPackages.includes(matchingPackage)) {
            orderedPackages.push(matchingPackage);
        }
        });

        // Agregar cualquier paquete que no se haya incluido
        packages.forEach(pkg => {
        if (!orderedPackages.includes(pkg)) {
            orderedPackages.push(pkg);
        }
        });

        return orderedPackages;
    };
    

    const getPackageRouteIndex = (packageItem: Package): number => {
        const orderedPackages = getOrderedPackages();
        const packageIndex = orderedPackages.findIndex(pkg => pkg.id === packageItem.id);
        return packageIndex >= 0 ? packageIndex + 1 : 0;
    };

    const renderPackageItem = ({ item }: { item: Package }) => {
        const routeIndex = getPackageRouteIndex(item);
    
        return (
            <TouchableOpacity
                style={styles.packageItem}
                onPress={() => {
                if (item.estado_envio && item.estado_envio !== 'entregado' && item.estado_envio !== 'fallido') {
                    // Mapear el objeto del paquete al formato que espera PackageScreen
                    const packageForScreen = {
                    id: item.id,
                    numero_guia: item.numero_de_rastreo,
                    estatus: item.estado_envio,
                    latitud: parseFloat(item.lat),
                    longitud: parseFloat(item.lng),
                    fecha_creacion: new Date().toISOString(), // No hay fecha de creación, se usa la actual
                    indicaciones: item.referencia || 'No hay indicaciones especiales.',
                    calle: `${item.calle} ${item.numero || ''}${item.numero_interior ? ` Int. ${item.numero_interior}` : ''}`.trim(),
                    colonia: item.asentamiento,
                    cp: item.codigo_postal,
                    destinatario: item.destinatario,
                    };
                    navigation.navigate('PackageScreen', { package: packageForScreen });
                }
                }}
            >
                <View style={styles.packageHeader}>
                <View style={styles.packageIconContainer}>
                    <Text style={styles.routeNumber}>{routeIndex > 0 ? routeIndex : '?'}</Text>
                </View>
        
                <View style={styles.packageInfo}>
                    <Text style={styles.packageSku} numberOfLines={1}>Guia: {item.numero_de_rastreo}</Text>
                </View>
        
                <View style={styles.packageStatus}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado_envio || 'desconocido') }]}>
                    <Text style={styles.statusText}>{getStatusText(item.estado_envio || 'Desconocido')}</Text>
                    </View>
                </View>
                
                </View>
        
                <View style={styles.packageAddress}>
                <MapPin color="#666" size={moderateScale(16)} />
                <Text style={styles.addressText} numberOfLines={2}>
                    {item.calle} {item.numero}{item.numero_interior ? ` Int. ${item.numero_interior}` : ''}, {item.asentamiento}
                </Text>
                </View>
        
                <Text
                style={styles.packageInstructions}
                numberOfLines={2}
                >
                {item.referencia && item.referencia.trim() !== '' 
                    ? item.referencia 
                    : 'No hay referencias'}
                </Text>
            </TouchableOpacity>
        );
    };

    const PackagesList = React.memo(() => {
        const orderedPackages = getOrderedPackages();
    
        return (
            <View style={styles.packagesContainer}>
                {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando paquetes...</Text>
                </View>
                ) : (
                <FlatList
                    data={orderedPackages}
                    renderItem={renderPackageItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.packagesList}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                />
                )}
            </View>
        );
    });

    return(
        <PackagesList />
    );
}

const styles = StyleSheet.create({
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
    routeNumber: {
        fontSize: moderateScale(18),
        fontWeight: '700',
        color: '#DE1484',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: moderateScale(16),
        color: '#666',
    },
    packagesContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    packagesList: {
        padding: moderateScale(16),
    },
});