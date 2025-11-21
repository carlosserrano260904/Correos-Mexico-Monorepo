import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { Home } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ResumeCardComponent from '../../components/SellerComponents/resumeCardComponent';
import CouponCardCompnent from '../../components/SellerComponents/couponCardComponent';
import TopButtonSellerComponent from '../../components/SellerComponents/topButtonSellerComponent';

const screenWidht = Dimensions.get('screen').width;

export default function MainScreenSeller() {
    // Define la navegacion
    const navigation = useNavigation();
    // Define la imagen que se va utilizar como logo
    const logo = require('../../assets/icons_correos_mexico/correos_clic_Logo.png')
    // Define el numero de ventas totales
    const [totalSales, setTotalSales] = useState(80540.45)

    const formattedTotalSales = totalSales.toLocaleString('en-US', {
        style: 'decimal',
        useGrouping: true,
        // Indica cual es el numero minimo de decimales
        minimumFractionDigits: 2,
    });

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.topContainer}>
                <Image style={styles.photo} source={logo}/>
                <TopButtonSellerComponent icon={<Home size={moderateScale(18)} color={'#6B7280'}/>} text='Regresar al inicio' onPressTopButton={() => navigation.navigate('Tabs' as never)}/>
            </View>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>¡Hola, Juan!</Text>
                <Text style={styles.description}>Conoce el resumen de tus ventas a continuación.</Text>
            </View>
            <View style={styles.cardsWrapper}>
                <ResumeCardComponent type={'activos'} amount={69}/>
                <ResumeCardComponent type={'pausados'} amount={3}/>
                <ResumeCardComponent type={'vendidos'} amount={23}/>
                <ResumeCardComponent type={'sin-stock'} amount={1}/>
            </View>
            <LinearGradient
                colors={['#F155AC', '#DE1484']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.salesCardContainer}
            >
                <Text style={styles.saleText}>Ventas del Mes</Text>
                <Text style={styles.salesTextStrong}>${formattedTotalSales}</Text>
                <Text style={styles.salesPercentageText}><Text style={styles.salesPercentage}>15%</Text> más que el mes pasado.</Text>
            </LinearGradient>
            <View style={styles.couponsCardsContainer}>
                <View style={styles.topCouponsCards}>
                    <Text style={styles.topTextCoupons}>Cupones recientes</Text>
                    <TouchableOpacity>
                        <Text style={styles.topButtonTextCoupons}>Administrar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.couponsContainer}>
                    <CouponCardCompnent 
                        onPressCoupon={() => console.log("Presionando la card del cupon")}
                        stateCoupon={'pausado'}
                        nameCoupon={'HASK45'}
                        usageCoupon={7}
                        typeOfDiscount={'porcentaje'}
                        discount={30}
                        onPressEditCoupon={() => console.log("Editar cupon")}
                        onPressPauseCoupon={() => console.log("Pausar cupon")}
                        colorCoupon={'#f27a24ff'}
                    />
                    <CouponCardCompnent 
                        onPressCoupon={() => console.log("Presionando la card del cupon")}
                        stateCoupon={'expirado'}
                        nameCoupon={'HASK85'}
                        usageCoupon={21}
                        typeOfDiscount={'cantidad'}
                        discount={1500}
                        onPressEditCoupon={() => console.log("Editar cupon")}
                        onPressPauseCoupon={() => console.log("Pausar cupon")}
                        colorCoupon={'#0b0984ff'}
                    />
                    <CouponCardCompnent 
                        onPressCoupon={() => console.log("Presionando la card del cupon")}
                        stateCoupon={'activo'}
                        nameCoupon={'HASJ98'}
                        usageCoupon={90}
                        typeOfDiscount={'cantidad'}
                        discount={700}
                        onPressEditCoupon={() => console.log("Editar cupon")}
                        onPressPauseCoupon={() => console.log("Pausar cupon")}
                        colorCoupon={'#ee2424ff'}
                    />
                </View>
                
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: moderateScale(40),
        paddingHorizontal: moderateScale(20), 
        backgroundColor: '#fff',
        gap: moderateScale(20),
        paddingBottom: moderateScale(128)
    },
    cardsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    photo: {
        width: screenWidht * 0.15,
        height: screenWidht * 0.14
    },
    nameContainer: {
        flexDirection: 'column',
        gap: moderateScale(8)
    },
    name: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(32),
        color: '#111827'
    },
    description: {
        fontFamily: 'system-ui',
        fontWeight: 400,
        fontSize: moderateScale(16),
        color: '#4B5563',
    },
    salesCardContainer: {
        flexDirection: 'column',
        gap: moderateScale(8),
        borderRadius: moderateScale(12),
        padding: moderateScale(16)
    },
    saleText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(16),
        color: '#ffffff'
    },
    salesTextStrong: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(32),
        color: '#ffffff'
    },
    salesPercentage: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(14),
        color: '#ffffff'
    },
    salesPercentageText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(14),
        color: '#ffffff'
    },
    couponsCardsContainer: {
        flexDirection: 'column',
        gap: moderateScale(12)
    },
    topCouponsCards: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    couponsContainer: {
        gap: moderateScale(12)
    },
    topButtonTextCoupons: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(14),
        color: '#DE1484'
    },
    topTextCoupons: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(20),
        color: '#000000'
    }
    
});