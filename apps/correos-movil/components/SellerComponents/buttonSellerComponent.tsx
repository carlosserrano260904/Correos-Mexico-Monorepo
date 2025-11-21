import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';

export default function ButtonSellerComponent({
    haveIcon = true,
    icon = <Check size={moderateScale(16)} color={'white'}/>,
    text = 'Pausar',
    onPressButton,
    type,
} : {
    haveIcon: boolean,
    icon?: any,
    text: string,
    onPressButton: any,
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
        gap: moderateScale(4),
        backgroundColor: '#DE1484',
        borderRadius: moderateScale(8),
        padding: moderateScale(12)
    },
    text: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        color: '#ffffff',
        fontSize: moderateScale(14)
    },
    cancelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: moderateScale(4),
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        padding: moderateScale(12),
        borderColor: '#D1D5DB',
        borderWidth: 1
    },
    textCancel: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        color: '#9CA3AF',
        fontSize: moderateScale(14)
    }
})