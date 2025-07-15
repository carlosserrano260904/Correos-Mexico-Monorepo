import React, { useState } from 'react'
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMyAuth } from '../../context/AuthContext'

type CheckoutStackParamList = {
    SignIn: undefined
    SignUp: undefined
}

type NavigationProp = StackNavigationProp<CheckoutStackParamList>

export default function SignUpScreen() {
    const navigation = useNavigation<NavigationProp>()
    const { setIsAuthenticated } = useMyAuth()
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')

    const onSignUpPress = async () => {

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    correo: emailAddress, 
                    contrasena: password, 
                    nombre: nombre, 
                    apellido: apellido }),
            })
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Signup backend error: ${res.status} - ${errorText}`)
            }

            try {
                const res2 = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/email-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        correo: emailAddress
                    }),
                })
                if (!res2.ok) {
                    const errorText = await res2.text()
                    throw new Error(`Email OTP backend error: ${res2.status} - ${errorText}`)
                }
            } catch (error) {
                console.error('Email OTP error:', JSON.stringify(error, null, 2))
            }

          

            

            const data = await res.json()
            console.log(data)
            await AsyncStorage.setItem('token', data.token)
            console.log("token: ", data.token)
            
            setPendingVerification(true)
        } catch (err) {
            console.error('Signup error:', JSON.stringify(err, null, 2))
        }
    }

    const onVerifyPress = async () => {

        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                correo: emailAddress, 
                token: code}),
        })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Verify OTP backend error: ${res.status} - ${errorText}`)
        }

        setPendingVerification(false) 
        setIsAuthenticated(true)
    }

    if (pendingVerification) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                    Verifica tu email
                </Text>
                <Text style={{ marginBottom: 20, textAlign: 'center' }}>
                    Te enviamos un código de verificación a {emailAddress}
                </Text>
                <TextInput
                    value={code}
                    placeholder="Ingresa tu código de verificación"
                    onChangeText={setCode}
                    style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 15,
                        marginBottom: 20,
                        borderRadius: 5,
                        textAlign: 'center',
                        fontSize: 18,
                    }}
                    keyboardType="number-pad"
                />
                <Button title="Verificar" onPress={onVerifyPress} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Crear cuenta
            </Text>
            <TextInput
                value={nombre}
                placeholder="Ingresa tu nombre"
                onChangeText={setNombre}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5,
                }}
            />

            <TextInput
                value={apellido}
                placeholder="Ingresa tu apellido"
                onChangeText={setApellido}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5,
                }}
            />

            <TextInput
                value={emailAddress}
                placeholder="Ingresa tu email"
                onChangeText={setEmailAddress}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 15,
                    marginBottom: 15,
                    borderRadius: 5,
                }}
                keyboardType="email-address"
                autoCapitalize="none"
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
                    borderRadius: 5,
                }}
            />

            <Button title="Continuar" onPress={onSignUpPress} />

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 20 }}>
                <Text style={{ textAlign: 'center', color: '#007AFF' }}>
                    ¿Ya tienes cuenta? Inicia sesión
                </Text>
            </TouchableOpacity>
        </View>
    )
}
