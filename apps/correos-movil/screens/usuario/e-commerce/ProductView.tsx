import * as React from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Extrapolation, interpolate, useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';


const imageData = [
	{ id: '1', name: 'Item 1', image: require('../../../assets/ropa1.jpg') },
    { id: '2', name: 'Item 2', image: require('../../../assets/ropa2.jpg') },
    { id: '3', name: 'Item 3', image: require('../../../assets/ropa3.jpeg') },
];

const screenWidth = Dimensions.get('window').width;

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

	return (
		<View style={{flex: 1,}}>
			<View style={{ marginBottom: 10 }}>
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

			<View>
				<View>
					<Text></Text>
					<Text></Text>
				</View>
			</View>

		</View>
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
		width: scale(24),
		height: verticalScale(22),
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
	}
});

export default ProductView;
