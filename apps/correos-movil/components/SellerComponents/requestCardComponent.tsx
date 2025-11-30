import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Calendar } from 'lucide-react-native';
import StatesRequestsComponent from './statesRequestsComponent';

export default function RequestCardComponent({
    statusRequest,
    nameRequest,
    dateRequest,
    numberImages,
    priceRequest,
    onPressRequest
} : {
    statusRequest: 'en-revision' | 'aprobado' | 'rechazado' | 'observaciones';
    nameRequest: string,
    dateRequest: Date,
    numberImages: number,
    priceRequest: number,
    onPressRequest: any
}) {
    // Formatea el precio del producto para que sea mas facil del leer para el usuario
    const formattedPrice = priceRequest.toLocaleString('en-US', {
        style: 'decimal',
        useGrouping: true,
        // Indica cual es el numero minimo de decimales
        minimumFractionDigits: 2,
    });
    
    // Se formatea la fecha a string y version español
    const formattedDate = dateRequest.toLocaleDateString('es-Es');

    return(
        <TouchableOpacity activeOpacity={0.4} style={styles.container} onPress={onPressRequest}>
            <StatesRequestsComponent type={statusRequest}/>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.requestText}>{nameRequest}</Text>
            <View style={styles.dateContainer}>
                <Calendar size={moderateScale(14)} color={'#6B7280'} strokeWidth={3}/>
                <Text style={styles.dateText}>Solicitud creada el {formattedDate}</Text>
            </View>
            <View style={styles.informationContainer}>
                <View style={styles.itemInformationContainer}>
                    <Text style={styles.informationText}>Imágenes añadidas:</Text>
                    <Text style={styles.informationTextStrong}>{numberImages}</Text>
                </View>
                <View style={styles.itemInformationContainer}>
                    <Text style={styles.informationText}>Precio del producto:</Text>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.informationTextStrong}>${formattedPrice}</Text>
                </View>
            </View>
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
    requestText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(20),
        color: '#030712'
    },
    dateText: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: moderateScale(14),
        color: '#6B7280'
    },
    dateContainer: {
        flexDirection: 'row',
        gap: moderateScale(4),
        alignItems: 'center'
    },
    informationContainer: {
        padding: moderateScale(8),
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderRadius: moderateScale(4),
        borderWidth: 1,
        gap: moderateScale(8)
    },
    informationText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(14),
        color: '#4B5563'
    },
    informationTextStrong: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(14),
        color: '#111827'
    },
    itemInformationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: moderateScale(4),
        flexWrap: 'wrap'
    }
})