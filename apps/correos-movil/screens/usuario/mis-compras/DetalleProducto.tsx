import React from 'react';
import {
    Text,
    Image,
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Platform,
    StatusBar,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MisComprasType } from '../../../schemas/schemas';

type RootStackParamList = {
    DetalleProducto: {
        contenido: MisComprasType['contenidos'][0];
    };
};

const PINK = '#E6007E';

export default function DetalleProducto() {
    const route = useRoute<RouteProp<RootStackParamList, 'DetalleProducto'>>();
    const contenido = route.params.contenido;
    const navigation = useNavigation();

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={PINK} />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    accessibilityRole="button"
                    accessible={true}
                    accessibilityLabel="Regresar"
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalle del Producto</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.innerContainer}>
                    <Image source={{ uri: contenido.producto.imagen }} style={styles.imagen} />
                    <Text style={styles.nombre}>{contenido.producto.nombre}</Text>
                    <Text style={styles.descripcion}>{contenido.producto.descripcion}</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Cantidad:</Text>
                        <Text style={styles.value}>{contenido.cantidad}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Precio unitario:</Text>
                        <Text style={styles.value}>${contenido.precio}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Precio total:</Text>
                        <Text style={styles.value}>${(Number(contenido.precio) * contenido.cantidad).toFixed(2)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Categoría:</Text>
                        <Text style={styles.value}>{contenido.producto.categoria}</Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        height: Platform.OS === 'ios' ? 100 : 100,
        paddingTop: Platform.OS === 'ios' ? 30 : StatusBar.currentHeight || 20,
        backgroundColor: PINK,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backButton: {
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingBottom: 40,
    },
    innerContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100%',
    },
    imagen: {
        width: '90%',
        height: 200,
        borderRadius: 12,
        marginBottom: 25,
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    nombre: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
        color: '#222',
    },
    descripcion: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    value: {
        fontSize: 18,
        fontWeight: '400',
        color: '#666',
    },
});