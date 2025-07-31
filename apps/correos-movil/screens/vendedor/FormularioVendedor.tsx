import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useMyAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FormularioVendedor() {
    const navigation = useNavigation();
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rfc, setRfc] = useState('');
    const [curp, setCurp] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { userId, userRol } = useMyAuth();
    const [estadoSolicitud, setEstadoSolicitud] = useState<string | null>(null); 

    const encontrarSolicitud = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/encontrar-solicitud/${userId}`);
            const data = await response.json();
            setEstadoSolicitud(data.estado);
        } catch (error) {
            const data = {
                estado: '',
            }
            setEstadoSolicitud(data.estado);
        }
    }
    
    const uploadImage = async (imageUri: string) => {
        try {
            // Crear FormData
            const formData = new FormData();

            // Agregar la imagen
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'logo-vendedor.jpg',
            } as any);

            // Enviar al endpoint /api/upload-image/image
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/upload-image/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error uploading image');
            }

            const result = await response.json();
            console.log('Upload result:', result); // { url: "images/uuid-filename.jpg" }

            return result.url; // Retorna la URL/key de S3

        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        console.log('📝 Datos del formulario:', { nombre, categoria, telefono, direccion, rfc, curp });
        console.log('👤 UserId:', userId);
        
        if (!nombre || !categoria || !telefono || !direccion || !rfc || !curp) {
            setError('Todos los campos son requeridos');
            setIsLoading(false);
            Alert.alert('Error', 'Todos los campos son requeridos');
            return;
        }

        try {
            let imageUrl = null;
            if (image) {
                console.log('📸 Subiendo imagen...');
                imageUrl = await uploadImage(image || '');
                console.log('✅ Imagen subida:', imageUrl);
            }

            const payload = {
                nombre_tienda: nombre,
                categoria_tienda: categoria,
                telefono,
                email: '',
                direccion_fiscal: direccion,
                rfc,
                curp,
                img_uri: imageUrl || '',
                userId: userId?.toString() || '',
            };

            console.log('🚀 Payload a enviar:', payload);
            console.log('🌐 URL:', `${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/crear-solicitud`);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/crear-solicitud`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 Response status:', response.status);
            console.log('📡 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ Error response:', errorText);
                throw new Error(`Error al enviar la solicitud: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Respuesta exitosa:', result);
            setSuccess(true);
            Alert.alert('Éxito', 'Solicitud enviada correctamente');
            
        } catch (error: any) {
            console.error('❌ Error completo:', error);
            console.error('❌ Error message:', error.message);
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        encontrarSolicitud();
    }, []);

    const renderSolicitud = () => {
        switch (estadoSolicitud) {
            case 'pendiente':
                return ( <View>
                    <Text>Tu solicitud está pendiente.</Text>
                </View>
            );
            case 'aceptada':
                return ( <View>
                    <Text>¡Tu solicitud fue aceptada!</Text>
                </View>
            )
            case 'rechazada':
                return ( <View>
                    <Text>Tu solicitud fue rechazada.</Text>
                </View>
            );
            default:
                return ( <View style={styles.container}>
                        {/* Back button */}
                        <View>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 50}}>
                                <Icon name="arrow-back" size={24} />
                            </TouchableOpacity>
                        </View>
                        {/* Title */}
                        <View >
                            <Text style={styles.title}>Solicitud para ser vendedor</Text>
                        </View>
                        {/* Form */}
                        <View style={styles.form}>
                            {/* Name */}
                            <View>
                                <Text style={styles.label}>Nombre de la tienda<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    placeholder="Ingresa el nombre de la tienda"
                                    style={styles.input}
                                    placeholderTextColor='#979797'
                                    value={nombre}
                                    onChangeText={setNombre}
                                />
                            </View>
                            {/* Category */}
                            <View>
                                <Text style={styles.label}>Categoría principal de los productos<Text style={styles.required}>*</Text></Text>
                                <Picker
                                    selectedValue={categoria}
                                    onValueChange={(itemValue) => setCategoria(itemValue)}
                                    placeholder="Selecciona una categoría"
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Electrónica" value="electronica" />
                                    <Picker.Item label="Ropa" value="ropa" />
                                    <Picker.Item label="Hogar" value="hogar" />
                                    <Picker.Item label="Juguetes" value="juguetes" />
                                    <Picker.Item label="Otros" value="otros" />
                                </Picker>
                            </View>
                            {/* Phone */}
                            <View>
                                <Text style={styles.label}>Teléfono de contacto<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    placeholder="Ingresa el teléfono"
                                    placeholderTextColor='#979797'
                                    style={styles.input}
                                    value={telefono}
                                    onChangeText={setTelefono}
                                />
                            </View>
                            {/* Address */}
                            <View>
                                <Text style={styles.label}>Dirección fiscal<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    placeholder="Ingresa la dirección fiscal"
                                    placeholderTextColor='#979797'
                                    style={styles.input}
                                    value={direccion}
                                    onChangeText={setDireccion}
                                />
                            </View>
                            {/* RFC */}
                            <View>
                                <Text style={styles.label}>RFC<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    placeholder="Ingresa el RFC"
                                    placeholderTextColor='#979797'
                                    style={styles.input}
                                    value={rfc}
                                    onChangeText={setRfc}
                                />
                            </View>
                            {/* CURP */}
                            <View>
                                <Text style={styles.label}>CURP<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    placeholder="Ingresa el CURP"
                                    placeholderTextColor='#979797'
                                    style={styles.input}
                                    value={curp}
                                    onChangeText={setCurp}
                                    keyboardType="numeric"
                                />
                            </View>
                            {/* Image */}
                            <View>
                                <Text style={styles.label}>Logo o imagen de la tienda (opcional)</Text>
                                <TouchableOpacity onPress={pickImage} style={styles.containerImage}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
                                    ) : (
                                        <Text style={styles.textImage}>Toca para seleccionar una imagen</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            {/* Button */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                                    <Text style={styles.buttonText}>Enviar solicitud</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
            
        }
    };

    return (
        <ScrollView>
            {renderSolicitud()}
        </ScrollView>
    );
}; 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 24,
        gap: 16,
    },
    title: {
        fontSize: 24,
        marginTop: 12,
        marginBottom: 12,
    },
    form: {
        gap: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#979797',
        padding: 10,
        borderRadius: 12,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#979797',
        padding: 10,
        borderRadius: 12,
        color: '#979797',
    },
    required: {
        color: '#DE1484',
    },
    backButton: {
        fontSize: 16,
        color: '#DE1484',
    },
    containerImage: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#979797',
        borderStyle: 'dashed',
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textImage: {
        fontSize: 16,
        color: '#979797',
    },
    buttonContainer: {
        width: '100%',
        height: 50,
    },
    button: {
        backgroundColor: '#DE1484',
        padding: 10,
        marginTop: 0,
        marginBottom: 24,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});