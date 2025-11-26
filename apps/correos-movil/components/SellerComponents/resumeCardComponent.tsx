import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Box, CirclePause, Banknote, CircleAlert, CircleQuestionMark } from 'lucide-react-native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height
// Calcula el tamaño de la tarjeta para que haya un espacio de 20 entre ellas y los bordes
const cardSize = (screenWidth - 60) / 2;

export default function ResumeCardComponent({
    // Pide el tipo de tarjeta
    type,
    // Pide la cantidad a mostrar en la tarjeta
    amount = 0,
}: {
    // Es el tipo de tarjeta activos, vendidos, pausados o sin-stock
    type: 'activos' | 'vendidos' | 'pausados' | 'sin-stock';
    amount?: number;
}) {

    return (
        <View style={styles.card}>
            
                {
                    type === 'activos' ? (
                        <View style={[styles.iconContainer, {backgroundColor: '#3D50DF'}]}>
                            <Box size={screenWidth * 0.075} color="#fff" />
                        </View>
                    ) :
                    type === 'vendidos' ? (
                        <View style={[styles.iconContainer, {backgroundColor: '#22C55E'}]}>
                            <Banknote size={screenWidth * 0.075} color="#fff" />
                        </View>
                ) :
                    type === 'pausados' ? (
                        <View style={[styles.iconContainer, {backgroundColor: '#F97316'}]}>
                            <CirclePause size={screenWidth * 0.075} color="#fff" />
                        </View>
                ) :
                    type === 'sin-stock' ? (
                        <View style={[styles.iconContainer, {backgroundColor: '#FF4D51'}]}>
                            <CircleAlert size={screenWidth * 0.075} color="#fff" />
                        </View>
                ) : (
                    <View style={[styles.iconContainer, { backgroundColor: '#6B7280' }]}>
                        <CircleQuestionMark size={screenWidth * 0.075} color="#fff" />
                        </View>
                    )
                }
                
            
            <Text style={styles.title}>
                {
                    type === 'activos' ? 'Activos' :
                    type === 'vendidos' ? 'Vendidos' :
                    type === 'pausados' ? 'Pausados' :
                    type === 'sin-stock' ? 'Sin Stock' : 'Desconocido'
                }
            </Text>
            <Text style={styles.number}>{amount}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: cardSize,
        borderRadius: moderateScale(12),
        padding: screenWidth * 0.042,
        marginBottom: screenHeight * 0.024,
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    title: {
        fontSize: screenHeight * 0.019,
        fontWeight: 400,
        marginBottom: screenHeight * 0.01,
        color: '#4B5563',
        fontFamily: 'system-ui',
    },
    number: {
        fontSize: screenHeight * 0.043,
        color: '#111827',
        fontWeight: 700,
        fontFamily: 'system-ui',
    },
    iconContainer: {
        padding: screenWidth * 0.01,
        borderRadius: moderateScale(100),
        alignSelf: 'flex-start',
        height: screenWidth * 0.105,
        width: screenWidth * 0.105,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: screenHeight * 0.014,
    },

});