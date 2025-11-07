import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OrderCardComponent from '../../components/SellerComponents/orderCardComponent';

export default function OrdersScreenSeller() {

    return(
        <View style={styles.container}> 
            <Text style={styles.title}>Orders Screen Seller</Text>
            <Text style={styles.description}>Screen for see seller orders</Text>
            <OrderCardComponent
                statusOrder={'enviado'}
                nameOrder='OSD7888'
                dateOrder={new Date('2025-11-06T00:00:00')}
                numberDistinct={3}
                totalOrder={2500}
                onPressOrder={() => console.log('Presione el boton de orden')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        gap: 8
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    description: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#616161ff'
    }
})