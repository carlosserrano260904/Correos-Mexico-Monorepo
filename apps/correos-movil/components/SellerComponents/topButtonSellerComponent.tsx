import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

export default function TopButtonSellerComponent({
    // Pide el icono que se va a mostrar en el boton
    icon,
    // Pide el texto que se mostrara en el boton
    text,
    // Pide el onPress del boton
    onPressTopButton,
} : {
    icon?: any,
    text: string,
    onPressTopButton: any
}) {
    return(
        <TouchableOpacity onPress={onPressTopButton} style={styles.container}>
            {icon ? icon : null}
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E5E7EB',
        borderRadius: moderateScale(8),
        flexDirection: 'row',
        gap: screenWidth * 0.011,
        paddingHorizontal: screenWidth * 0.033,
        paddingVertical: screenHeight * 0.01,
        alignItems: 'center'
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 'normal',
        fontSize: screenHeight * 0.0165,
        color: '#6B7280'
    }
})