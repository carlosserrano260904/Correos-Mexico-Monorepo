import React, { useState } from 'react'
import { Text, TextInput, Button, View, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

type CheckoutStackParamList = {
    SignIn: undefined;
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

export default function SignUpScreen() {
    const navigation = useNavigation<NavigationProp>()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    const onSignUpPress = async () => {
        if (!emailAddress || !password) {
            Alert.alert('Campos requeridos', 'Por favor ingresa un correo y una contraseña.')
            return
        }

        try {
            const res = await fetch(`http://192.168.1.6:3000/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: emailAddress,
                    contrasena: password,
                    nombre: emailAddress.split('@')[0],
                }),
            })

            if (res.ok) {
                const data = await res.json()
                console.log(data)
                await AsyncStorage.setItem('token', data.token)
                console.log('Usuario creado correctamente')
                Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.')
                // Redirige a SignIn u otra pantalla
                navigation.navigate('SignIn')
            } else {
                const errorText = await res.text()
                console.error('Error del backend:', errorText)
                Alert.alert('Error', errorText || 'No se pudo registrar el usuario.')
            }
        } catch (err) {
            console.error('Error de red:', err)
            Alert.alert('Error de red', 'No se pudo conectar con el servidor.')
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Crear Cuenta
            </Text>

            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Ingresa tu email"
                onChangeText={setEmailAddress}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5
                }}
                keyboardType="email-address"
            />

            <TextInput
                value={password}
                placeholder="Ingresa tu contraseña"
                secureTextEntry={true}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 15,
                    marginBottom: 20,
                    borderRadius: 5
                }}
            />

            <Button title="Registrarse" onPress={onSignUpPress} />

            <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={{ marginTop: 20 }}
            >
                <Text style={{ textAlign: 'center', color: '#007AFF' }}>
                    ¿Ya tienes una cuenta? Inicia sesión
                </Text>
            </TouchableOpacity>
        </View>
    )
}
