import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Calendar } from 'lucide-react-native';
import StatesOrdersComponent from './statesOrdersComponent';

const screenWidht = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function OrderCardComponent({
    // Pide el estatus del pedido
    statusOrder,
    // Pide el nombre del pedido
    nameOrder,
    // Pide la fecha del pedido
    dateOrder,
    // Pide el numero distinto de articulos del pedido
    numberDistinct,
    // Pide el costo total del pedido
    totalOrder,
    // Pide el onPress de la card del pedido
    onPressOrder
} : {
    // Define los estatus del pedido, igual que el componente StatesOrdersComponent
    statusOrder: 'pendiente' | 'enviado' | 'entregado' | 'cancelado';
    nameOrder: string;
    dateOrder: Date;
    numberDistinct: number,
    totalOrder: number,
    onPressOrder: any
}){
    // Formatea el precio del producto para que sea mas facil del leer para el usuario
    const formattedTotal = totalOrder.toLocaleString('en-US', {
        style: 'decimal',
        useGrouping: true,
        // Indica cual es el numero minimo de decimales
        minimumFractionDigits: 2,
    });
    
    // Se formatea la fecha a string y version español
    const formattedDate = dateOrder.toLocaleDateString('es-Es');

    return(
        <TouchableOpacity activeOpacity={0.4} style={styles.container} onPress={onPressOrder}>
            <StatesOrdersComponent type={statusOrder}/>
            <Text style={styles.orderText}>{nameOrder}</Text>
            <View style={styles.dateContainer}>
                <Calendar size={screenWidht * 0.038} color={'#6B7280'} strokeWidth={3}/>
                <Text style={styles.dateText}>Realizado el {formattedDate}</Text>
            </View>
            <Text style={styles.distinctText}><Text style={styles.textStrong}>{numberDistinct}</Text> productos distintos</Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.totalText}>Total del pedido: <Text style={styles.colorText}>${formattedTotal} MXN</Text></Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: screenWidht * 0.042,
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        flexDirection: 'column',
        gap: screenWidht * 0.02,
    },
    orderText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: screenHeight * 0.03,
        color: '#1F2937'
    },
    dateContainer: {
        flexDirection: 'row',
        gap: screenWidht * 0.01,
        alignItems: 'center'
    },
    dateText: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: screenHeight * 0.017,
        color: '#6B7280'
    },
    textStrong: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: screenHeight * 0.019,
        color: '#374151'
    },
    distinctText: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: screenHeight * 0.019,
        color: '#374151'
    },
    totalText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: screenHeight * 0.019,
        color: '#374151'
    },
    colorText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: screenHeight * 0.019,
        color: '#DE1484'
    }
})