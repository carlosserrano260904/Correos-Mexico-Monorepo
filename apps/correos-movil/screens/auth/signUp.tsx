import React, { useState } from 'react'
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

type CheckoutStackParamList = {
    SignIn: undefined;
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const navigation = useNavigation<NavigationProp>()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            console.error('Signup error:', JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and create user in backend
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                
                // Crear usuario en el backend después de verificar email
                try {
                    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            correo: emailAddress, 
                            contrasena: password,
                            nombre: emailAddress.split('@')[0] // Usar parte del email como nombre por defecto
                        }),
                    })
                    
                    if (res.ok) {
                        const data = await res.json()
                        await AsyncStorage.setItem('token', data.token)
                        console.log('User created successfully in backend')
                    } else {
                        console.error('Backend signup failed:', await res.text())
                    }
                } catch (backendErr) {
                    console.error('Backend error:', backendErr)
                }
                
                // Navigation será manejada automáticamente por Clerk cuando isSignedIn cambie
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error('Verification not complete:', JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            console.error('Verification error:', JSON.stringify(err, null, 2))
        }
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
                        fontSize: 18
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

            <Button title="Continuar" onPress={onSignUpPress} />
            
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