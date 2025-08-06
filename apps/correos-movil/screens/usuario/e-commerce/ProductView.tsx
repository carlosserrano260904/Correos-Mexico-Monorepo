import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { useRoute, useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyAuth } from '../../../context/AuthContext';
import ProductListScreen, { Articulo } from '../../../components/Products/ProductRecommended'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IP = process.env.EXPO_PUBLIC_API_URL;

function ProductView() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as { id: string };
    console.log("ID del producto recibido en la ruta:", id);

    const [product, setProduct] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [liked, setLiked] = React.useState(false);
    const [inCart, setInCart] = React.useState(false);
    const [favoritoId, setFavoritoId] = React.useState<number | null>(null);
    const [carritoId, setCarritoId] = React.useState<number | null>(null);
    const { userId } = useMyAuth();
    const [recommended, setRecommended] = React.useState<any[]>([]);
    const isMounted = React.useRef(true);

    // Formatear precio
    const formatPrice = (price: number) => {
        return `MXN $ ${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Obtener userId una sola vez
    const getUserId = React.useCallback(async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            return storedUserId ? Number(storedUserId) : userId;
        } catch (err) {
            console.error("Error al obtener userId de AsyncStorage:", err);
            return null;
        }
    }, [userId]);

    React.useEffect(() => {
        return () => {
            isMounted.current = false; // Marcar componente como desmontado
        };
    }, []);

    React.useEffect(() => {
        const fetchProduct = async () => {
            const controller = new AbortController();
            try {
                setLoading(true);
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch(`${IP}/api/products/${id}`, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}. Detalle: ${errorText}`);
                }
                const data = await response.json();
                const transformedData = {
                    id: data.id,
                    name: data.nombre,
                    description: data.descripcion,
                    images: data.imagen ? [data.imagen, data.imagen, data.imagen] : [],
                    price: parseFloat(data.precio),
                    category: data.categoria,
                    color: data.color
                };
                if (isMounted.current) {
                    setProduct(transformedData);
                }
            } catch (err: any) {
                if (isMounted.current) {
                    if (err.name === 'AbortError') {
                        setError("La solicitud tardó demasiado en responder (tiempo de espera agotado).");
                    } else {
                        setError(err.message || "Error desconocido al obtener los datos del producto.");
                    }
                    console.error("Error fetching product:", err);
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchProduct();
        } else {
            setLoading(false);
            setError("ID del producto no proporcionado en la ruta.");
        }
    }, [id]);

    React.useEffect(() => {
        const verificarEstado = async () => {
            const userId = await getUserId();
            if (!userId) return;

            const controller = new AbortController();
            try {
                // Ejecutar solicitudes de forma secuencial para evitar condiciones de carrera
                const resFav = await fetch(`${IP}/api/favoritos/${userId}`, { signal: controller.signal });
                const favoritos = await resFav.json();
                const fav = favoritos.find((f: any) => f.producto.id === Number(id));
                if (isMounted.current && fav) {
                    setLiked(true);
                    setFavoritoId(fav.id);
                }

                const resCart = await fetch(`${IP}/api/carrito/${userId}`, { signal: controller.signal });
                const carrito = await resCart.json();
                const item = carrito.find((c: any) => c.producto.id === Number(id));
                if (isMounted.current && item) {
                    setInCart(true);
                    setCarritoId(item.id);
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error("Error verificando favoritos o carrito:", err);
                }
            }
        };

        if (product && isMounted.current) {
            verificarEstado();
        }
    }, [product, getUserId]);

    React.useEffect(() => {
        const controller = new AbortController();
        const fetchRecommended = async () => {
            try {
                if (!product || !product.category) {
                    console.log("No se puede cargar productos recomendados: product o category no están disponibles");
                    return;
                }
                console.log("Cargando productos recomendados para la categoría:", product.category);
                const response = await fetch(`${IP}/api/products/random/${product.category}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (isMounted.current) {
                    setRecommended(Array.isArray(data) ? data : []);
                    console.log("Productos recomendados obtenidos (data):", data);
                }
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error("Error al cargar productos recomendados:", err);
                    if (isMounted.current) {
                        setRecommended([]);
                    }
                } else {
                    console.log("Fetch abortado");
                }
            }
        };

        if (product && product.category && isMounted.current) {
            fetchRecommended();
        }

        return () => {
            controller.abort();
        };
    }, [product]);



    const toggleFavorito = async () => {
        const userId = await getUserId();
        if (!userId) return;

        const controller = new AbortController();
        try {
            if (!liked) {
                const res = await fetch(`${IP}/api/favoritos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profileId: userId, productId: Number(id) }),
                    signal: controller.signal,
                });
                const data = await res.json();
                if (isMounted.current) {
                    setFavoritoId(data.id);
                    setLiked(true);
                }
            } else if (favoritoId) {
                await fetch(`${IP}/api/favoritos/${favoritoId}`, {
                    method: 'DELETE',
                    signal: controller.signal,
                });
                if (isMounted.current) {
                    setFavoritoId(null);
                    setLiked(false);
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Error al manejar favoritos:", err);
            }
        }
    };

    const toggleCarrito = async () => {
        const userId = await getUserId();
        if (!userId) return;

        const controller = new AbortController();
        try {
            if (!inCart) {
                const res = await fetch(`${IP}/api/carrito`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        profileId: userId,
                        productId: Number(id),
                        cantidad: 1,
                    }),
                    signal: controller.signal,
                });
                const data = await res.json();
                if (isMounted.current) {
                    setCarritoId(data.id);
                    setInCart(true);
                }
            } else if (carritoId) {
                await fetch(`${IP}/api/carrito/${carritoId}`, {
                    method: 'DELETE',
                    signal: controller.signal,
                });
                if (isMounted.current) {
                    setCarritoId(null);
                    setInCart(false);
                }
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Error al manejar carrito:", err);
            }
        }
    };

    const progress = useSharedValue<number>(0);
    const baseOptions = {
        vertical: false,
        width: screenWidth,
        height: verticalScale(350),
    } as const;

    const ref = React.useRef<ICarouselInstance>(null);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    const placeholderImage = require('../../../assets/placeholder.jpg');

    const carouselImageData = product?.images && product.images.length > 0
        ? product.images.map((img: string, index: number) => ({
            id: `img-${index}`,
            image: { uri: img }
        }))
        : [
            { id: '1', image: placeholderImage },
            { id: '2', image: placeholderImage },
            { id: '3', image: placeholderImage },
        ];

    const renderItem = ({ item }: { item: { id: string; image: any } }) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
        </View>
    );

    const colorNameMap: { [key: string]: string } = {
        '#fff': 'Blanco',
        '#000': 'Negro',
        '#FF0000': 'Rojo',
        '#77a345': 'Verde Lima',
        '#FFC0CB': 'Rosa'
    };

    const colorName = product?.color ? colorNameMap[product.color] || `Color ${product.color}` : 'No disponible';

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color="#DE1484" />
                <Text style={styles.loadingText}>Cargando producto...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Error al cargar el producto:</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.errorTextSmall}>
                    Este error a menudo se debe a problemas de conexión o configuración del servidor.
                    Verifica lo siguiente:
                    1.  **`API_BASE_URL` en el código:** Usa `http://10.0.2.2:3000` para emuladores Android o la IP local de tu PC para dispositivos físicos.
                    2.  **Configuración del servidor backend:** Asegúrate de que el servidor Express esté escuchando en `0.0.0.0`.
                    3.  **Firewall:** Comprueba que el puerto `3000` no esté bloqueado.
                    4.  **ID del producto:** Verifica que el ID (`${id}`) sea válido en tu base de datos.
                </Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>No se encontró el producto con ID: {id}.</Text>
                <Text style={styles.errorTextSmall}>
                    Esto puede suceder si el ID no corresponde a un producto en la API o si la API devuelve un resultado vacío.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.carouselContainer}>
                <Carousel
                    ref={ref}
                    {...baseOptions}
                    loop
                    onProgressChange={progress}
                    style={styles.carousel}
                    data={carouselImageData}
                    renderItem={renderItem}
                />
                <Pagination.Basic<{ color: string }>
                    progress={progress}
                    data={carouselImageData.map((image) => ({ image }))}
                    size={scale(8)}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={styles.activeDotStyle}
                    containerStyle={styles.paginationContainer}
                    horizontal
                    onPress={onPressPagination}
                />
                <TouchableOpacity style={styles.xmarkerContainer} onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon={faXmark} size={moderateScale(20)} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorito} style={styles.heartContainer}>
                    <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? "#DE1484" : "#000"} size={moderateScale(24)} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCarrito} style={[styles.heartContainer, styles.cartContainer]}>
                    <FontAwesomeIcon icon={faCartShopping} color={inCart ? "#DE1484" : "#000"} size={moderateScale(24)} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.productNameContainer}>
                    <Text style={styles.productName} numberOfLines={3} ellipsizeMode="tail">
                        {product.name || 'Nombre del Producto'}
                    </Text>
                    <Text style={styles.productPrice}>{formatPrice(product.price || 0)}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Categoría:</Text>
                        <Text style={styles.infoValue}>{product.category || 'No disponible'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Color:</Text>
                        <View style={styles.colorDisplay}>
                            <View style={[styles.colorCircle, { backgroundColor: product.color || '#fff' }]} />
                            <Text style={styles.infoValue}>{colorName}</Text>
                        </View>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.infoLabel}>Descripción:</Text>
                        <Text style={styles.description}>{product.description || 'Descripción del producto.'}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={toggleCarrito}>
                    <Text style={styles.addButtonText}>{inCart ? 'Quitar del carrito' : 'Añadir al carrito'}</Text>
                </TouchableOpacity>

                <View style={styles.recommendedContainer}>
                    <Text style={styles.recommendedTitle}>Recomendados para ti</Text>
                    <ProductListScreen productos={recommended} />
                </View>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    carouselContainer: {
        borderRadius: moderateScale(20),
        overflow: 'hidden',
    },
    carousel: {
        width: screenWidth,
        position: 'relative',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: moderateScale(20),
    },
    loadingText: {
        marginTop: moderateScale(10),
        fontSize: moderateScale(16),
        color: '#333',
    },
    errorText: {
        color: 'red',
        fontSize: moderateScale(16),
        textAlign: 'center',
        marginBottom: moderateScale(10),
    },
    errorTextSmall: {
        color: 'red',
        fontSize: moderateScale(12),
        textAlign: 'center',
        marginHorizontal: moderateScale(20),
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    xmarkerContainer: {
        position: 'absolute',
        zIndex: 10,
        top: moderateScale(40),
        left: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: moderateScale(12),
        width: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    heartContainer: {
        position: 'absolute',
        zIndex: 11,
        bottom: moderateScale(20),
        right: moderateScale(12),
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: moderateScale(25),
        width: moderateScale(50),
        height: moderateScale(50),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cartContainer: {
        right: moderateScale(70),
    },
    dotStyle: {
        borderRadius: 100,
        backgroundColor: '#FFFFFF',
    },
    activeDotStyle: {
        borderRadius: 100,
        backgroundColor: '#DE1484',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: moderateScale(10),
        alignSelf: 'center',
        zIndex: 10,
        gap: moderateScale(5),
    },
    contentContainer: {
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScale(20),
    },
    productNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScale(16),
    },
    productName: {
        flex: 1,
        fontWeight: '500',
        fontSize: moderateScale(18),
        color: '#333',
    },
    productPrice: {
        fontWeight: '700',
        fontSize: moderateScale(18),
        color: '#DE1484',
    },
    infoContainer: {
        marginBottom: moderateScale(20),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: moderateScale(12),
    },
    infoLabel: {
        fontWeight: '600',
        fontSize: moderateScale(14),
        color: '#333',
        width: moderateScale(100),
    },
    infoValue: {
        fontSize: moderateScale(14),
        color: '#555',
    },
    colorDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorCircle: {
        width: moderateScale(16),
        height: moderateScale(16),
        borderRadius: moderateScale(8),
        borderWidth: 1,
        borderColor: '#c9c9c9',
        marginRight: moderateScale(8),
    },
    descriptionContainer: {
        marginTop: moderateScale(12),
    },
    description: {
        fontSize: moderateScale(14),
        color: '#555',
        lineHeight: moderateScale(20),
    },
    addButton: {
        backgroundColor: '#DE1484',
        borderRadius: moderateScale(8),
        paddingVertical: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: moderateScale(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    addButtonText: {
        color: 'white',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    recommendedContainer: {
        marginBottom: moderateScale(32),
    },
    recommendedTitle: {
        fontWeight: '700',
        fontSize: moderateScale(20),
        color: '#333',
        marginBottom: moderateScale(16),
    },
    recommendedPlaceholder: {
        backgroundColor: '#F3F4F6',
        borderRadius: moderateScale(8),
        padding: moderateScale(16),
        alignItems: 'center',
    },
    recommendedText: {
        fontSize: moderateScale(14),
        color: '#555',
    },
});

export default ProductView;