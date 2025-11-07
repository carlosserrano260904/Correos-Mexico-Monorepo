import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProductCardSellerComponent from '../../components/SellerComponents/productCardSellerComponent';

export default function ProductsScreenSeller() {

    return(
        <View style={styles.container}> 
            <Text style={styles.title}>Products Screen Seller</Text>
            <Text style={styles.description}>Screen for see seller products</Text>
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