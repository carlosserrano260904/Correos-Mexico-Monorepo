import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { BadgePlus } from 'lucide-react-native';
import TopButtonSellerComponent from '../../components/SellerComponents/topButtonSellerComponent';
import FilterTabs from '../../components/SellerComponents/filterTabsComponent';
import CouponCardCompnent from '../../components/SellerComponents/couponCardComponent';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

// Define el tipo para los cupones
type Coupon = {
    id: number;
    status: string;
    nombre: string;
    descuento: number;
    tipoDescuento: string;
    usado: number;
    color: string;
};

export default function CouponsScreenSeller() {

    // Imagen logo
    const logo = require('../../assets/icons_correos_mexico/correos_clic_Logo.png')
    
    // Array de ejemplo para los cupones
    const [cupones, setCupones] = useState<Coupon[]>([])
    // Define el array de cupones filtrados, como default son todos los cupones
    const [filtradas, setFiltradas] = useState(cupones);
    // Define si se se estan cargando los cupones
    const [loadingCoupons, setLoadingCoupons] = useState(true)
    
    // Funcion para renderizar la card de los cupones
    const renderCoupons = ({item}: {item: typeof cupones[number]}) => {
        return (
            <CouponCardCompnent 
                onPressCoupon={() => console.log("Presionando la card del cupon")}
                stateCoupon={item.status.toLowerCase() as 'activo' | 'pausado' | 'expirado'}
                nameCoupon={item.nombre}
                usageCoupon={item.usado}
                typeOfDiscount={item.tipoDescuento.toLowerCase() as 'porcentaje' | 'cantidad'}
                discount={item.descuento}
                colorCoupon={item.color}
                item={item}
            />
        );      
    }
    
    // Estructura de la categoria
    type CategoryItem = { label: string; value: string}
    // Funcion para obtener las categorias de filtrado
    function getFormattedCategories<T extends Record<string, any>>(data: T[], key: keyof T): CategoryItem[] {
        // Define los valores unics de cada categoria
        const uniqueValues = new Set<string>();

        data.forEach(item => {
            // Define el valor de cada item
            const value = item[key];

            // Si el valor es un string o number, este se agrega a la lista de valores
            if (typeof value === 'string' || typeof value === 'number') {
            uniqueValues.add(String(value));
            }
        });

        // Funcion para formaterar las labels de los valores
        const formatted = Array.from(uniqueValues).map(val => {
            let label = val;

            label = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();

            // Si el label es En revison se queda igual
            if (label === 'En revision') label = 'En revisión';
            // Agrega "s" al final
            else if (!label.endsWith('s')) label += 's';
            
            // Regresa la estructura de la categoria
            return {
                label,   // lo que se muestra
                value: val, // valor real usado para filtrar
            };
        });

        return formatted;
    }
    
        // Define las categorias que se van a filtrar por los cupones dando la palabra clave del valor a buscar
    const categorias = getFormattedCategories(cupones, 'status');
    
    // Cuando se renderiza la pantalla agrega los cupones al array de objetos
    useEffect(() => {
        const couponsEndpoint = [
            { id: 1, nombre: 'KJASD456', status: 'activo', descuento: 10, tipoDescuento: 'porcentaje', usado: 3, color: '#f27a24ff' },
            { id: 2, nombre: 'JSFDKJ78', status: 'pausado', descuento: 1000, tipoDescuento: 'cantidad', usado: 30, color: '#0a5007ff' },
            { id: 3, nombre: 'SDFSDKF7', status: 'pausado', descuento: 50, tipoDescuento: 'porcentaje', usado: 10, color: '#2f63ffff' },
            { id: 4, nombre: 'VERANO 2025', status: 'expirado', descuento: 520, tipoDescuento: 'cantidad', usado: 2, color: '#ef7ac0ff' },
            { id: 5, nombre: 'INVIERNO 2026', status: 'activo', descuento: 33, tipoDescuento: 'porcentaje', usado: 44, color: '#f2242bff' },

        ]
        
        // Setea los cupones
        setCupones(couponsEndpoint)
        // Marca el cargar como false
        setLoadingCoupons(false)
    }, [])

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={styles.container}> 
                <View style={styles.topContainer}>
                    <Image style={styles.photo} source={logo}/>
                    <TopButtonSellerComponent icon={<BadgePlus size={screenWidth * 0.047} color={'#6B7280'}/>} text='Crear cupón' onPressTopButton={() => console.log('Crear producto')}/>
                </View>
                <View style={styles.tabsContainer}>
                    <Text style={styles.textTab}>Mis Cupones</Text>
                    <FilterTabs 
                        categories={categorias}
                        data={cupones}
                        onFilter={setFiltradas}
                        categoryKey='status'
                        nameAll='Todos'
                    />
                </View>
                <View>
                    {loadingCoupons ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>No hay cupones disponibles</Text>
                        </View>
                    ) : (
                        <FlatList 
                            data={filtradas}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderCoupons}
                            scrollEnabled={false}
                            contentContainerStyle={styles.productsContainer}
                        />
                    )}
                            
                </View>     
            </ScrollView>
        </SafeAreaView>
    )
}
        
const styles = StyleSheet.create({
    container: {
         paddingTop: screenHeight * 0.025,
        paddingHorizontal: screenWidth * 0.052, 
        backgroundColor: '#fff',
        gap: screenHeight * 0.025,
        paddingBottom: screenHeight * 0.14,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    photo: {
        width: screenWidth * 0.15,
        height: screenWidth * 0.14
    },
    tabsContainer: {
        gap: screenHeight * 0.015,
        flexDirection: 'column'
    },
    textTab: {
        fontFamily: 'system-ui',
        fontWeight: 700,
        fontSize: screenHeight * 0.029,
        color: '#000000'
    },
    productsContainer: {
        gap: screenHeight * 0.025
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        fontFamily: 'system-ui',
        fontWeight: 500,
        color: '#9CA3AF'
    }        
})