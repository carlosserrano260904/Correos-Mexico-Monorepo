import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useMyAuth } from '../../context/AuthContext'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useClerk } from '@clerk/clerk-expo'
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type CheckoutStackParamList = {
  SignIn: undefined
  SignUp: undefined
}

type NavigationProp = StackNavigationProp<CheckoutStackParamList>

WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { setIsAuthenticated } = useMyAuth()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { startSSOFlow } = useSSO()
  const clerk = useClerk()

  // Validaciones visuales
  const isPasswordStrong = (password: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const [token, setToken] = useState('')

  const onSignUpPress = async () => {
    if (!nombre || !apellido || !emailAddress || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos')
      return
    }
    if (!isValidEmail(emailAddress)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido')
      return
    }
    if (!isPasswordStrong(password)) {
      Alert.alert('Contraseña insegura', 'Debe tener al menos 8 caracteres, una mayúscula y un número')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: emailAddress,
          contrasena: password,
          nombre: nombre,
          apellido: apellido,
        }),
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
            correo: emailAddress,
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
            setToken(data.token)
            console.log("token: ", data.token)
            
            setPendingVerification(true)
        } catch (err) {
            console.error('Signup error:', JSON.stringify(err, null, 2))
        }
    }

  const onVerifyPress = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: emailAddress,
          token: code,
        }),
      })

        if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`Verify OTP backend error: ${res.status} - ${errorText}`)
        }

        await AsyncStorage.setItem('token', token)

      setPendingVerification(false)
      setIsAuthenticated(true)
      Alert.alert('¡Registro verificado!', 'Ya puedes usar la app.')
    } catch (err) {
      Alert.alert('Error', 'El código es incorrecto o expiró.')
      console.error('Verify OTP error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Handler para los botones sociales
  const handleOAuthPress = React.useCallback(async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      })

      if (createdSessionId) {
        await setActive!({ session: createdSessionId })

        // Obtener la información del usuario desde la sesión activa
        const session = clerk.session
        const sessionUser = session?.user

        const oauthData = {
          proveedor: strategy.replace('oauth_', ''),
          sub: sessionUser?.id || '',
          correo: sessionUser?.primaryEmailAddress?.emailAddress || '',
          nombre: sessionUser?.fullName || sessionUser?.firstName || '',
        }

        if (!oauthData.sub || !oauthData.correo) {
          throw new Error(`Missing OAuth data: sub=${oauthData.sub}, correo=${oauthData.correo}`)
        }

        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(oauthData),
        })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`OAuth backend error: ${res.status} - ${errorText}`)
        }

        const data = await res.json()
        await AsyncStorage.setItem('token', data.token)
        Alert.alert('¡Inicio de sesión exitoso!', 'Bienvenido')
      } else {
        Alert.alert('Error', 'No se pudo iniciar sesión con el proveedor seleccionado')
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo iniciar sesión con el proveedor')
      console.error(`OAuth ${strategy} error:`, err)
    }
  }, [clerk, startSSOFlow])

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Verifica tu cuenta</Text>
        <Text style={styles.subtitle}>Código enviado a:</Text>
        <Text style={styles.email}>{emailAddress}</Text>

        {loading && (
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <ActivityIndicator size="large" color="#DE1484" />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Icon name="shield-key-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            value={code}
            placeholder="Ingresa tu código de verificación"
            onChangeText={setCode}
            style={styles.input}
            keyboardType="number-pad"
            editable={!loading}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={onVerifyPress} disabled={loading}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>

        {loading && (
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <ActivityIndicator size="large" color="#E6007A" />
          </View>
        )}

        {/* Nombre */}
        <View style={styles.inputContainer}>
          <Icon name="account" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#747688"
            value={nombre}
            onChangeText={setNombre}
            editable={!loading}
          />
        </View>

        {/* Apellido */}
        <View style={styles.inputContainer}>
          <Icon name="account-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor="#747688"
            value={apellido}
            onChangeText={setApellido}
            editable={!loading}
          />
        </View>

        {/* Correo electrónico */}
        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#747688"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {emailAddress.length > 0 && (
            <Icon
              name={isValidEmail(emailAddress) ? 'check-circle-outline' : 'alert-circle-outline'}
              size={20}
              color={isValidEmail(emailAddress) ? 'green' : 'red'}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        {/* Contraseña */}
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#747688"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Indicador de fortaleza */}
        {password.length > 0 && (
          <Text style={{
            fontSize: 14,
            color: isPasswordStrong(password) ? 'green' : 'orange',
            marginBottom: 8
          }}>
            {isPasswordStrong(password)
              ? '✔️ Contraseña segura'
              : '⚠️ Al menos 8 caracteres, una mayúscula y un número'}
          </Text>
        )}

        {/* Confirmar contraseña */}
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#747688"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}>
            <Icon
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
          {confirmPassword.length > 0 && (
            <Icon
              name={
                confirmPassword === password
                  ? 'check-circle-outline'
                  : 'alert-circle-outline'
              }
              size={20}
              color={confirmPassword === password ? 'green' : 'red'}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>ó</Text>

        {/* Botones sociales funcionales */}
        <View style={styles.socialColumnContainer}>
          <TouchableOpacity style={styles.socialButtonColumn} disabled={loading} onPress={() => handleOAuthPress('oauth_google')}>
            <Image
              source={{ uri: 'https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png' }}
              style={{ width: 24, height: 24, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text style={styles.socialTextColumn}>Ingresar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButtonColumn} disabled={loading} onPress={() => handleOAuthPress('oauth_facebook')}>
            <Icon name="facebook" size={24} color="#1877F3" style={{ marginRight: 12 }} />
            <Text style={styles.socialTextColumn}>Ingresar con Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButtonColumn} disabled={loading} onPress={() => handleOAuthPress('oauth_apple')}>
            <Icon name="apple" size={24} color="#000" style={{ marginRight: 12 }} />
            <Text style={styles.socialTextColumn}>Ingresar con Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DE1484',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 2,
    height: 48,
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6007A',
    borderRadius: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
  linkText: {
    color: '#E6007A',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 16,
  },
  socialColumnContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  socialButtonColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    width: '80%', // <-- Cambia de 250 a '90%'
    alignSelf: 'center',
    justifyContent: 'center',
  },
  socialTextColumn: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
})
