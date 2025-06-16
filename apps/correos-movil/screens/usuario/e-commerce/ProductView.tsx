import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart, faPlus as plus, faMinus as minus, faAngleRight} from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import DropdownComponent from "../../../components/DropDown/DropDownComponent";


const imageData = [
	{ id: '1', name: 'Item 1', image: require('../../../assets/ropa1.jpg') },
    { id: '2', name: 'Item 2', image: require('../../../assets/ropa2.jpg') },
    { id: '3', name: 'Item 3', image: require('../../../assets/ropa3.jpeg') },
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function ProductView() {
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

	const renderItem = ({ item }) => (
		<View style={[styles.itemContainer, { backgroundColor: item }]}>
			<Image source={item.image} style={styles.image} />

		</View>
	);

	const [liked, setLiked] = React.useState(false);

	const toggleLike = () => {
		setLiked(!liked);
	};

	const [showInformation, setShowInformation] = React.useState(false);

	const toggleShowInformation = () => {
		setShowInformation(!showInformation)
	}

	const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
	const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  	const sizes = [
    	{ label: 'Chico', value: 'S' },
    	{ label: 'Mediano', value: 'M' },
    	{ label: 'Grande', value: 'L' },
    	{ label: 'Extra Grande', value: 'XL' }
  	];

	const colores = [
    	{ label: 'Blanco Arena', value: '#fff' },
    	{ label: 'Negro', value: '#000' },
    	{ label: 'Rojo', value: '#FF0000' },
    	{ label: 'Verde Lima', value: '#77a345' }
  	];

	return (
		<ScrollView style={{flex: 1, backgroundColor: "white"}}>
			<View style={{borderRadius: 20}}>
				<Carousel
					ref={ref}
					{...baseOptions}
					loop
					onProgressChange={progress}
					style={{ width: screenWidth, position: "relative"}}
					data={imageData}
					renderItem={renderItem}
				/>

				<Pagination.Basic<{ color: string }>
				progress={progress}
				data={imageData.map((image) => ({ image }))}
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

				<TouchableOpacity style={styles.xmarkerContainer}>
					<FontAwesomeIcon icon={faXmark} size={moderateScale(20)} color="black"/>
				</TouchableOpacity>

				<TouchableOpacity onPress={toggleLike} style={styles.heartContainer}>
					<FontAwesomeIcon icon={liked ? solidHeart : regularHeart} color={liked ? "#DE1484" : "#000"} size={moderateScale(24)}/>
				</TouchableOpacity >

			</View>

			<View style={{}}>
				<View style={styles.productNameContainer}>
					<Text style={{flex: 1, fontWeight: 400, fontSize: moderateScale(16)}} numberOfLines={3} ellipsizeMode="tail">Falda Larga Casual para Eventos Especiales y Fiestas</Text>
					<Text style={{fontWeight: 700, fontSize: moderateScale(16), marginLeft: moderateScale(8), flexShrink: 0}}>MXN 299.00</Text>
				</View>
				<View style={styles.dropDownContainer}>
					<View style={styles.dropDown}>
						<DropdownComponent 
							placeholderStyle={{fontSize: moderateScale(14)}}
							inputSearchStyle={{fontSize: moderateScale(14)}}
							selectedTextStyle={{fontSize: moderateScale(14)}}
							data={sizes}
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
							data={colores}
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
					<Text style={{fontWeight: 300, fontSize: moderateScale(12)}}>Falda larga de lino con silueta acampanada y delicados bordados florales en tonos vivos. Presenta un dobladillo ondulado y detalles decorativos como corazones y líneas curvas. Su estilo romántico y artesanal la hace ideal para un look fresco y elegante.</Text>
				</View>

				<TouchableOpacity onPress={toggleShowInformation} style={styles.informationContainer}>
					<View style={styles.careTitleContainer}>
						<Text style={{fontWeight: 400, fontSize: moderateScale(16)}}>Composicion y Cuidados</Text>
						<FontAwesomeIcon icon={plus} style={{display: showInformation ? "none" : "flex"}} size={moderateScale(16)}/>
						<FontAwesomeIcon icon={minus} style={{display: showInformation ? "flex" : "none"}} size={moderateScale(16)}/>
					</View>
					<Text style={{fontWeight: 300, fontSize: moderateScale(12), display: showInformation ? "flex" : "none", marginTop: moderateScale(12) }}>Falda larga de lino con silueta acampanada y delicados bordados florales en tonos vivos. Presenta un dobladillo ondulado y detalles decorativos como corazones y líneas curvas. Su estilo romántico y artesanal la hace ideal para un look fresco y elegante.</Text>
				</TouchableOpacity>

				<View style={{paddingHorizontal: moderateScale(12), width: screenWidth}}>
					<Text style={{fontSize: moderateScale(16), fontWeight: 700, paddingBottom: moderateScale(12)}}>Más información</Text>
					<View>
						<TouchableOpacity style={styles.moreInfoContainer}>
							<View style={{width: "40%"}}>
								<Text numberOfLines={2} ellipsizeMode="tail">Envíos y devoluciones</Text>
							</View>

							<View style={{flexDirection: "row", alignItems: "center", width: "56%", justifyContent: "center"}}>
								<Text style={{color: "#DE1484", fontSize: moderateScale(12), flex: 1}} numberOfLines={1} ellipsizeMode="tail">Correos de México o Mexpost</Text>
								<FontAwesomeIcon style={{flexShrink: 0}} icon={faAngleRight} size={moderateScale(16)}/>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.forYouContainer}>
					<Text style={{fontWeight: 700, fontSize: moderateScale(20), marginBottom: moderateScale(12)}}>Recomendados para ti</Text>

					<View>
						<Text>Aqui van los productos Recomendados</Text>
					</View>
				</View>
			</View>

		</ScrollView>
	);
}

const styles = StyleSheet.create({
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
		left: moderateScale(20),
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
		right: moderateScale(20),
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
