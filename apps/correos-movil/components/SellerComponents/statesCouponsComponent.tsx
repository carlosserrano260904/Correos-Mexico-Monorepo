import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

export default function StatesCouponsComponent({
    // Pide el estado del cupón
    type,
}: {
    // Es el estado del cupon activo, expirado o pausado igual que el CouponCardCompnent
    type: 'activo' | 'expirado' | 'pausado';
}) {    
    // Define los colores basados en el estado del cupón
    const bgColor = type === 'activo' ? '#00B2411F' : type === 'pausado' ? '#F973161F' : type === 'expirado' ? '#E43E2B1F' : '#D1D5DB';
    const dotColor = type === 'activo' ? '#18BE4A' : type === 'pausado' ? '#F97316' : type === 'expirado' ? '#E43E2B' : '#6B7280';
    const textColor = type === 'activo' ? '#18BE4A' : type === 'pausado' ? '#F97316' : type === 'expirado' ? '#E43E2B' : '#6B7280';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={[styles.dot, {backgroundColor: dotColor}]}/>
                {
                    type === 'activo' ? (<Text style={[styles.text, {color: textColor}]}>Cupón activo</Text>) :
                    type === 'pausado' ? (<Text style={[styles.text, {color: textColor}]}>Cupón pausado</Text>) :
                    type === 'expirado' ? (<Text style={[styles.text, {color: textColor}]}>Cupón expirado</Text>) :
                    (<Text style={[styles.text, {color: textColor}]}>Sin datos</Text>)
                }
                
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        gap: screenWidth * 0.016,
        borderRadius: moderateScale(100),
        paddingHorizontal: screenWidth * 0.032,
        paddingVertical: screenHeight * 0.005,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    dot: {
        width: screenWidth * 0.016,
        height: screenWidth * 0.016,
        borderRadius: moderateScale(100),
    },
    text: {
        fontSize: screenHeight * 0.014,
        fontFamily: 'system-ui',
    },

});