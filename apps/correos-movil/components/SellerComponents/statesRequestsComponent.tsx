import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Loader, Check, X, MessageCircleWarning, Ban } from 'lucide-react-native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

export default function StatesRequestsComponent({
    // Pide el estado de la solicitud
    type,
}: {
    // Es el estado de la solicitud en-revision, aprobado, rechazado u observaciones
    type: 'en-revision' | 'aprobado' | 'rechazado' | 'observaciones';
}) {
    // Define los colores basados en el estado de la solicitud
    const bgColor = type === 'observaciones' ? '#F973161F' : type === 'en-revision' ? '#1D71B91F' : type === 'aprobado' ? '#18BE4A1F' : type === 'rechazado' ? '#E43E2B1F' : '#D1D5DB';
    const iconColor = type === 'observaciones' ? '#F97316' : type === 'en-revision' ? '#1D71B9' : type === 'aprobado' ? '#18BE4A' : type === 'rechazado' ? '#E43E2B' : '#6B7280';
    const textColor = type === 'observaciones' ? '#F97316' : type === 'en-revision' ? '#1D71B9' : type === 'aprobado' ? '#18BE4A' : type === 'rechazado' ? '#E43E2B' : '#6B7280';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {
                type === 'en-revision' ? (<Loader size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'aprobado' ? (<Check size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'rechazado' ? (<X size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                type === 'observaciones' ? (<MessageCircleWarning size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />) :
                (<Ban size={screenWidth * 0.03} strokeWidth={moderateScale(3)} color={iconColor} />)
            }
            {
                type === 'en-revision' ? (<Text style={[styles.text, {color: textColor}]}>En revisíon</Text>) :
                type === 'aprobado' ? (<Text style={[styles.text, {color: textColor}]}>Aprobada</Text>) :
                type === 'rechazado' ? (<Text style={[styles.text, {color: textColor}]}>Rechazada</Text>) :
                type === 'observaciones' ? (<Text style={[styles.text, {color: textColor}]}>Observaciones</Text>) :
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