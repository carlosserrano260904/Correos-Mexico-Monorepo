import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { BadgePlus } from 'lucide-react-native';
import TopButtonSellerComponent from '../../components/SellerComponents/topButtonSellerComponent';
import ProductCardSellerComponent from '../../components/SellerComponents/productCardSellerComponent';
import FilterTabs from '../../components/SellerComponents/filterTabsComponent';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

// Define el tipo para los productos
type Producto = {
    id: number;
    status: string;
    nombre: string;
    precio: number;
    sold: number;
    stock: number;
};

export default function ProductsScreenSeller() {

    // Imagen logo
    const logo = require('../../assets/icons_correos_mexico/correos_clic_Logo.png')

    // Array de ejemplo para los productos
    const [productos, setProductos] = useState<Producto[]>([])
    // Define el array de productos filtrados, como default son todos los productos
    const [filtradas, setFiltradas] = useState(productos);
    // Define si se se estan cargando los productos
    const [loadingProducts, setLoadingProducts] = useState(true)

    // Funcion para renderizar la card de los productos
    const renderProducts = ({item}: {item: typeof productos[number]}) => {
        return (
            <ProductCardSellerComponent 
                statusProduct={item.status.toLowerCase() as 'activo' | 'pausado'}
                nameProduct={item.nombre}
                priceProduct={item.precio}
                soldProducts={item.sold}
                stock={item.stock}
                onPressCardProduct={() => console.log('Presione la card del producto')}
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

    // Define las categorias que se van a filtrar por los productos dando la palabra clave del valor a buscar
    const categorias = getFormattedCategories(productos, 'status');

    useEffect(() => {
        const productosEndpoint = [
            { id: 1, nombre: 'Jarrón Artesanal Ultra HD 4K', status: 'activo', precio: 2000.90, stock: 50, sold: 10, },
            { id: 2, nombre: 'Camara de fotos', status: 'pausado', precio: 4520.00, stock: 100, sold: 90, },
            { id: 3, nombre: 'Humificador inalambrico', status: 'pausado', precio: 300, stock: 10, sold: 5, },
            { id: 4, nombre: 'Osito de peluche', status: 'activo', precio: 499, stock: 5, sold: 2, },
            { id: 5, nombre: 'Computadora ASUS 4090', status: 'activo', precio: 30500.80, stock: 1150, sold: 546, },
        ]

        setProductos(productosEndpoint)
        setLoadingProducts(false)
    }, [])

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={styles.container}> 
                <View style={styles.topContainer}>
                    <Image style={styles.photo} source={logo}/>
                    <TopButtonSellerComponent icon={<BadgePlus size={screenWidth * 0.047} color={'#6B7280'}/>} text='Crear producto' onPressTopButton={() => console.log('Crear producto')}/>
                </View>
                <View style={styles.tabsContainer}>
                    <Text style={styles.textTab}>Mis Productos</Text>
                    <FilterTabs 
                        categories={categorias}
                        data={productos}
                        onFilter={setFiltradas}
                        categoryKey='status'
                        nameAll='Todos'
                    />
                </View>
                <View>
                    {loadingProducts ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>No hay productos disponibles</Text>
                        </View>
                    ) : (
                        <FlatList 
                        data={filtradas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderProducts}
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