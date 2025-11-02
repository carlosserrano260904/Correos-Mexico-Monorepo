import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import ResumeCardComponent from '../../components/SellerComponents/resumeCardComponent';
import CouponCardCompnent from '../../components/SellerComponents/couponCardComponent';
import ProductCardSellerComponent from '../../components/SellerComponents/productCardSellerComponent';
import OrderCardComponent from '../../components/SellerComponents/orderCardComponent';
import RequestCardComponent from '../../components/SellerComponents/requestCardComponent';

export default function MainScreenSeller() {

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.cardsWrapper}>
                <ResumeCardComponent type={'activos'}/>
                <ResumeCardComponent type={'pausados'}/>
                <ResumeCardComponent type={'vendidos'}/>
                <ResumeCardComponent type={'sin-stock'}/>
            </View>
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
            <ProductCardSellerComponent 
                statusProduct={'activo'}
                nameProduct={'Jarrón Artesanal Ultra HD 4K'}
                priceProduct={20000.00}
                soldProducts={30}
                stock={120}
                onPressEditProduct={() => console.log('Editar producto')}
                onPressPauseProduct={() => console.log('Pausar producto')}
                onPressCardProduct={() => console.log('Presione la card del producto')}
            />
            <OrderCardComponent 
                statusOrder={'pendiente'}
                nameOrder={'HSW1809'}
                dateOrder={new Date("2025-10-29T00:00:00")}
                numberDistinct={3}
                totalOrder={2500.50}
                onPressOrder={() => console.log('Presione el pedido')}
            />
            <RequestCardComponent 
                statusRequest={'en-revision'}
                nameRequest={'Jarrón Artesanal'}
                dateRequest={new Date("2025-10-29T00:00:00")}
                numberImages={3}
                priceRequest={480}
                onPressRequest={() => console.log('Presione la card de solicitud')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: moderateScale(40),
        paddingHorizontal: moderateScale(20), 
        backgroundColor: '#fff',
        gap: moderateScale(8),
        paddingBottom: moderateScale(128)
    },
    cardsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});