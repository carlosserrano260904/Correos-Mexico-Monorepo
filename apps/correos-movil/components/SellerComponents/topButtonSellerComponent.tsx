import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function TopButtonSellerComponent({
    icon,
    text,
    onPressTopButton,
} : {
    icon: any,
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
        borderRadius: moderateScale(100),
        flexDirection: 'row',
        gap: moderateScale(8),
        padding: moderateScale(8),
        alignItems: 'center'
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 'normal',
        fontSize: moderateScale(14),
        color: '#6B7280'
    }
})