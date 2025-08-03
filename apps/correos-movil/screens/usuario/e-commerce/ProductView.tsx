import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faPlus as plus, faMinus as minus, faAngleRight, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import DropdownComponent from "../../../components/DropDown/DropDownComponent";
import { useRoute, useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IP = process.env.EXPO_PUBLIC_IP_LOCAL;

function ProductView() {
	const navigation = useNavigation();
	const route = useRoute();
	// Extrae el ID del producto de los parámetros de la ruta
	const { id } = route.params as { id: string }; // Asumiendo que el ID puede ser una cadena ahora
	console.log("ID del producto recibido en la ruta:", id); // Log para depuración

	// Estado para almacenar los datos del producto, el estado de carga y el error
	const [product, setProduct] = React.useState<any>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [liked, setLiked] = React.useState(false);
	const [inCart, setInCart] = React.useState(false);
	const [favoritoId, setFavoritoId] = React.useState<number | null>(null);
	const [carritoId, setCarritoId] = React.useState<number | null>(null);

	// Obtener datos del producto de la API
	React.useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				const API_BASE_URL = `http://${IP}:3000`;

				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);

				const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { signal: controller.signal });
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
					images: data.imagen ? [data.imagen] : [],
					price: parseFloat(data.precio),
					category: data.categoria,
					color: data.color
				};
				setProduct(transformedData);
				if (transformedData.color) {
					setSelectedColor(transformedData.color);
				}

			} catch (err: any) {
				if (err.name === 'AbortError') {
					setError("La solicitud tardó demasiado en responder (tiempo de espera agotado).");
				} else {
					setError(err.message || "Error desconocido al obtener los datos del producto.");
				}
				console.error("Error fetching product:", err);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchProduct();
		} else {
			setLoading(false);
			setError("ID del producto no proporcionado en la ruta.");
		}
	}, [id]);

	// Verificar estado de favoritos y carrito
	React.useEffect(() => {
		const verificarEstado = async () => {
			const userId = await AsyncStorage.getItem('userId');
			if (!userId) return;

			try {
				const resFav = await fetch(`http://${IP}:3000/api/favoritos/${userId}`);
				const favoritos = await resFav.json();
				const fav = favoritos.find((f: any) => f.producto.id === Number(id));
				if (fav) {
					setLiked(true);
					setFavoritoId(fav.id);
				}

				const resCart = await fetch(`http://${IP}:3000/api/carrito/${userId}`);
				const carrito = await resCart.json();
				const item = carrito.find((c: any) => c.producto.id === Number(id));
				if (item) {
					setInCart(true);
					setCarritoId(item.id);
				}

			} catch (err) {
				console.log("Error verificando favoritos o carrito:", err);
			}
		};

		if (product) {
			verificarEstado();
		}
	}, [product]);

	// Funciones para favoritos
	const toggleFavorito = async () => {
		const userId = await AsyncStorage.getItem('userId');
		if (!userId) return;

		if (!liked) {
			try {
				const res = await fetch(`http://${IP}:3000/api/favoritos`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ profileId: Number(userId), productId: Number(id) }),
				});
				const data = await res.json();
				setFavoritoId(data.id);
				setLiked(true);
			} catch (err) {
				console.error("Error al agregar a favoritos:", err);
			}
		} else {
			try {
				await fetch(`http://${IP}:3000/api/favoritos/${favoritoId}`, {
					method: 'DELETE',
				});
				setFavoritoId(null);
				setLiked(false);
			} catch (err) {
				console.error("Error al quitar de favoritos:", err);
			}
		}
	};

	// Funciones para carrito
	const toggleCarrito = async () => {
		const userId = await AsyncStorage.getItem('userId');
		if (!userId) return;

		if (!inCart) {
			try {
				const res = await fetch(`http://${IP}:3000/api/carrito`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						profileId: Number(userId),
						productId: Number(id),
						cantidad: 1,
					}),
				});
				const data = await res.json();
				setCarritoId(data.id);
				setInCart(true);
			} catch (err) {
				console.error("Error al agregar a carrito:", err);
			}
		} else {
			try {
				await fetch(`http://${IP}:3000/api/carrito/${carritoId}`, {
					method: 'DELETE',
				});
				setCarritoId(null);
				setInCart(false);
			} catch (err) {
				console.error("Error al quitar del carrito:", err);
			}
		}
	};

	// Configuración del carrusel
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

	const carouselImageData = product?.images && product.images.length > 0
    ? product.images.map((img: string, index: number) => ({
        id: `img-${index}`,
        image: { uri: img }
      }))
    : [
        { id: '1', image: require('../../../assets/ropa1.jpg') },
        { id: '2', image: require('../../../assets/ropa2.jpg') },
        { id: '3', image: require('../../../assets/ropa3.jpeg') },
      ];

	const renderItem = ({ item }: { item: { id: string; image: any } }) => (
		<View style={styles.itemContainer}>
			<Image source={item.image} style={styles.image} resizeMode="cover" />
		</View>
	);

	// Visibilidad de la sección de información
	const [showInformation, setShowInformation] = React.useState(false);

	const toggleShowInformation = () => {
		setShowInformation(!showInformation)
	}

	// Estados de los dropdowns
	const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
	const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

	const sizes = [
		{ label: 'Chico', value: 'S' },
		{ label: 'Mediano', value: 'M' },
		{ label: 'Grande', value: 'L' },
		{ label: 'Extra Grande', value: 'XL' }
	];

	const initialColores = [
		{ label: 'Blanco Arena', value: '#fff' },
		{ label: 'Negro', value: '#000' },
		{ label: 'Rojo', value: '#FF0000' },
		{ label: 'Verde Lima', value: '#77a345' }
	];

	const availableColores = React.useMemo(() => {
		if (product?.color && !initialColores.some(c => c.value === product.color)) {
			const colorNameMap: { [key: string]: string } = {
				'#fff': 'Blanco',
				'#000': 'Negro',
				'#FF0000': 'Rojo',
				'#77a345': 'Verde Lima',
				'#FFC0CB': 'Rosa'
			};
			const label = colorNameMap[product.color] || `Color ${product.color}`;
			return [...initialColores, { label: label, value: product.color }];
		}
		return initialColores;
	}, [product?.color]);

	if (loading) {
		return (
			<View style={styles.centeredContainer}>
				<ActivityIndicator size="large" color="#DE1484" />
				<Text style={{ marginTop: moderateScale(10) }}>Cargando producto...</Text>
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
					1.  **`API_BASE_URL` en el código:**
						* Para emuladores Android: usa `http://10.0.2.2:3000`.
						* Para dispositivos físicos: usa la dirección IP local de tu PC (ej. `http://192.168.1.100:3000`).
					2.  **Configuración del servidor backend:** Asegúrate de que tu servidor Express esté escuchando en `0.0.0.0` (todas las interfaces) y no solo en `127.0.0.1`.
					3.  **Firewall:** Comprueba que tu firewall no esté bloqueando las conexiones entrantes al puerto `3000`.
					4.  **ID del producto:** Verifica que el ID del producto (`${id}`) sea válido y exista en tu base de datos.
				</Text>
			</View>
		);
	}

	if (!product) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>No se encontró el producto con ID: {id}.</Text>
				<Text style={styles.errorTextSmall}>
					Esto puede suceder si el ID proporcionado en la ruta no corresponde a ningún producto en tu API,
					o si la API devuelve un resultado vacío/nulo a pesar de un status 200 OK.
				</Text>
            </View>
        );
    }

	return (
		<ScrollView style={{flex: 1, backgroundColor: "white"}}>
			<View style={{borderRadius: 20}}>
				<Carousel
					ref={ref}
					{...baseOptions}
					loop
					onProgressChange={progress}
					style={{ width: screenWidth, position: "relative"}}
					data={carouselImageData}
					renderItem={renderItem}
				/>

				<Pagination.Basic<{ color: string }>
				progress={progress}
				data={carouselImageData.map((image) => ({ image }))}
				size={scale(8)}
				dotStyle={{
					borderRadius: 100,
					backgroundColor: "#FFFFFF",
				}}
				activeDotStyle={{
					borderRadius: 100,
					overflow: "hidden",
					backgroundColor: "#DE1484",
				}}
				containerStyle={{
					position: "absolute",
					bottom: 10,
					alignSelf: "center",
					zIndex: 10,
					gap: 5,
				}}
				horizontal
				onPress={onPressPagination}
			/>

				<TouchableOpacity  style={styles.xmarkerContainer} onPress={() => navigation.goBack()}>
					<FontAwesomeIcon icon={faXmark} size={moderateScale(20)} color="black"/>
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleFavorito} style={styles.heartContainer}>
					<FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? "#DE1484" : "#000"} size={moderateScale(24)} />
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleCarrito} style={[styles.heartContainer, { right: moderateScale(70) }]}>
					<FontAwesomeIcon icon={faCartShopping} color={inCart ? "#DE1484" : "#000"} size={moderateScale(24)} />
				</TouchableOpacity>

			</View>

			<View style={{}}>
				<View style={styles.productNameContainer}>
					<Text style={{flex: 1, fontWeight: 400, fontSize: moderateScale(16)}} numberOfLines={3} ellipsizeMode="tail">{product.name || 'Nombre del Producto'}</Text>
					<Text style={{fontWeight: 700, fontSize: moderateScale(16), marginLeft: moderateScale(8), flexShrink: 0}}>MXN {product.price ? product.price.toFixed(2) : '0.00'}</Text>
				</View>
				<View style={styles.dropDownContainer}>
					<View style={styles.dropDown}>
						<DropdownComponent 
							placeholderStyle={{fontSize: moderateScale(14)}}
							inputSearchStyle={{fontSize: moderateScale(14)}}
							selectedTextStyle={{fontSize: moderateScale(14)}}
							data={product.availableSizes || sizes}
							value={selectedSize}
							setValue={setSelectedSize}
							placeholder="Talla"
							iconStyle={{display: "none"}}	
						/>
					</View>

					<View style={styles.dropDown}>
						<DropdownComponent 
							placeholderStyle={{fontSize: moderateScale(14)}}
							inputSearchStyle={{fontSize: moderateScale(14)}}
							selectedTextStyle={{fontSize: moderateScale(14)}}
							data={availableColores}
							value={selectedColor}
							setValue={setSelectedColor}
							placeholder="Color"
							iconStyle={{borderRadius: "100%", borderWidth: 1, width: moderateScale(16), height: moderateScale(16), marginRight: moderateScale(4), backgroundColor: selectedColor ?? "#fff"}}	
						/>
					</View>

					<View >
						<TouchableOpacity style={styles.addButton}>
							<Text style={{color: "white", fontSize: moderateScale(16), fontWeight: 600}}>Añadir</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={{paddingHorizontal: moderateScale(12)}}>
					<Text style={{fontWeight: 300, fontSize: moderateScale(12)}}>{product.description || 'Descripción del producto.'}</Text>
				</View>

				<TouchableOpacity onPress={toggleShowInformation} style={styles.informationContainer}>
					<View style={styles.careTitleContainer}>
						<Text style={{fontWeight: 400, fontSize: moderateScale(16)}}>Composición y Cuidados</Text>
						<FontAwesomeIcon icon={plus} style={{display: showInformation ? "none" : "flex"}} size={moderateScale(16)}/>
						<FontAwesomeIcon icon={minus} style={{display: showInformation ? "flex" : "none"}} size={moderateScale(16)}/>
					</View>
					<Text style={{fontWeight: 300, fontSize: moderateScale(12), display: showInformation ? "flex" : "none", marginTop: moderateScale(12) }}>{product.careInstructions || 'Información sobre composición y cuidados no disponible.'}</Text>
				</TouchableOpacity>

				<View style={{paddingHorizontal: moderateScale(12), width: screenWidth}}>
					<Text style={{fontSize: moderateScale(16), fontWeight: 700, paddingBottom: moderateScale(12)}}>Más información</Text>
					<View>
						<TouchableOpacity style={styles.moreInfoContainer}>
							<View style={{width: "40%"}}>
								<Text numberOfLines={2} ellipsizeMode="tail">Envíos y devoluciones</Text>
							</View>

							<View style={{flexDirection: "row", alignItems: "center", width: "56%", justifyContent: "center"}}>
								<Text style={{color: "#DE1484", fontSize: moderateScale(12), flex: 1}} numberOfLines={1} ellipsizeMode="tail">{product.shippingInfo || 'Información de envío no disponible'}</Text>
								<FontAwesomeIcon style={{flexShrink: 0}} icon={faAngleRight} size={moderateScale(16)}/>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.forYouContainer}>
					<Text style={{fontWeight: 700, fontSize: moderateScale(20), marginBottom: moderateScale(12)}}>Recomendados para ti</Text>

					<View>
						<Text>Aquí van los productos Recomendados</Text>
					</View>
				</View>
			</View>

		</ScrollView>
	);
}

const styles = StyleSheet.create({
	centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: moderateScale(16),
        textAlign: 'center',
        marginHorizontal: moderateScale(20),
    },
	errorTextSmall: {
        color: 'red',
        fontSize: moderateScale(12),
        textAlign: 'center',
        marginHorizontal: moderateScale(20),
        marginTop: moderateScale(10),
    },
	itemContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	itemText: {
		color: "#fff",
		fontWeight: "bold",
	},
	image: {
		width: "100%",
		height: "100%"
	},
	xmarkerContainer: {
		position: "absolute", 
		zIndex: 10, 
		top: moderateScale(40), 
		left: moderateScale(12),
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: "100%",
		width: moderateScale(24),
		height: moderateScale(24),
		alignItems: "center",
		justifyContent: "center"
	},
	heartContainer: {
		position: "absolute",
		zIndex: 11,
		bottom: moderateScale(20),
		right: moderateScale(12),
		backgroundColor: "rgba(255,255,255,0.8)",
		borderRadius: "100%",
		width: moderateScale(50),
		height: moderateScale(50),
		alignItems: "center",
		justifyContent: "center"
	},
	productNameContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: moderateScale(12),
		marginTop: moderateScale(20),
		width: screenWidth
	},
	dropDownContainer: {
		flexDirection: "row",
		width: screenWidth,
		alignItems: "center",
		marginVertical: moderateScale(20),
		height: moderateScale(50),
	},
	dropDown: {
		width: screenWidth / 3,
		borderColor: "#c9c9c9",
		borderBottomWidth: 1,
		borderTopWidth: 1,
		borderRightWidth: 1,
		height: "100%",
		justifyContent: "center",
		paddingHorizontal: moderateScale(12)
	},
	addButton: {
		backgroundColor: "#DE1484",
		width: screenWidth / 3,
		height: "100%",
		alignItems: "center",
		justifyContent: "center"
	},
	careTitleContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	informationContainer: {
		paddingHorizontal: moderateScale(12),
		paddingVertical: moderateScale(12),
		marginVertical: moderateScale(20),
		borderColor: "#c9c9c9",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		width: screenWidth
	},
	moreInfoContainer: {
		backgroundColor: "#F3F4F6", 
		flexDirection: "row", 
		alignItems: "center", 
		justifyContent: "space-between",
		height: moderateScale(50),
		borderRadius: 8,
		paddingHorizontal: moderateScale(8),
	},
	forYouContainer: {
		width: screenWidth,
		paddingHorizontal: moderateScale(12),
		marginVertical: moderateScale(20),
		marginBottom: moderateScale(52)
	}
});

export default ProductView;