import React, { useCallback, useEffect, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useClerk } from '@clerk/clerk-expo'
import { View, Button, TouchableOpacity, Text, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMyAuth } from '../../context/AuthContext';


type CheckoutStackParamList = {
    SignUp: undefined;
    PswdReset: undefined;
};

type NavigationProp = StackNavigationProp<CheckoutStackParamList>;

export default function SignInScreen() {
    

    const { startSSOFlow } = useSSO()
    const clerk = useClerk()
    const navigation = useNavigation<NavigationProp>();
    const { setIsAuthenticated, reloadUserData } = useMyAuth()
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    const onSignInPress = useCallback(async () => {
        console.log('[onSignInPress] Inicio de sesión manual, email:', emailAddress)
        try {
            console.log('[onSignInPress] Fetching:', `${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin`)
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: emailAddress, contrasena: password }),
            })
            console.log('[onSignInPress] Status code:', res.status)

            if (!res.ok) {
                const errorText = await res.text()
                console.error('[onSignInPress] Backend error text:', errorText)
                throw new Error(`Signin backend error: ${res.status} - ${errorText}`)
            }

            const data = await res.json()
            console.log('[onSignInPress] Response JSON:', data)

            await AsyncStorage.setItem('token', data.token)
            console.log('[onSignInPress] Token guardado en AsyncStorage')

            await reloadUserData()
            console.log('[onSignInPress] reloadUserData completado')

            setIsAuthenticated(true)
            console.log('[onSignInPress] setIsAuthenticated(true)')
        } catch (err) {
            console.error('[onSignInPress] Error catch:', err)
        }
    }, [emailAddress, password, reloadUserData, setIsAuthenticated])

    const handleOAuthPress = useCallback(async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
        try {
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy,
                redirectUrl: AuthSession.makeRedirectUri(),
            });

            if (createdSessionId) {
                await setActive!({ session: createdSessionId })
                const providerName = strategy.replace('oauth_', '');

                const session = clerk.session
                const sessionUser = session?.user
                const externalAccount = sessionUser?.externalAccounts?.find(
                    (account) => account.provider === providerName // ← CORREGIR: usar providerName, no strategy
                );
                console.log('[handleOAuthPress] externalAccount:', externalAccount)

                const oauthData = {
                    proveedor: strategy.replace('oauth_', ''),
                    sub: externalAccount?.providerUserId || '',
                    correo: externalAccount?.emailAddress || '',
                    nombre: externalAccount?.firstName || '',
                };
                console.log('[handleOAuthPress] oauthData:', oauthData)

                const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/oauth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(oauthData),
                })
                console.log('[handleOAuthPress] res:', res)
                await clerk.signOut()
            

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`OAuth backend error: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                console.log('[handleOAuthPress] OAuth success, response data:', data)
                await AsyncStorage.setItem('token', data.token);
                console.log('[handleOAuthPress] OAuth token guardado')
                await reloadUserData()
                console.log('[handleOAuthPress] reloadUserData completado')
                setIsAuthenticated(true)
                console.log('[handleOAuthPress] setIsAuthenticated(true)')
                
                console.log('[handleOAuthPress] Terminado el proceso de OAuth.')
            } else {
                console.warn(`[handleOAuthPress] ${strategy} - No session created`)
            }
        } catch (err) {
            await clerk.signOut()
            console.error(`[handleOAuthPress] OAuth ${strategy} error:`, err)
        }
    }, [startSSOFlow, reloadUserData, setIsAuthenticated, clerk])

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                Iniciar Sesión
            </Text>

            <TextInput
                placeholder="Email"
                value={emailAddress}
                onChangeText={(text) => {
                    console.log('[EmailInput] Nuevo valor:', text)
                    setEmailAddress(text)
                }}
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
                onChangeText={(text) => {
                    console.log('[PasswordInput] Nuevo valor:', text)
                    setPassword(text)
                }}
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

            <TouchableOpacity onPress={() => handleOAuthPress('oauth_google')} style={{ backgroundColor: '#4285F4', padding: 15, marginBottom: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Continuar con Google
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleOAuthPress('oauth_facebook')} style={{ backgroundColor: '#1877F2', padding: 15, marginBottom: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Continuar con Facebook
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleOAuthPress('oauth_apple')} style={{ backgroundColor: '#000', padding: 15, marginBottom: 20, borderRadius: 5 }}>
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
