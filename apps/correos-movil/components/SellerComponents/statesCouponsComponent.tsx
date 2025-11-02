import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

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
        gap: moderateScale(6),
        borderRadius: moderateScale(100),
        paddingHorizontal: moderateScale(12),
        paddingVertical: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-start',
    },
    dot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(100),
    },
    text: {
        fontSize: moderateScale(12),
        fontFamily: 'system-ui',
    },

});