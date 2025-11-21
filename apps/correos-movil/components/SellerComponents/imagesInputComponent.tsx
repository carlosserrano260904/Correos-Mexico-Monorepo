import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Alert,
    Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CirclePlus, X } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidht = Dimensions.get('screen').width;

const ImagenesInput = () => {
    const [imagenes, setImagenes] = useState<string[]>([]);

    const seleccionarImagen = async () => {
        if (imagenes.length >= 5) {
        Alert.alert('Límite alcanzado', 'Solo puedes subir hasta 5 imágenes.');
        return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true, // permite seleccionar varias
        selectionLimit: 5 - imagenes.length, // limita cuántas más puede subir
        quality: 0.8,
        });

        if (!result.canceled) {
        const nuevas = result.assets.map((asset) => asset.uri);
        setImagenes((prev) => [...prev, ...nuevas].slice(0, 5));
        }
    };

    const eliminarImagen = (uri: string) => {
        setImagenes((prev) => prev.filter((img) => img !== uri));
    };

    return (
        <View style={styles.container}>

        {/* Carrusel */}
        <FlatList
            data={[...imagenes, 'add']}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
            item === 'add' ? (
                <TouchableOpacity
                style={[styles.imageContainer, styles.addButton]}
                onPress={seleccionarImagen}
                >
                <CirclePlus id="add" size={moderateScale(32)} color="#9CA3AF" />
                </TouchableOpacity>
            ) : (
                <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarImagen(item)}
                >
                    <X id="close-circle" size={moderateScale(20)} strokeWidth={3} color="#fff" />
                </TouchableOpacity>
                </View>
            )
            }
            showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.count}>{imagenes.length}/5 imágenes</Text>
        </View>
    );
    };

const styles = StyleSheet.create({
    container: { marginVertical: moderateScale(8) },
    label: { color: '#6B7280', marginBottom: moderateScale(4) },
    imageContainer: {
        width: screenWidht * 0.25,
        height: screenWidht * 0.25,
        borderRadius: moderateScale(8),
        overflow: 'hidden',
        marginRight: moderateScale(12),
        position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    addButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    deleteButton: {
        position: 'absolute',
        top: moderateScale(4),
        right: moderateScale(4),
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: moderateScale(50),
    },
    count: {
        marginTop: moderateScale(8),
        fontSize: moderateScale(12),
        color: '#9CA3AF',
    },
});

export default ImagenesInput;
