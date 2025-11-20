import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { BadgePlus } from 'lucide-react-native';
import TopButtonSellerComponent from '../../components/SellerComponents/topButtonSellerComponent';
import RequestCardComponent from '../../components/SellerComponents/requestCardComponent';
import ProductCardSellerComponent from '../../components/SellerComponents/productCardSellerComponent';
import FilterTabs from '../../components/SellerComponents/filterTabsComponent';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height

// Define el tipo para las solicitudes
type Request = {
    id: number;
    status: string;
    nombre: string;
    fecha: string;
    numeroImagenes: number;
    precio: number;
};

export default function RequestScreenSeller() {

    // Imagen logo
    const logo = require('../../assets/icons_correos_mexico/correos_clic_Logo.png')

    // Array de ejemplo para las solicitudes
    const [solicitudes, setSolicitudes] = useState<Request[]>([])
    // Define el array de solicitudes filtradas, como default son todas las solicitudes
    const [filtradas, setFiltradas] = useState(solicitudes);
    // Define si se se estan cargando las solicitudes
    const [loadingRequests, setLoadingRequests] = useState(true)

    // Funcion para renderizar la card de las solicitudes
    const renderRequests = ({item}: {item: typeof solicitudes[number]}) => {
        return (
            <RequestCardComponent 
                statusRequest={item.status.toLowerCase() as 'en-revision' | 'aprobado' | 'rechazado' | 'observaciones'}
                nameRequest={item.nombre}
                dateRequest={new Date(item.fecha + 'T00:00:00')}
                numberImages={item.numeroImagenes}
                priceRequest={item.precio}
                onPressRequest={() => console.log('Presione la solicitud ' + item.id)}
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

            // Si el valor es en-revison, se cambia su label a En revision
            if (val === 'en-revision') label = 'En revision';
            // Si no el laber va a ser la primera letra mayuscula y lo demas en minuscula
            else label = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();

            // Si el label es En revison se queda igual
            if (label === 'En revision') label = 'En revisión';
            else if(label === 'Aprobado') label = 'Aprobadas'
            else if (label === 'Rechazado') label = 'Rechazadas'
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
    const categorias = getFormattedCategories(solicitudes, 'status');

    useEffect(() => {
        const requestsEndpoint = [
            { id: 1, nombre: 'SIDFIO89456', status: 'en-revision', precio: 2000.90, fecha: '2025-10-10', numeroImagenes: 5, },
            { id: 2, nombre: 'SIDFIO89445', status: 'aprobado', precio: 465.23, fecha: '2025-10-17', numeroImagenes: 5, },
            { id: 3, nombre: 'SIDFIO89446', status: 'observaciones', precio: 8798, fecha: '2025-04-11', numeroImagenes: 5, },
            { id: 4, nombre: 'SIDFIO89231', status: 'rechazado', precio: 1158.33, fecha: '2024-12-10', numeroImagenes: 5, },
        ]

        setSolicitudes(requestsEndpoint)
        setLoadingRequests(false)
    }, [])

    console.log(filtradas)
    return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <ScrollView contentContainerStyle={styles.container}> 
                <View style={styles.topContainer}>
                    <Image style={styles.photo} source={logo}/>
                </View>
                <View style={styles.tabsContainer}>
                    <Text style={styles.textTab}>Mis Solicitudes</Text>
                    <FilterTabs 
                        categories={categorias}
                        data={solicitudes}
                        onFilter={setFiltradas}
                        categoryKey='status'
                        nameAll='Todas'
                    />
                </View>
                <View>
                    {loadingRequests ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>No hay solicitudes disponibles</Text>
                        </View>
                    ) : (
                        <FlatList 
                        data={filtradas}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderRequests}
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