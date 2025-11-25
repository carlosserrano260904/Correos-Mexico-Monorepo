import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SquarePen, CircleSlash } from 'lucide-react-native';
import StatesCouponsComponent from './statesCouponsComponent';
import ModalSellerComponent from './modalSellerComponent';

const screenWidht = Dimensions.get('window').width;

export default function CouponCardCompnent({
    // Pide el onPress de la card del cupón
    onPressCoupon,
    // Pide el estado del cupón
    stateCoupon,
    // Pide el nombre del cupón
    nameCoupon,
    // Pide las veces que se ha usado el cupón
    usageCoupon,
    // Pide el tipo de descuento
    typeOfDiscount,
    // Pide el valor del descuento
    discount,
    // Pide el onPress del botón de editar cupón
    onPressEditCoupon,
    // Pide el color del cupón
    colorCoupon,
}: {
    onPressCoupon: any;
    // Es el estado del cupon activo, expirado o pausado igual que el StatesCouponsComponent
    stateCoupon: 'activo' | 'expirado' | 'pausado';
    nameCoupon: string;
    usageCoupon: number;
    typeOfDiscount: 'porcentaje' | 'cantidad';
    discount: number;
    onPressEditCoupon: any;
    onPressPauseCoupon: any;
    colorCoupon: string;
}) {
    // Define el color de fondo del descuento
    const discountBgColor = colorCoupon;
    // Define el color del texto del descuento
    const [colorText, setColorText] = React.useState('#FFFFFF');
    // Define si se va a mostrar el modal de deshabilitar el cupon
    const [showDisableModal, setShowDisableModal] = useState(false)
    // Define si se va a mostrar el modal de editar cupon
    const [showEditCouponModal, setShowEditCouponModal] = useState(false)

    // Determina el color del texto basado en el color de fondo para asegurar legibilidad
    useEffect(() => {
        setColorText(determineTextColor(discountBgColor));
    }, []);

    // Función para determinar el color del texto basado en el color de fondo
    const determineTextColor = (bgColor: string): string => {
        // Quita el símbolo #
        const color = bgColor.replace('#', '');

        // Convierte a valores RGB
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);

        // Calcula el brillo (según fórmula de percepción visual)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Si es brillante, usa texto oscuro; si no, texto claro
        return brightness > 155 ? '#000000' : '#FFFFFF';
    };

    return(
        <TouchableOpacity activeOpacity={0.4} style={styles.container} onPress={onPressCoupon}>
            <View>
                <StatesCouponsComponent type={stateCoupon}/>
            </View>
            <View style={styles.informationContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.firstText}>{nameCoupon}</Text>
                    <Text style={styles.secondText}>Usado {usageCoupon} veces</Text>
                    <View style={styles.buttonsContainer}> 
                        <TouchableOpacity activeOpacity={0.2} style={styles.buttonAction} onPress={() => setShowEditCouponModal(true)}>
                            <SquarePen  size={moderateScale(18)} color={'#9CA3AF'}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.2} style={styles.buttonAction} onPress={() => setShowDisableModal(true)}>
                            <CircleSlash size={moderateScale(18)} color={'#9CA3AF'}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={[styles.discountContainer, {backgroundColor: discountBgColor}]}>
                        {
                            typeOfDiscount === 'cantidad' ? (<Text style={[styles.discountText, {color: colorText}]}>${discount}</Text>) :
                            typeOfDiscount === 'porcentaje' ? (<Text style={[styles.discountText, {color: colorText}]}>{discount}%</Text>) :
                            (<Text style={[styles.discountText, {color: colorText}]}>--</Text>)
                        }
                        
                        <Text style={[styles.secondDiscountText, {color: colorText}]}>Off</Text>
                    </View>
                </View>
            </View>
            <Modal
                animationType='fade'
                transparent={false}
                visible={showDisableModal}
                backdropColor={'#0000005e'}
                onRequestClose={() => setShowDisableModal(!showDisableModal)}
            >
                <ModalSellerComponent 
                    onPressNormalButton={() => console.log('Presione el boton normal')}
                    onPressCancelButton={() => setShowDisableModal(!showDisableModal)}
                    type={'quitar-cupon'}
                />
            </Modal>
            <Modal
                animationType='fade'
                transparent={false}
                visible={showEditCouponModal}
                backdropColor={'#0000005e'}
                onRequestClose={() => setShowEditCouponModal(!showEditCouponModal)}
            >
                <ModalSellerComponent 
                    onPressNormalButton={() => console.log('Presione el boton normal')}
                    onPressCancelButton={() => setShowEditCouponModal(!showEditCouponModal)}
                    type={'actualizar-cupon'}
                />
            </Modal>
        </TouchableOpacity>

        
    );
}

const styles = StyleSheet.create({
    container: {
        padding: moderateScale(16),
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
        flexDirection: 'column',
        gap: moderateScale(8),
    },
    informationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'column',
        gap: moderateScale(4),
    },
    firstText: {
        fontFamily: 'system-ui',
        fontWeight: '700',
        fontSize: moderateScale(20),
        color: '#1F2937',
    },
    secondText: {
        fontFamily: 'system-ui',
        fontWeight: '400',
        fontSize: moderateScale(14),
        color: '#4B5563',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: moderateScale(12),
        marginTop: moderateScale(8),
    },
    buttonAction: {
        padding: moderateScale(8),
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    discountContainer: {
        width: screenWidht * 0.25,
        height: screenWidht * 0.25,
        borderRadius: moderateScale(100),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: moderateScale(2),
    },
    discountText: {
        fontFamily: 'system-ui',
        fontWeight: '700',
        fontSize: moderateScale(20),
        textAlign: 'center',
        paddingHorizontal: moderateScale(8),
    },
    secondDiscountText: {
        fontFamily: 'system-ui',
        fontWeight: '400',
        fontSize: moderateScale(14),
    },

});