import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Calendar } from 'lucide-react-native';
import StatesOrdersComponent from './statesOrdersComponent';


export default function OrderCardComponent({
    statusOrder,
    nameOrder,
    dateOrder,
    numberDistinct,
    totalOrder,
    onPressOrder
} : {
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
                <Calendar size={moderateScale(14)} color={'#6B7280'} strokeWidth={3}/>
                <Text style={styles.dateText}>Realizado el {formattedDate}</Text>
            </View>
            <Text style={styles.distinctText}><Text style={styles.textStrong}>{numberDistinct}</Text> productos distintos</Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.totalText}>Total del pedido: <Text style={styles.colorText}>${formattedTotal} MXN</Text></Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(16),
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        flexDirection: 'column',
        gap: moderateScale(8),
    },
    orderText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(24),
        color: '#1F2937'
    },
    dateContainer: {
        flexDirection: 'row',
        gap: moderateScale(4),
        alignItems: 'center'
    },
    dateText: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: moderateScale(14),
        color: '#6B7280'
    },
    textStrong: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(16),
        color: '#374151'
    },
    distinctText: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: moderateScale(16),
        color: '#374151'
    },
    totalText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(16),
        color: '#374151'
    },
    colorText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(16),
        color: '#DE1484'
    }
})