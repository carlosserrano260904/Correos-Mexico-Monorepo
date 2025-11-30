import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Check } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidht = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function ButtonSellerComponent({
    // Pide si el boton tiene o no icono
    haveIcon = true,
    // Pide el icono que va a tener el boton
    icon = <Check size={moderateScale(16)} color={'white'}/>,
    // Pide el texto que se mostrara en el boton
    text = 'Pausar',
    // Pide el onPress del boton
    onPressButton,
    // Pide el tipo de boton
    type,
} : {
    haveIcon: boolean,
    icon?: any,
    text: string,
    onPressButton: any,
    // El tipo de boton puede ser nomal o cancelado
    type: 'normal' | 'cancel'
}) {

    return(
        <TouchableOpacity 
            activeOpacity={0.4} 
            style={
                type === 'cancel' ? styles.cancelContainer : 
                type === 'normal' ? styles.container : 
                null
            } 
            onPress={onPressButton}
        >
            {haveIcon === true && type === 'normal' ? icon : null}
            <Text 
                numberOfLines={1} 
                ellipsizeMode={'tail'} 
                style={
                    type === 'normal' ? styles.text : 
                    type === 'cancel' ? styles.textCancel:
                    null
                }
            >
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: screenWidht * 0.01,
        backgroundColor: '#DE1484',
        borderRadius: moderateScale(8),
        padding: screenWidht * 0.03
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        color: '#ffffff',
        fontSize: screenHeight * 0.017
    },
    cancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        padding: screenWidht * 0.03,
        borderColor: '#D1D5DB',
        borderWidth: 1
    },
    textCancel: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        color: '#9CA3AF',
        fontSize: screenHeight * 0.017
    }
})