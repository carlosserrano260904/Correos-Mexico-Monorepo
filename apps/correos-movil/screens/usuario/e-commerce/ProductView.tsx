import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faPlus as plus, faMinus as minus, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import DropdownComponent from "../../../components/DropDown/DropDownComponent";
import { useRoute, useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';



const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

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

	// Obtener datos del producto de la API
	React.useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				// IMPORTANTE: Configuración de la URL base de la API.
				// Si tu aplicación se ejecuta en un EMULADOR ANDROID, '10.0.2.2' es un alias para 'localhost' de tu máquina de desarrollo.
				// Si usas un DISPOSITIVO FÍSICO, DEBES reemplazar '10.0.2.2' con la DIRECCIÓN IP REAL de tu máquina en tu red local (ej. '192.168.1.100').
				// Puedes encontrar tu IP local abriendo la terminal y ejecutando 'ipconfig' (Windows) o 'ifconfig' / 'ip a' (Linux/macOS).
				// Para iOS Simulator, 'localhost' generalmente funciona, pero usar tu IP real es más consistente.
				// Asegúrate también que tu servidor backend esté escuchando en '0.0.0.0' para aceptar conexiones externas,
				// no solo en '127.0.0.1' (localhost).
				const API_BASE_URL = `http://${IP}:3000`; // <<--- VERIFICA Y MODIFICA ESTA LÍNEA SEGÚN TU ENTORNO ---

				// Implementar un controlador de Abort para el tiempo de espera
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de tiempo de espera

				const response = await fetch(`${API_BASE_URL}/api/products/${id}`, { signal: controller.signal });
				clearTimeout(timeoutId); // Limpiar el tiempo de espera si la respuesta llega a tiempo

				if (!response.ok) {
					// Lanza un error con un mensaje más descriptivo si la respuesta no es OK
					const errorText = await response.text(); // Intenta leer el cuerpo del error para más detalles
					throw new Error(`HTTP error! Status: ${response.status}. Detalle: ${errorText}`);
				}
				const data = await response.json();
				// Ajusta los nombres de las propiedades según el JSON proporcionado
				const transformedData = {
					id: data.id,
					name: data.nombre,
					description: data.descripcion,
					// Si "imagen" es una URL, la ponemos en un array para el carrusel
					images: data.imagen ? [data.imagen] : [],
					price: parseFloat(data.precio), // Asegúrate de parsear el precio a un número
					category: data.categoria,
					color: data.color // Esto es el color directo del producto, no una lista de opciones
				};
				setProduct(transformedData);
				// Establecer el color preseleccionado si viene en la respuesta del producto
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
			// Si no hay ID, no intentes cargar y muestra un error
			setLoading(false);
			setError("ID del producto no proporcionado en la ruta.");
		}
	}, [id]); // Vuelve a buscar si el ID del producto cambia

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

	// Usa product.images (ahora transformado desde product.imagen) o un array predeterminado
	const carouselImageData = product?.images && product.images.length > 0
    ? product.images.map((img: string, index: number) => ({
        id: `img-${index}`,
        image: { uri: img } // Asumiendo que las imágenes son URLs
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

	// Estado del botón de "Me gusta"
	const [liked, setLiked] = React.useState(false);

	const toggleLike = () => {
		setLiked(!liked);
	};

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

	// Colores predefinidos y añade el color del producto si es único
	const initialColores = [
    	{ label: 'Blanco Arena', value: '#fff' },
    	{ label: 'Negro', value: '#000' },
    	{ label: 'Rojo', value: '#FF0000' },
    	{ label: 'Verde Lima', value: '#77a345' }
  	];

	// Añadir el color del producto si existe y no está ya en la lista
	const availableColores = React.useMemo(() => {
		if (product?.color && !initialColores.some(c => c.value === product.color)) {
			// Intenta obtener un nombre de color si es un código hexadecimal simple
			const colorNameMap: { [key: string]: string } = {
				'#fff': 'Blanco',
				'#000': 'Negro',
				'#FF0000': 'Rojo',
				'#77a345': 'Verde Lima',
				'#FFC0CB': 'Rosa' // Ejemplo, puedes añadir más si lo necesitas
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
					data={carouselImageData} // Usa datos de imagen dinámicos
					renderItem={renderItem}
				/>

				<Pagination.Basic<{ color: string }>
				progress={progress}
				data={carouselImageData.map((image) => ({ image }))} // Usa datos de imagen dinámicos para la paginación
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

				<TouchableOpacity onPress={toggleLike} style={styles.heartContainer}>
					<FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? "#DE1484" : "#000"} size={moderateScale(24)}/>
				</TouchableOpacity >

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
							data={product.availableSizes || sizes} // Usa los tamaños del producto si están disponibles, sino los predeterminados
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
							data={availableColores} // Usa los colores disponibles, incluyendo el del producto
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
