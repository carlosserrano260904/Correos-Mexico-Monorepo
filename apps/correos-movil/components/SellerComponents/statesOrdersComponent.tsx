import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { CircleDashed, Send, CircleCheckBig, X, Ban } from 'lucide-react-native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

export default function StatesOrdersComponent({
    // Pide el estado del pedido
    type,
}: {
    // Es el estado del pedido pendiente, enviado, entregado o cancelado
    type: 'pendiente' | 'enviado' | 'entregado' | 'cancelado';
}) {
    // Define los colores basados en el estado del pedido
    const bgColor = type === 'pendiente' ? '#F973161F' : type === 'enviado' ? '#1D71B91F' : type === 'entregado' ? '#18BE4A1F' : type === 'cancelado' ? '#E43E2B1F' : '#D1D5DB';
    const iconColor = type === 'pendiente' ? '#F97316' : type === 'enviado' ? '#1D71B9' : type === 'entregado' ? '#18BE4A' : type === 'cancelado' ? '#E43E2B' : '#6B7280';
    const textColor = type === 'pendiente' ? '#F97316' : type === 'enviado' ? '#1D71B9' : type === 'entregado' ? '#18BE4A' : type === 'cancelado' ? '#E43E2B' : '#6B7280';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {
                type === 'pendiente' ? (<CircleDashed size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'enviado' ? (<Send size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'entregado' ? (<CircleCheckBig size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'cancelado' ? (<X size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                (<Ban size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />)
            }
            {
                type === 'pendiente' ? (<Text style={[styles.text, {color: textColor}]}>Pendiente</Text>) :
                type === 'enviado' ? (<Text style={[styles.text, {color: textColor}]}>Enviado</Text>) :
                type === 'entregado' ? (<Text style={[styles.text, {color: textColor}]}>Entregado</Text>) :
                type === 'cancelado' ? (<Text style={[styles.text, {color: textColor}]}>Cancelado</Text>) :
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
        text: {
            fontSize: screenHeight * 0.014,
            fontFamily: 'system-ui',
        },
    
    });