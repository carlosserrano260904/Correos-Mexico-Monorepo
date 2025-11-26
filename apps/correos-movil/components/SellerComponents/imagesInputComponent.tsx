import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CirclePlus, X } from 'lucide-react-native';
import { moderateScale } from 'react-native-size-matters';

const screenWidht = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const ImagenesInput = () => {
    // Define el array de las imagenes
    const [imagenes, setImagenes] = useState<string[]>([]);

    // Funcion que lanza un alerta cuando el limite de imagenes fue alcanzado
    const seleccionarImagen = async () => {
        if (imagenes.length >= 5) {
        Alert.alert('Límite alcanzado', 'Solo puedes subir hasta 5 imágenes.');
        return;
        }

        // Define el resultado de la foto o la foto en si
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true, // permite seleccionar varias
        selectionLimit: 5 - imagenes.length, // limita cuántas más puede subir
        quality: 0.8,
        });

        // Si la foto o imagen se cancelan o eliminan, se quita del array de fotos
        if (!result.canceled) {
            // Define el nuevo array de fotos
            const nuevas = result.assets.map((asset) => asset.uri);
            setImagenes((prev) => [...prev, ...nuevas].slice(0, 5));
        }
    };

    // Funcion para eliminar una foto
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
                <CirclePlus id="add" size={screenWidht * 0.085} color="#9CA3AF" />
                </TouchableOpacity>
            ) : (
                <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarImagen(item)}
                >
                    <X id="close-circle" size={screenWidht * 0.052} strokeWidth={3} color="#fff" />
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
    container: { 
        marginVertical: screenHeight * 0.01 
    },
    imageContainer: {
        width: screenWidht * 0.25,
        height: screenWidht * 0.25,
        borderRadius: moderateScale(8),
        overflow: 'hidden',
        marginRight: screenWidht * 0.03,
        position: 'relative',
    },
    image: { 
        width: '100%', 
        height: '100%' 
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    deleteButton: {
        position: 'absolute',
        top: screenHeight * 0.005,
        right: screenWidht * 0.01,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: moderateScale(50),
    },
    count: {
        marginTop: screenHeight * 0.01,
        fontSize: screenHeight * 0.015,
        color: '#9CA3AF',
    },
});

export default ImagenesInput;
