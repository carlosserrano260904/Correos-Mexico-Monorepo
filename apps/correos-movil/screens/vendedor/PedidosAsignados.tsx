import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert,
    RefreshControl 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PedidoAsignado, PedidosAsignadosResponse } from "../../types/vendedor.types";

const OrdenesScreen = () => {
    const navigation = useNavigation();
    const [pedidos, setPedidos] = useState<PedidoAsignado[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        cargarPedidosAsignados();
    }, []);

    const obtenerProfileId = async (): Promise<number | null> => {
        try {
            // TODO: Obtener el profileId real del usuario autenticado
            // Por ahora usaremos un ID de ejemplo
            const profileId = await AsyncStorage.getItem('userId');
            return profileId ? parseInt(profileId) : 1; // ID de ejemplo
        } catch (error) {
            console.error('Error obteniendo profileId:', error);
            return null;
        }
    };

    const cargarPedidosAsignados = async () => {
        try {
            const profileId = await obtenerProfileId();
            if (!profileId) {
                Alert.alert('Error', 'No se pudo obtener la información del vendedor');
                return;
            }

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/pedidos-asignados/${profileId}`
            );

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data: PedidosAsignadosResponse = await response.json();
            setPedidos(data.data);
            
            console.log('✅ Pedidos cargados:', data.total);
        } catch (error) {
            console.error('Error cargando pedidos:', error);
            Alert.alert(
                'Error', 
                'No se pudieron cargar los pedidos asignados. Verifica tu conexión a internet.'
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        cargarPedidosAsignados();
    };

    const handleImprimirGuia = (pedidoId: number) => {
        Alert.alert(
            'Servicio no disponible',
            'Servicio temporalmente no disponible, contactar con el administrador.',
            [{ text: 'OK' }]
        );
        // TODO: Implementar descarga de PDF desde AWS S3 usando key_pdf de guias
        // Cada pedido_producto tendría su propia guía
    };

    const renderOrden = ({ item }: { item: PedidoAsignado }) => (
        <View style={styles.card}>
            <View style={styles.titleRow}>
                <Text style={styles.ordenTitle}>Orden ID: {item.id}</Text>
            </View>

            {/* Información del cliente */}
            <View style={styles.separator} />
            <View style={{marginVertical: 10}}>
                <Text>Cliente: {item.cliente.nombre}</Text>
                <Text>Dirección: {item.cliente.direccion}</Text>
                <Text>Fecha: {item.fecha}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.headerRow}>
                <Text style={[styles.column, styles.sku]}>SKU</Text>
                <Text style={[styles.column, styles.nombre]}>Nombre</Text>
                <Text style={[styles.column, styles.cantidad]}>Cantidad</Text>
                <Text style={[styles.column, styles.estado]}>Estado</Text>
            </View>
            <View style={styles.separator} />

            {/* Productos */}
            {item.productos.map((prod, index: number) => (
                <View key={index} style={styles.row}>
                    <Text style={[styles.column, styles.sku]}>{prod.sku}</Text>
                    <Text style={[styles.column, styles.nombre]}>{prod.nombre}</Text>
                    <Text style={[styles.column, styles.cantidad]}>{prod.cantidad}</Text>
                    <Text style={[styles.column, styles.estado]}>{prod.estado}</Text>
                </View>
            ))}
            <View style={styles.separator} />
                <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={styles.boton}
                    onPress={() => handleImprimirGuia(item.id)}
                >
                    <Text style={styles.botonTexto}>Imprimir Guía</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Pedidos Asignados</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#C71E82" />
                    <Text style={styles.loadingText}>Cargando pedidos...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Pedidos Asignados</Text>
            </View>

            {pedidos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="inbox" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No hay pedidos asignados</Text>
                    <Text style={styles.emptySubText}>Los pedidos aparecerán aquí cuando sean asignados</Text>
                </View>
            ) : (
                <FlatList
                    data={pedidos}
                    renderItem={renderOrden}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.flatList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#C71E82']}
                            tintColor="#C71E82"
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#C71E82",
        paddingTop: 100,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "500",
        color: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
        marginHorizontal: 16,
        marginTop: 16,
    },
    ordenTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    separator: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    headerRow: {
        flexDirection: "row",
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        paddingVertical: 4,
    },
    column: {
        fontSize: 14,
    },
    sku: {
        flex: 1.2,
    },
    nombre: {
        flex: 2,
    },
    cantidad: {
        flex: 1,
        textAlign: "center",
    },
    boton: {
        backgroundColor: "#C71E82",
        padding: 10,
        borderRadius: 20,
    },
    botonTexto: {
        color: "#fff",
    },
    botonImprimir: {
        color: "#fff",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
    estado: {
        flex: 1,
        textAlign: "center",
    },
    flatList: {
        paddingBottom: 20,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default OrdenesScreen;