import React, { useState } from 'react'
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'

type CheckoutStackParamList = {
  SignIn: undefined
  SignUp: undefined
}

type NavigationProp = StackNavigationProp<CheckoutStackParamList>

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigation = useNavigation<NavigationProp>()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({ emailAddress, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      console.error('Signup error:', JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })

        try {
          const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/signup`, {
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
            await AsyncStorage.setItem('token', data.token)
            console.log('User created successfully in backend')
          } else {
            console.error('Backend signup failed:', await res.text())
          }
        } catch (backendErr) {
          console.error('Backend error:', backendErr)
        }
      } else {
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
