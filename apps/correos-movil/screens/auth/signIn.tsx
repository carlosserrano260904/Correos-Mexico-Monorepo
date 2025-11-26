import React, { useCallback, useState } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useClerk } from '@clerk/clerk-expo'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useMyAuth } from '../../context/AuthContext'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type CheckoutStackParamList = {
  SignUp: undefined
  PswdReset: undefined
}

type NavigationProp = StackNavigationProp<CheckoutStackParamList>

WebBrowser.maybeCompleteAuthSession()

export default function SignInScreen() {
  const { startSSOFlow } = useSSO()
  const clerk = useClerk()
  const navigation = useNavigation<NavigationProp>()
  const { setIsAuthenticated, reloadUserData } = useMyAuth()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const onSignInPress = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: emailAddress, contrasena: password }),
      })

      
      if (!res.ok && res.status === 401) {
        const errorData = await res.json()
        const errorMessage = errorData.message || ''

        if (errorMessage === 'Usuario no verificado') {
          Alert.alert('Error', 'Usuario no verificado, por favor recuperar tu contraseña para poder ingresar.', [
            {
              text: 'Recuperar contraseña',
              onPress: () => navigation.navigate('PswdReset' as never)
            },
            { text: 'Cancelar', style: 'cancel' }
          ])
          return
        } else if (errorMessage === 'Credenciales inválidas') {
          Alert.alert('Error', 'Credenciales inválidas, por favor verifica tu correo electrónico y contraseña.')
          return
        } else if (errorMessage === 'El perfil no está vinculado al usuario') {
          Alert.alert('Error', 'El perfil no está vinculado al usuario, por favor contacta al administrador.')
          return
        } else {
          Alert.alert('Error', 'Ocurrió un error, por favor intenta nuevamente más tarde o contacta al administrador.')
          return
        }
      }
      if (!res.ok) {
        const errorText = await res.text()
        Alert.alert('Error', `Error del servidor: ${res.status} - ${errorText}`)
        return
      }

      const data = await res.json()
      await AsyncStorage.setItem('token', data.token)
      await reloadUserData()
      setIsAuthenticated(true)
    } catch (err) {
      console.error('[onSignInPress] Error catch:', err)
    }
  }, [emailAddress, password, reloadUserData, setIsAuthenticated])

  const handleOAuthPress = useCallback(
    async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "correosdemexico",
            path: 'sso-callback' 
          }),
        })

        if (createdSessionId) {
          await setActive!({ session: createdSessionId })

          const providerName = strategy.replace('oauth_', '')
          const session = clerk.session
          const sessionUser = session?.user
          const externalAccount = sessionUser?.externalAccounts?.find(
            (account) => account.provider === providerName
          )

          const oauthData = {
            proveedor: providerName,
            sub: externalAccount?.providerUserId || '',
            correo: externalAccount?.emailAddress || '',
            nombre: externalAccount?.firstName || '',
          }

          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(oauthData),
          })

          await clerk.signOut()

          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(`OAuth backend error: ${res.status} - ${errorText}`)
          }

          const data = await res.json()
          await AsyncStorage.setItem('token', data.token)
          await reloadUserData()
          setIsAuthenticated(true)
        } else {
          console.warn(`[handleOAuthPress] ${strategy} - No session created`)
        }
      } catch (err) {
        await clerk.signOut()
        console.error(`[handleOAuthPress] OAuth ${strategy} error:`, err)
      }
    },
    [startSSOFlow, reloadUserData, setIsAuthenticated, clerk]
  )

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/logo1.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.optionsRow}>
        <TouchableOpacity onPress={() => navigation.navigate('PswdReset' as never)}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
        <Text style={styles.primaryButtonText}>Ingresar</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>O continúa con:</Text>

      <TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthPress('oauth_google')}>
        <View style={styles.socialContent}>
          <Image
            source={{ uri: 'https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png' }}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialText}>Continuar con Google</Text>
        </View>
      </TouchableOpacity>

      {/*<TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthPress('oauth_facebook')}>
        <View style={styles.socialContent}>
          <Icon name="facebook" size={24} color="#1877F3" style={styles.socialIcon} />
          <Text style={styles.socialText}>Continuar con Facebook</Text>
        </View>
      </TouchableOpacity>*/}

      {/*<TouchableOpacity style={styles.socialButton} onPress={() => handleOAuthPress('oauth_apple')}>
        <View style={styles.socialContent}>
          <Icon name="apple" size={24} color="#000" style={styles.socialIcon} />
          <Text style={styles.socialText}>Continuar con Apple</Text>
        </View>
      </TouchableOpacity>*/}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
        <Text style={styles.footerText}>
          ¿No tienes cuenta? <Text style={styles.footerLink}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  optionsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  link: {
    color: '#DE1484',
  },
  primaryButton: {
    backgroundColor: '#DE1484',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
    color: '#888',
  },
  socialButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    marginRight: 10,
    width: 24,
    height: 24,
  },
  socialText: {
    fontSize: 16,
    color: '#333',
  },
  footerText: {
    textAlign: 'center',
    color: '#555',
    marginTop: 16,
  },
  footerLink: {
    color: '#DE1484',
    fontWeight: 'bold',
  },
})
