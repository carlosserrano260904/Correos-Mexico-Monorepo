import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useCallback, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMyAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FormularioVendedor() {
    const navigation = useNavigation();
    
    // --- Estados del Formulario ---
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [rfc, setRfc] = useState('');
    const [curp, setCurp] = useState('');
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        nombre: '', categoria: '', telefono: '', email: '', direccion: '', rfc: '', curp: ''
    });

    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { userId } = useMyAuth();
    const [estadoSolicitud, setEstadoSolicitud] = useState(false); 

    // --- REGEX ---
    const rfcRegex = /^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/;
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = () => {
        let isValid = true;
        let newErrors = { nombre: '', categoria: '', telefono: '', email: '', direccion: '', rfc: '', curp: '' };

        if (nombre.trim().length < 3) { 
            newErrors.nombre = 'Mínimo 3 caracteres'; 
            isValid = false; 
        }
        if (!categoria) { 
            newErrors.categoria = 'Selecciona una categoría'; 
            isValid = false; 
        }
        if (telefono.replace(/\D/g,'').length !== 10) { 
            newErrors.telefono = 'Debe ser de 10 dígitos'; 
            isValid = false; 
        }
        if (!emailRegex.test(email)) { 
            newErrors.email = 'Correo inválido'; 
            isValid = false; 
        }
        if (direccion.trim().length < 10) { 
            newErrors.direccion = 'Dirección muy corta'; 
            isValid = false; 
        }
        if (!rfcRegex.test(rfc)) { 
            newErrors.rfc = 'RFC inválido (ej: VECJ880326XXX)'; 
            isValid = false; 
        }
        if (!curpRegex.test(curp)) { 
            newErrors.curp = 'CURP inválido (18 caracteres)'; 
            isValid = false; 
        }

        setErrors(newErrors);
        return isValid;
    };

    const encontrarSolicitud = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/encontrar-solicitud/${userId}`);
            const data = await response.json();
            if (data) {
                setEstadoSolicitud(true);
            } else {
                setEstadoSolicitud(false);
            }
        } catch (error) {
            console.log("Error buscando solicitud", error);
        }
    }
    
    const uploadImage = async (imageUri: string) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'logo-vendedor.jpg',
            } as any);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/upload-image/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            });

            if (!response.ok) throw new Error('Error subiendo imagen');
            const result = await response.json();
            return result.url; 

        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) {
            Alert.alert("Atención", "Revisa los campos marcados en rojo.");
            return;
        }

        setIsLoading(true);
        
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImage(image || '');
            }

            const payload = {
                nombre_tienda: nombre,
                categoria_tienda: categoria,
                telefono,
                email,
                direccion_fiscal: direccion,
                rfc,
                curp,
                img_uri: imageUrl || '',
                userId: userId?.toString() || '',
            };

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/vendedor/crear-solicitud`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    const msg = Array.isArray(errorJson.message) ? errorJson.message.join('\n') : errorJson.message;
                    throw new Error(msg || errorText);
                } catch (e) {
                     throw new Error(`Error ${response.status}`);
                }
            }

            setSuccess(true);
            setEstadoSolicitud(true);
            Alert.alert("¡Éxito!", "Tu solicitud ha sido enviada.");
            
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    useFocusEffect(
        useCallback(() => {
            encontrarSolicitud();
        }, [userId])
    );

    if (estadoSolicitud) {
        return (
            <View style={styles.containerCenter}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonAbsolute}>
                    <Icon name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.clockContainer}>
                    <Image source={require('../../assets/clock.png')} style={styles.clockIcon} />
                    <Text style={styles.successTitle}>¡Muchas gracias!</Text>
                    <Text style={styles.successSubtitle}>Tu solicitud está siendo revisada por nuestro equipo.</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Te notificaremos por correo electrónico una vez que tu solicitud haya sido aprobada.</Text>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Solicitud Vendedor</Text>
                    <View style={{width: 24}} /> 
                </View>

                <View style={styles.formContainer}>
                    
                    {/* Nombre */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre de la tienda <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Ej. Abarrotes Don Pepe"
                            style={[styles.input, errors.nombre ? styles.inputError : null]}
                            placeholderTextColor='#999'
                            value={nombre}
                            onChangeText={setNombre}
                        />
                        {errors.nombre ? <Text style={styles.errorText}>{errors.nombre}</Text> : null}
                    </View>

                    {/* Categoría (CORREGIDO) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Categoría <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.pickerContainer, errors.categoria ? styles.inputError : null]}>
                            <Picker
                                selectedValue={categoria}
                                onValueChange={(itemValue) => setCategoria(itemValue)}
                                style={styles.picker} // Estilo corregido
                                mode="dropdown"
                                dropdownIconColor="#333"
                            >
                                <Picker.Item label="Selecciona una categoría" value="" color="#999" enabled={false} />
                                <Picker.Item label="Electrónica" value="electronica" color="#000" /> 
                                <Picker.Item label="Ropa" value="ropa" color="#000" />
                                <Picker.Item label="Hogar" value="hogar" color="#000" />
                                <Picker.Item label="Juguetes" value="juguetes" color="#000" />
                                <Picker.Item label="Otros" value="otros" color="#000" />
                            </Picker>
                        </View>
                        {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}
                    </View>

                    {/* Teléfono */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Teléfono <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="10 dígitos"
                            placeholderTextColor='#999'
                            style={[styles.input, errors.telefono ? styles.inputError : null]}
                            value={telefono}
                            onChangeText={setTelefono}
                            keyboardType="numeric"
                            maxLength={10}
                        />
                        {errors.telefono ? <Text style={styles.errorText}>{errors.telefono}</Text> : null}
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="ejemplo@correo.com"
                            placeholderTextColor='#999'
                            style={[styles.input, errors.email ? styles.inputError : null]}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    </View>

                    {/* Dirección */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección fiscal <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="Calle, número, colonia..."
                            placeholderTextColor='#999'
                            style={[styles.input, errors.direccion ? styles.inputError : null]}
                            value={direccion}
                            onChangeText={setDireccion}
                            multiline
                        />
                        {errors.direccion ? <Text style={styles.errorText}>{errors.direccion}</Text> : null}
                    </View>

                    {/* RFC */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>RFC <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="XXXX000000XXX"
                            placeholderTextColor='#999'
                            style={[styles.input, errors.rfc ? styles.inputError : null]}
                            value={rfc}
                            onChangeText={(t) => setRfc(t.toUpperCase())}
                            maxLength={13}
                            autoCapitalize="characters"
                        />
                        {errors.rfc ? <Text style={styles.errorText}>{errors.rfc}</Text> : null}
                    </View>

                    {/* CURP */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CURP <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            placeholder="18 caracteres"
                            placeholderTextColor='#999'
                            style={[styles.input, errors.curp ? styles.inputError : null]}
                            value={curp}
                            onChangeText={(t) => setCurp(t.toUpperCase())}
                            maxLength={18}
                            autoCapitalize="characters"
                        />
                        {errors.curp ? <Text style={styles.errorText}>{errors.curp}</Text> : null}
                    </View>

                    {/* Imagen */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Logo de la tienda (Opcional)</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.containerImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                            ) : (
                                <View style={{alignItems: 'center'}}>
                                    <Icon name="add-photo-alternate" size={40} color="#ccc" />
                                    <Text style={styles.textImage}>Toca para subir imagen</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Botón */}
                    <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ENVIAR SOLICITUD</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}; 

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        backgroundColor: '#fff',
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50, 
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        fontSize: 16,
        color: '#000',
    },
    inputError: {
        borderColor: '#DE1484',
        borderWidth: 1.5,
        backgroundColor: '#FFF0F5',
    },
    errorText: {
        color: '#DE1484',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        justifyContent: 'center',
        // Ajustes clave para el contenedor
        height: 50, 
        overflow: 'hidden',
    },
    picker: {
        // Ajustes clave para el Picker en Android
        width: '100%',
        color: '#000', 
        marginLeft: Platform.OS === 'android' ? -5 : 0, // Alineación fina
    },
    required: {
        color: '#DE1484',
    },
    containerImage: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        backgroundColor: '#FAFAFA',
        width: '100%',
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textImage: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    button: {
        backgroundColor: '#DE1484',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    containerCenter: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    backButtonAbsolute: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    clockContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    clockIcon: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    successSubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: '#FBE4E5',
        padding: 20,
        borderRadius: 12,
    },
    infoText: {
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
    }
});