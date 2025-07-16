import React, { useCallback, useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useClerk, useSignIn } from '@clerk/clerk-expo'
import { View, Button, TouchableOpacity, Text, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import { useMyAuth } from '../../context/AuthContext';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}
//prueba
type CheckoutStackParamList = {
    SignUp: undefined;
    PswdReset: undefined;
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
    useWarmUpBrowser()

    const { startSSOFlow } = useSSO()
    const clerk = useClerk()
    const { signIn, setActive, isLoaded } = useSignIn()
    const navigation = useNavigation<NavigationProp>();
    const { setIsAuthenticated } = useMyAuth()
    // Estados para el formulario
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')


    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
       

        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: emailAddress, contrasena: password }),
        })
                
        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Signin backend error: ${res.status} - ${errorText}`)
        }
                
        const data = await res.json()
        console.log(data)
        await AsyncStorage.setItem('token', data.token)
        setIsAuthenticated(true)
               
    }, [emailAddress, password])

    const handleOAuthPress = useCallback(async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
        console.log(`Starting OAuth flow for: ${strategy}`);

        try {
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy,
                redirectUrl: AuthSession.makeRedirectUri(),
            });

            if (createdSessionId) {
                await setActive!({ session: createdSessionId });

                // Obtener la información del usuario desde la sesión activa
                const session = clerk.session;
                const sessionUser = session?.user;

                const oauthData = {
                    proveedor: strategy.replace('oauth_', ''),
                    sub: sessionUser?.id || '',
                    correo: sessionUser?.primaryEmailAddress?.emailAddress || '',
                    nombre: sessionUser?.fullName || sessionUser?.firstName || '',
                };

                console.log('OAuth data to send:', oauthData);

                if (!oauthData.sub || !oauthData.correo) {
                    throw new Error(`Missing OAuth data: sub=${oauthData.sub}, correo=${oauthData.correo}`);
                }

                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/oauth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(oauthData),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`OAuth backend error: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                console.log('OAuth success, token saved');

                await AsyncStorage.setItem('token', data.token);
                // Navigation se manejará automáticamente por Clerk
            } else {
                console.warn(`${strategy} - No session created`);
            }
        } catch (err) {
            console.error(`OAuth ${strategy} error:`, err);
        }
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Iniciar Sesión
            </Text>

            {/* Formulario Email/Password */}
            <TextInput
                placeholder="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={{ 
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 10, 
                    borderRadius: 5 
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                style={{ 
                    borderWidth: 1, 
                    borderColor: '#ccc', 
                    padding: 10, 
                    marginBottom: 20, 
                    borderRadius: 5 
                }}
                secureTextEntry
            />

            <Button title="Iniciar Sesión" onPress={onSignInPress} />

            <Text style={{ textAlign: 'center', marginVertical: 20 }}>O continúa con:</Text>

            {/* OAuth Buttons */}
            <TouchableOpacity 
                onPress={() => handleOAuthPress('oauth_google')}
                style={{ backgroundColor: '#4285F4', padding: 15, marginBottom: 10, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Continuar con Google
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handleOAuthPress('oauth_facebook')}
                style={{ backgroundColor: '#1877F2', padding: 15, marginBottom: 10, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Continuar con Facebook
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => handleOAuthPress('oauth_apple')}
                style={{ backgroundColor: '#000', padding: 15, marginBottom: 20, borderRadius: 5 }}
            >
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Continuar con Apple
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
                <Text style={{ textAlign: 'center', color: '#007AFF' }}>
                    ¿No tienes cuenta? Regístrate
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('PswdReset' as never)}>
                <Text style={{ textAlign: 'center', color: '#007AFF', marginTop: 10 }}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </TouchableOpacity>
        </View>
    )
}