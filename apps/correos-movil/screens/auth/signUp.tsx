import React, { useState, useEffect, useRef } from 'react'
import {
  Text, TextInput, View, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, Alert
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Validaciones visuales
  const isPasswordStrong = (password: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const onSignUpPress = async () => {
    if (!isLoaded) return
    if (!isValidEmail(emailAddress)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido')
      return
    }
    if (!isPasswordStrong(password)) {
      Alert.alert('Contraseña insegura', 'Debe tener al menos 8 caracteres, una mayúscula y un número')
      return
    }
    setLoading(true)
    try {
      await signUp.create({ emailAddress, password })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setPendingVerification(true)
    } catch (err) {
      Alert.alert('Error', 'No se pudo crear la cuenta. Intenta con otro correo.')
      console.error('Signup error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return
    setLoading(true)
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
            Alert.alert('¡Registro exitoso!', 'Usuario creado correctamente')
          } else {
            Alert.alert('Error', 'No se pudo registrar en el backend')
            console.error('Backend signup failed:', await res.text())
          }
        } catch (backendErr) {
          Alert.alert('Error', 'No se pudo conectar con el backend')
          console.error('Backend error:', backendErr)
        }
      } else {
        Alert.alert('Error', 'El código es incorrecto o expiró')
        console.error('Verification not complete:', JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo verificar el código')
      console.error('Verification error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Para el temporizador y reenviar código
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos
  const [canResend, setCanResend] = useState(true)
  const inputRef = useRef<TextInput>(null)
  const [showInvalid, setShowInvalid] = useState(false)

  useEffect(() => {
    if (pendingVerification) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [pendingVerification])

  const handleResend = async () => {
    if (!canResend) return
    setLoading(true)
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      Alert.alert('📬 Código reenviado a tu correo')
      setCanResend(false)
      setCode('')
      setShowInvalid(false)
      setTimeLeft(600)
      inputRef.current?.focus()
      setTimeout(() => setCanResend(true), 30000)
    } catch (err) {
      Alert.alert('Error al reenviar', 'Inténtalo más tarde')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPress = async () => {
    if (code.length < 6) {
      setShowInvalid(true)
      return
    }
    await onVerifyPress()
  }

  // Vista de verificación con diseño moderno
  if (pendingVerification) {
    return (
      <View style={verifyStyles.container}>
        <Text style={verifyStyles.title}>Verifica tu cuenta</Text>
        <Text style={verifyStyles.subtitle}>Código enviado a:</Text>
        <Text style={verifyStyles.email}>{emailAddress}</Text>

        {loading && (
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <ActivityIndicator size="large" color="#DE1484" />
          </View>
        )}

        <CodeInput
          value={code}
          onChange={(text) => {
            setShowInvalid(false)
            setCode(text)
          }}
          showInvalid={showInvalid}
          inputRef={inputRef}
          editable={!loading}
        />

        <TouchableOpacity style={verifyStyles.button} onPress={handleVerifyPress} disabled={loading}>
          <Text style={verifyStyles.buttonText}>Validar código</Text>
        </TouchableOpacity>

        <Text style={verifyStyles.countdown}>
          Expira en {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </Text>

        <TouchableOpacity onPress={handleResend} disabled={!canResend || loading}>
          <Text style={[verifyStyles.resend, { color: canResend ? '#DE1484' : '#999' }]}>
            {canResend ? '¿No te llegó? Reenviar código' : 'Espera unos segundos...'}
          </Text>
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

        {/* Email */}
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

        <TouchableOpacity style={styles.button} onPress={onSignUpPress} disabled={loading}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>ó</Text>

        {/* Botones sociales */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} disabled={loading}>
            <Image
              source={{ uri: 'https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png' }}
              style={{ width: 22, height: 22, marginRight: 10 }}
            />
            <Text style={styles.socialText}>Ingresar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} disabled={loading}>
            <Icon name="facebook" size={22} color="#1877F3" />
            <Text style={styles.socialText}>Ingresar con Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} disabled={loading}>
            <Icon name="apple" size={22} color="#000" />
            <Text style={styles.socialText}>Ingresar con Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta? <Text style={styles.linkText}>Ingresar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

// Componente visual para el input de código
const CodeInput = ({
  value,
  onChange,
  length = 6,
  showInvalid = false,
  inputRef,
  editable = true,
}: {
  value: string
  onChange: (text: string) => void
  length?: number
  showInvalid?: boolean
  inputRef?: React.RefObject<TextInput>
  editable?: boolean
}) => {
  const internalRef = useRef<TextInput>(null)
  const ref = inputRef || internalRef

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => editable && ref.current?.focus()}
      style={stylesCodeInput.container}
    >
      <View style={stylesCodeInput.boxes}>
        {Array.from({ length }).map((_, i) => {
          const isFocused = value.length === i
          const borderColor = showInvalid ? '#FF3B30' : isFocused ? '#DE1484' : '#ccc'
          return (
            <View key={i} style={[stylesCodeInput.box, { borderColor }]}>
              <Text style={stylesCodeInput.digit}>{value[i] || ''}</Text>
            </View>
          )
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => {
          if (/^\d*$/.test(text) && text.length <= length) onChange(text)
        }}
        keyboardType="number-pad"
        maxLength={length}
        style={stylesCodeInput.hiddenInput}
        autoFocus={false}
        editable={editable}
      />
    </TouchableOpacity>
  )
}

// Estilos para la pantalla de verificación
const verifyStyles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 4, color: '#555' },
  email: { fontSize: 16, fontWeight: '600', color: '#DE1484', marginBottom: 24 },
  button: {
    backgroundColor: '#DE1484',
    padding: 16,
    borderRadius: 24,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countdown: {
    marginTop: 12,
    textAlign: 'center',
    color: '#888',
  },
  resend: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
})

// Estilos del CodeInput
const stylesCodeInput = StyleSheet.create({
  container: { marginBottom: 24 },
  boxes: { flexDirection: 'row', justifyContent: 'space-between' },
  box: {
    borderWidth: 2,
    borderRadius: 8,
    width: 44,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  digit: {
    fontSize: 24,
    color: '#222',
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

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
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 8,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 8,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  socialText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
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
})
