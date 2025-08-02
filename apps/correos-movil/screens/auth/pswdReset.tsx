import React, { useEffect, useState } from 'react'
import { useAuth, useSignIn } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import { TextInput, View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native'

export default function PswdResetScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [successfulCreation, setSuccessfulCreation] = useState(false)
    const [secondFactor, setSecondFactor] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()
    const { isSignedIn } = useAuth()
    const { isLoaded, signIn, setActive } = useSignIn()

    useEffect(() => {
        if (isSignedIn) {
            // Navigate to authenticated screens - adjust route name as needed
            navigation.navigate('Tabs' as never)
        }
    }, [isSignedIn, navigation])

    if (!isLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#DE1484" />
                <Text>Cargando...</Text>
            </View>
        )
    }

    // Send the password reset code to the user's email
    const sendResetCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu email')
            return
        }
        
        setLoading(true)
        setError('')
        
        try {
            await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            setSuccessfulCreation(true)
            Alert.alert('Éxito', 'Código enviado a tu email')
        } catch (err: any) {
            console.error('error', err.errors?.[0]?.longMessage)
            const errorMessage = err.errors?.[0]?.longMessage || 'Error al enviar código'
            setError(errorMessage)
            Alert.alert('Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async () => {
        if (!password.trim() || !code.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos')
            return
        }
        
        setLoading(true)
        setError('')
        
        try {
            const result = await signIn?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })
            
            if (result?.status === 'needs_second_factor') {
                setSecondFactor(true)
                Alert.alert('2FA Requerido', 'Se requiere autenticación de dos factores')
            } else if (result?.status === 'complete') {
                // Set the active session (user is now signed in)
                await setActive({ session: result.createdSessionId })
                Alert.alert('Éxito', 'Contraseña restablecida correctamente')
            } else {
                console.log('Unexpected result:', result)
            }
        } catch (err: any) {
            console.error('error', err.errors?.[0]?.longMessage)
            const errorMessage = err.errors?.[0]?.longMessage || 'Error al restablecer contraseña'
            setError(errorMessage)
            Alert.alert('Error', errorMessage)
        } finally {
            setLoading(false)
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>

            {!successfulCreation ? (
                <>
                    <Text style={styles.subtitle}>Ingresa tu dirección de email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    <Button 
                        title={loading ? "Enviando..." : "Enviar código de restablecimiento"} 
                        onPress={sendResetCode}
                        disabled={loading}
                        color="#DE1484"
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </>
            ) : (
                <>
                    <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nueva contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <Text style={styles.subtitle}>
                        Ingresa el código que se envió a tu email
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Código de restablecimiento"
                        value={code}
                        onChangeText={setCode}
                        editable={!loading}
                        keyboardType="number-pad"
                    />

                    <Button 
                        title={loading ? "Restableciendo..." : "Restablecer contraseña"} 
                        onPress={resetPassword}
                        disabled={loading}
                        color="#DE1484"
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </>
            )}

            {secondFactor && (
                <Text style={styles.warningText}>
                    Se requiere autenticación de dos factores, pero esta pantalla no la maneja aún
                </Text>
            )}
            
            {loading && <ActivityIndicator size="large" color="#DE1484" style={styles.loader} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    errorText: {
        color: '#ff0000',
        textAlign: 'center',
        marginTop: 10,
        fontSize: 14,
    },
    warningText: {
        color: '#ff9500',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        fontStyle: 'italic',
    },
    loader: {
        marginTop: 20,
    },
});