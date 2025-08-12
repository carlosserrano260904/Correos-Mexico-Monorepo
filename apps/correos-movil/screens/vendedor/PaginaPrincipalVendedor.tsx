import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ScrollView } from 'react-native'
import { moderateScale } from 'react-native-size-matters'
import React from 'react'
import { ChartNetwork, Hourglass, PackageCheck, X, CirclePlus } from 'lucide-react-native'

const screenWidht = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

import { useNavigation } from '@react-navigation/native';

export default function PaginaPrincipalVendedor() {

    const navigation = useNavigation();

    return (
    <ScrollView>
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.tituloTextoNombre}>Hola, Juan!</Text>
                <Text style={styles.tituloTexto}>Aquí tienes un resumen de tu tienda</Text>
            </View>

            <View style={styles.cardsContainer}>
                <View style={[styles.card, styles.active]}>
                    <Text style={styles.number}>15</Text>
                    <Text style={styles.label}>Activos</Text>
                    <View style={styles.iconContainer}>
                        <ChartNetwork color="white" size={moderateScale(24)} />
                    </View>
                </View>

                <View style={[styles.card, styles.paused]}>
                    <Text style={styles.number}>3</Text>
                    <Text style={styles.label}>Pausados</Text>
                    <View style={styles.iconContainer}>
                        <Hourglass color="white" size={moderateScale(24)} strokeWidth={3} />
                    </View>
                </View>

                <View style={[styles.card, styles.sold]}>
                    <Text style={styles.number}>8</Text>
                    <Text style={styles.label}>Vendidos</Text>
                    <View style={styles.iconContainer}>
                        <PackageCheck color="white" size={moderateScale(24)} strokeWidth={2} />
                    </View>
                </View>

                <View style={[styles.card, styles.outOfStock]}>
                    <Text style={styles.number}>2</Text>
                    <Text style={styles.label}>Sin stock</Text>
                    <View style={styles.iconContainer}>
                        <X color="white" size={moderateScale(24)} strokeWidth={3} />
                    </View>

                </View>
            </View>

            <View style={styles.ventasContainer}>
                <View>
                    <Text style={styles.textoVentas}>Ventas del mes</Text>
                    <Text style={styles.textoVsVentas}>+ 15% vs el mes anterior</Text>
                </View>

                <View>
                    <Text style={styles.textoCantidadVentas}>$12,450</Text>
                </View>
            </View>

            <View>
                <View style={styles.historialTextContainer}>
                    <Text style={styles.historialTexto}>Historial de cupones</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ height: screenHeight * 0.150 }}>
                    <TouchableOpacity style={[styles.cuponesContainer, styles.active]}>
                        <View style={{ width: "80%" }}>
                            <Text style={styles.cuponesTitulo}>VERANO25</Text>
                            <Text style={styles.cuponesTexto} numberOfLines={1}>25% descuento <Text style={{ fontWeight: 700 }}>Activo</Text></Text>
                        </View>

                        <View style={styles.cuponesCantidadContainer}>
                            <Text style={styles.cuponesTitulo}>156</Text>
                            <Text style={styles.cuponesTexto}>usos</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cuponesContainer, styles.paused]}>
                        <View style={{ width: "80%" }}>
                            <Text style={styles.cuponesTitulo}>TECH15</Text>
                            <Text style={styles.cuponesTexto} numberOfLines={1}>15% descuento <Text style={{ fontWeight: 700 }}>Expirado</Text></Text>
                        </View>

                        <View style={styles.cuponesCantidadContainer}>
                            <Text style={styles.cuponesTitulo}>89</Text>
                            <Text style={styles.cuponesTexto}>usos</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cuponesContainer, styles.sold]}>
                        <View style={{ width: "80%" }}>
                            <Text style={styles.cuponesTitulo}>COMPRA1</Text>
                            <Text style={styles.cuponesTexto} numberOfLines={1}>$500 descuento <Text style={{ fontWeight: 700 }}>Activo</Text></Text>
                        </View>

                        <View style={styles.cuponesCantidadContainer}>
                            <Text style={styles.cuponesTitulo}>23</Text>
                            <Text style={styles.cuponesTexto}>usos</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.botonNuevo}
                    onPress={() => navigation.navigate('ProductUploadScreen')}
                    activeOpacity={0.7}
                >
                    <CirclePlus color="#fff" />
                    <Text style={styles.botonNuevoTexto}>Nuevo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonVerProductos}>
                    <Text style={styles.botonVerProductosTexto}>Ver Productos</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView> 
    )
}

const cardSize = (screenWidht - 50) / 2;

const styles = StyleSheet.create({
    container: {
        width: screenWidht,
        height: screenHeight,
        paddingHorizontal: moderateScale(12),
        backgroundColor: "white",
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: moderateScale(128),
        width: screenWidht,
        paddingHorizontal: moderateScale(12),
        zIndex: 10
    },
    botonNuevo: {
        backgroundColor: "#DE1484",
        flexDirection: "row",
        borderRadius: moderateScale(100),
        height: screenHeight * 0.05,
        alignItems: "center",
        width: screenWidht * 0.45,
        justifyContent: "center"
    },
    botonNuevoTexto: {
        color: "white",
        fontWeight: 600,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(8)
    },
    botonVerProductos: {
        flexDirection: "row",
        borderRadius: moderateScale(100),
        height: screenHeight * 0.05,
        alignItems: "center",
        width: screenWidht * 0.45,
        justifyContent: "center",
        borderColor: "#DE1484",
        borderWidth: 2
    },
    botonVerProductosTexto: {
        color: "#DE1484",
        fontWeight: 600,
        fontSize: moderateScale(14),
    },
    titleContainer: {
        marginTop: moderateScale(40),
        marginBottom: moderateScale(20)
    },
    tituloTextoNombre: {
        fontWeight: 700,
        fontSize: moderateScale(20),
        marginBottom: moderateScale(8)
    },
    tituloTexto: {
        fontWeight: 600,
        fontSize: moderateScale(16)
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: cardSize,
        height: screenHeight * 0.135,
        borderRadius: moderateScale(10),
        padding: moderateScale(16),
        marginBottom: moderateScale(20),
        justifyContent: "flex-end"
    },
    number: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        color: 'white',
    },
    label: {
        fontSize: moderateScale(16),
        color: 'white',
        fontWeight: 600
    },
    active: {
        backgroundColor: '#ec1b92',
    },
    paused: {
        backgroundColor: '#ff8c1a',
    },
    sold: {
        backgroundColor: '#42c586',
    },
    outOfStock: {
        backgroundColor: '#f4465e',
    },
    iconContainer: {
        position: "absolute",
        right: moderateScale(16),
        top: moderateScale(12)
    },
    ventasContainer: {
        backgroundColor: 'white',
        borderRadius: moderateScale(12),
        padding: moderateScale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: moderateScale(20)
    },
    textoVentas: {
        fontWeight: 700,
        fontSize: moderateScale(16),
        marginBottom: moderateScale(6)
    },
    textoVsVentas: {
        fontWeight: 600,
        fontSize: moderateScale(12),
        color: "#7A7A7A"
    },
    textoCantidadVentas: {
        fontWeight: 700,
        fontSize: moderateScale(16),
        color: "#DE1484"
    },
    historialTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: moderateScale(12)
    },
    historialTexto: {
        fontSize: moderateScale(16),
        fontWeight: 700,
    },
    seeAll: {
        fontWeight: 600,
        fontSize: moderateScale(14),
        color: "#656565"
    },
    cuponesContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: moderateScale(8),
        padding: moderateScale(20),
        marginBottom: moderateScale(12),
        justifyContent: "space-between"
    },
    cuponesTitulo: {
        fontSize: moderateScale(14),
        fontWeight: 700,
        marginBottom: moderateScale(4),
        color: "white"
    },
    cuponesTexto: {
        fontSize: moderateScale(12),
        fontWeight: 400,
        color: "white"
    },
    cuponesCantidadContainer: {
        flexDirection: "column",
        alignItems: "flex-end",
        width: "20%",
    }
})