import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import FilterTabs from '../../components/SellerComponents/filterTabsComponent';
import OrderCardComponent from '../../components/SellerComponents/orderCardComponent';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

// Define el tipo para los pedidos
type Order = {
    id: number;
    status: string;
    nombre: string;
    fecha: string;
    productosDistintos: number;
    total: number;
};

export default function OrdersScreenSeller() {

    // Imagen logo
    const logo = require('../../assets/icons_correos_mexico/correos_clic_Logo.png')
        
    // Array de ejemplo para los pedidos
    const [pedidos, setPedidos] = useState<Order[]>([])
    // Define el array de pedidos filtrados, como default son todos los pedidos
    const [filtradas, setFiltradas] = useState(pedidos);
    // Define si se se estan cargando los pedidos
    const [loadingOrders, setLoadingOrders] = useState(true)
        
    // Funcion para renderizar la card de los pedidos
    const renderOrders = ({item}: {item: typeof pedidos[number]}) => {
        return (
            <OrderCardComponent
                statusOrder={item.status.toLowerCase() as 'pendiente' | 'enviado' | 'entregado' | 'cancelado'}
                nameOrder={item.nombre}
                dateOrder={new Date(item.fecha + 'T00:00:00')}
                numberDistinct={item.productosDistintos}
                totalOrder={item.total}
                onPressOrder={() => console.log('Presione el boton de orden')}
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
        
    // Define las categorias que se van a filtrar por los productos dando la palabra clave del valor a buscar
    const categorias = getFormattedCategories(pedidos, 'status');
        
    useEffect(() => {
        const ordersEndpoint = [
            { id: 1, nombre: 'OKSDOF8978', status: 'pendiente', fecha: '2025-10-23', productosDistintos: 2, total: 324.23 },
            { id: 2, nombre: 'OKSDOF8979', status: 'enviado', fecha: '2025-10-22', productosDistintos: 1, total: 554.24 },
            { id: 3, nombre: 'OKSDOF8956', status: 'entregado', fecha: '2025-09-10', productosDistintos: 5, total: 5646 },
            { id: 4, nombre: 'OKSDOF8923', status: 'cancelado', fecha: '2025-06-21', productosDistintos: 1, total: 878.99 },
        ]
        
        setPedidos(ordersEndpoint)
        setLoadingOrders(false)
    }, [])

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={styles.container}> 
                <View style={styles.topContainer}>
                    <Image style={styles.photo} source={logo}/>
                </View>
                <View style={styles.tabsContainer}>
                    <Text style={styles.textTab}>Mis Pedidos</Text>
                    <FilterTabs 
                        categories={categorias}
                        data={pedidos}
                        onFilter={setFiltradas}
                        categoryKey='status'
                        nameAll='Todos'
                    />
                </View>
                <View>
                    {loadingOrders ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>No hay pedidos disponibles</Text>
                        </View>
                    ) : (
                        <FlatList 
                            data={filtradas}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderOrders}
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