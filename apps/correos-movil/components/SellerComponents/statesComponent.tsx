import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

export default function StatesComponent({
    // Pide el tipo de estado para productos
    type,
}: {
    // Es el estado del producto activo o pausado
    type: 'activo' | 'pausado';
}) {
    // Define los colores basados en el estado del producto
    const bgColor = type === 'activo' ? '#00B2411F' : type === 'pausado' ? '#F973161F' : '#D1D5DB';
    const dotColor = type === 'activo' ? '#18BE4A' : type === 'pausado' ? '#F97316' : '#6B7280';
    const textColor = type === 'activo' ? '#18BE4A' : type === 'pausado' ? '#F97316' : '#6B7280';


    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={[styles.dot, {backgroundColor: dotColor}]}/>
            {
                type === 'activo' ? (<Text style={[styles.text, {color: textColor}]}>Activo</Text>) :
                type === 'pausado' ? (<Text style={[styles.text, {color: textColor}]}>Pausado</Text>) :
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