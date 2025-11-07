import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CouponCardCompnent from '../../components/SellerComponents/couponCardComponent';

export default function CouponsScreenSeller() {

    return(
        <View style={styles.container}> 
            <Text style={styles.title}>Coupons Screen Seller</Text>
            <Text style={styles.description}>Screen for see seller coupons</Text>
            <CouponCardCompnent 
                onPressCoupon={() => console.log("Presionando la card del cupon")}
                stateCoupon={'expirado'}
                nameCoupon={'HASK45'}
                usageCoupon={7}
                typeOfDiscount={'cantidad'}
                discount={150}
                onPressEditCoupon={() => console.log("Editar cupon")}
                onPressPauseCoupon={() => console.log("Pausar cupon")}
                colorCoupon={'#c43ba2ff'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        gap: 8
    },
    title: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    description: {
        fontWeight: 'normal',
        fontSize: 16,
        color: '#616161ff'
    }
})