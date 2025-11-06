import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SquarePen, Pause } from 'lucide-react-native';
import StatesComponent from './statesComponent';
import CircularProgress from './circularProgress';
import ModalSellerComponent from './modalSellerComponent';

export default function ProductCardSellerComponent({
    // Pide el estatus en el que se encuentra el producto
    statusProduct,
    // Pide el nombre del producto
    nameProduct,
    // Pide el precio del producto
    priceProduct,
    // Pide el numero de unidades vendidas del producto
    soldProducts,
    // Pide el stock actual del producto
    stock,
    // Pide la logica del onPress para editar el producto
    onPressEditProduct,
    // Pide la logica del onPress para pausar el producto
    onPressPauseProduct,
    // Pide la logica del onPress de toda la card del producto
    onPressCardProduct,
} : {
    // Define el estatus del producto que coincide con el componente StatesComponent
    statusProduct: 'activo' | 'pausado';
    nameProduct: string;
    priceProduct: number;
    soldProducts: number,
    stock: number,
    onPressEditProduct: any,
    onPressPauseProduct: any,
    onPressCardProduct: any,
}) {

    // Define si se va a mostrar de pausar producto
        const [showPauseProductModal, setShowPauseProductModal] = useState(false)
        // Define si se va a mostrar el modal de editar cupon
        const [showEditProductModal, setShowEditProductModal] = useState(false)
    // Formatea el precio del producto para que sea mas facil del leer para el usuario
    const formattedPrice = priceProduct.toLocaleString('en-US', {
        style: 'decimal',
        useGrouping: true,
        // Indica cual es el numero minimo de decimales
        minimumFractionDigits: 2,
    });

    return (
        <TouchableOpacity activeOpacity={0.4} style={styles.container} onPress={onPressCardProduct}>
            <View style={styles.leftContainer}>
                <View>
                    <StatesComponent type={statusProduct} />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.nameText} numberOfLines={2} ellipsizeMode={'tail'}>{nameProduct}</Text>
                    <Text style={styles.priceText}>${formattedPrice} MXN</Text>
                </View>
                <View style={styles.stockContainer}>
                    <Text style={styles.stockText}>Vendidos: <Text style={styles.stockTextStrong}>{soldProducts}</Text></Text>
                    <Text style={styles.stockText}>Stock: <Text style={styles.stockTextStrong}>{stock}</Text></Text>
                </View>
                <View style={styles.buttonsContainer}> 
                        <TouchableOpacity activeOpacity={0.2} style={styles.buttonAction} onPress={() => setShowEditProductModal(true)}>
                            <SquarePen  size={moderateScale(18)} color={'#9CA3AF'}/>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.2} style={styles.buttonAction} onPress={() => setShowPauseProductModal(true)}>
                            <Pause size={moderateScale(18)} color={'#9CA3AF'}/>
                        </TouchableOpacity>
                </View>
            </View>
            <View style={styles.percentageContainer}>
                <CircularProgress percentage={Math.round((100 / stock) * (stock - soldProducts))}/>
                <Text style={styles.percentageText} numberOfLines={1} ellipsizeMode={'tail'}>Porcentaje en stock</Text>
            </View>

            <Modal
                animationType='fade'
                transparent={false}
                visible={showPauseProductModal}
                backdropColor={'#0000005e'}
                onRequestClose={() => setShowPauseProductModal(!showPauseProductModal)}
            >
                <ModalSellerComponent 
                    onPressNormalButton={() => console.log('Presione el boton normal')}
                    onPressCancelButton={() => setShowPauseProductModal(!showPauseProductModal)}
                    type={'quitar-producto'}
                />
            </Modal>

            <Modal
                animationType='fade'
                transparent={false}
                visible={showEditProductModal}
                backdropColor={'#0000005e'}
                onRequestClose={() => setShowEditProductModal(!showEditProductModal)}
            >
                <ModalSellerComponent 
                    onPressNormalButton={() => console.log('Presione el boton normal')}
                    onPressCancelButton={() => setShowEditProductModal(!showEditProductModal)}
                    type={'actualizar-producto'}
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
        flexDirection: 'row',
        gap: moderateScale(8),
        justifyContent: 'space-between'
    },
    leftContainer: {
        flexDirection: 'column',
        gap: moderateScale(8),
        width: '50%'
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
    nameContainer: {
        flexDirection: 'column',
        gap: moderateScale(4)
    },
    nameText: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(16),
        color: '#DE1484'
    },
    priceText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(20),
        color: '#374151'
    },
    stockContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: moderateScale(4),
        flexWrap: 'wrap'
    },
    stockText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(14),
        color: '#6B7280'
    },
    stockTextStrong: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(14),
        color: '#374151'
    },
    percentageContainer: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '50%',
        alignItems: 'center'
    },
    percentage: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: moderateScale(28),
        color: '#111827'
    },
    percentageText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        fontSize: moderateScale(12),
        color: '#6B7280'
    }

});