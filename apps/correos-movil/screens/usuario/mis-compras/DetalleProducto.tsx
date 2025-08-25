import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PINK = '#E6007E';

export default function DetalleProducto() {
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={PINK} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { }} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalles del pedido</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.orderContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Pedido realizado</Text>
                        <Text style={styles.value}>16 de agosto de 2024</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>N.º de pedido</Text>
                        <Text style={styles.value}>701-5546951-6865867</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.productContainer}>
                        <Image
                            source={{ uri: 'https://assetsdecorreos.s3.us-east-2.amazonaws.com/images/9f2bb214-de63-4ab7-8163-0bfc458360ff-avatar.jpg' }}
                            style={styles.productImage}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productTitle}>GAMAXIMA 118W Cargador Tipo C</Text>
                            <Text style={styles.sellerText}>Vendido por: GAMAXIMA</Text>
                            <Text style={styles.sellerText}>La ventana de devolución se cerró el 17 de septiembre de 2024</Text>
                            <Text style={styles.priceText}>$479.00</Text>
                        </View>
                    </View>

                    {['Comprar nuevamente', 'Ver detalles de la factura'].map((text, idx) => (
                        <TouchableOpacity key={idx} style={styles.actionButton}>
                            <Text style={styles.actionText}>{text}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#555" />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Métodos de pago</Text>
                    <Text style={styles.labelText}>Mastercard que termina en 7374</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Enviar a</Text>
                    <Text style={styles.labelText}>
                        Carlos{"\n"}
                        Ignacio Zaragoza #407{"\n"}
                        LIBERACIÓN SOCIAL{"\n"}
                        VICTORIA DE DURANGO, DURANGO, DURANGO 34287{"\n"}
                        México
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resumen del pedido</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.labelText}>Productos:</Text>
                        <Text style={styles.labelText}>$479.00</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.labelText}>Envío:</Text>
                        <Text style={styles.labelText}>$0.00</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.labelText}>Subtotal:</Text>
                        <Text style={styles.labelText}>$479.00</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.labelText}>Promoción aplicada:</Text>
                        <Text style={styles.labelText}>- $80.00</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalText}>Total:</Text>
                        <Text style={styles.totalText}>$399.00</Text>
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
        paddingBottom: 40,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
      },
      orderContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginHorizontal: 0,
        marginVertical: 12,
      },      
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#fff',
        marginTop: 12,
        borderRadius: 10,
      },
      productContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        alignItems: 'center',
      },
      summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      },      
      label: {
        fontSize: 14,
        color: '#555',
      },
      value: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
      },
    labelBold: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    labelText: {
        fontSize: 15,
        color: '#444',
        marginBottom: 6,
    },
    linkButton: {
        marginTop: 8,
    },
    linkText: {
        color: '#1A73E8',
        fontSize: 15,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    productDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    sellerText: {
        fontSize: 14,
        color: '#666',
    },
    priceText: {
        fontSize: 16,
        color: '#111',
        fontWeight: '600',
        marginTop: 4,
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    actionText: {
        fontSize: 15,
        color: '#333',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 10,
        color: '#111',
    },
   
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111',
    },
});