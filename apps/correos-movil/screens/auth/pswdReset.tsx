import React, { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { useNavigation } from '@react-navigation/native'
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native'

export default function PswdResetScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Estados para validar cada requisito de contraseña
  const [hasMinLength, setHasMinLength] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecialChar, setHasSpecialChar] = useState(false)

  const navigation = useNavigation()
  const { isLoaded, signIn } = useSignIn()

  const isPasswordValid =
    hasMinLength && hasUppercase && hasNumber && hasSpecialChar

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DE1484" />
        <Text>Cargando...</Text>
      </View>
    )
  }

  const sendResetCode = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Por favor ingresa tu email')
    setLoading(true)
    setError('')
    try {
      await signIn?.create({ strategy: 'reset_password_email_code', identifier: email })
      setSuccessfulCreation(true)
      Alert.alert('Éxito', 'Código enviado a tu email')
    } catch (err: any) {
      const msg = err.errors?.[0]?.longMessage || 'Error al enviar código'
      setError(msg)
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!password.trim() || !code.trim())
      return Alert.alert('Error', 'Por favor completa todos los campos')

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
        return Alert.alert('2FA Requerido', 'Se requiere autenticación de dos factores')
      }
      if (result?.status !== 'complete') throw new Error('No se completó el reset en Clerk')

      const resp = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/update-password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: email, contrasena: password }),
        }
      )
      if (!resp.ok) {
        const errBody = await resp.json()
        throw new Error(errBody.message || 'Error actualizando contraseña en el servidor')
      }

      Alert.alert(
        'Éxito',
        'Contraseña restablecida correctamente',
        [
          {
            text: 'Ir a Iniciar Sesión',
            onPress: () => navigation.replace('SignIn'),
          },
        ],
        { cancelable: false }
      )
    } catch (err: any) {
      const msg = err.message || 'Error al restablecer contraseña'
      setError(msg)
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>

      {!successfulCreation ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={sendResetCode}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Enviando...' : 'Enviar código'}
            </Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            value={password}
            onChangeText={text => {
              setPassword(text)
              setHasMinLength(text.length >= 8)
              setHasUppercase(/[A-Z]/.test(text))
              setHasNumber(/\d/.test(text))
              setHasSpecialChar(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(text))
            }}
            secureTextEntry
            editable={!loading}
          />
          {password.length > 0 && (
            <View style={styles.requirementsContainer}>
              {!hasMinLength && (
                <Text style={styles.errorText}>• Mínimo 8 caracteres</Text>
              )}
              {!hasUppercase && (
                <Text style={styles.errorText}>• Al menos una mayúscula</Text>
              )}
              {!hasNumber && (
                <Text style={styles.errorText}>• Al menos un número</Text>
              )}
              {!hasSpecialChar && (
                <Text style={styles.errorText}>
                  • Al menos un carácter especial
                </Text>
              )}
              {isPasswordValid && (
                <Text style={styles.successText}>Contraseña segura</Text>
              )}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Código de restablecimiento"
            value={code}
            onChangeText={setCode}
            editable={!loading}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isPasswordValid || loading) && styles.disabledButton,
            ]}
            onPress={resetPassword}
            disabled={!isPasswordValid || loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </Text>
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      )}

      {secondFactor && (
        <Text style={styles.warningText}>
          Se requiere autenticación de dos factores, pero no se maneja en esta pantalla
        </Text>
      )}

      {loading && <ActivityIndicator size="large" color="#DE1484" style={styles.loader} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: { width: 100, height: 100, marginBottom: 10 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  form: { width: '100%', alignItems: 'center' },
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
  disabledButton: { backgroundColor: '#ccc' },
  requirementsContainer: { width: '100%', marginBottom: 10 },
  errorText: { color: '#ff0000', alignSelf: 'flex-start', fontSize: 14 },
  successText: { color: '#28a745', alignSelf: 'flex-start', fontSize: 14 },
  warningText: {
    color: '#ff9500',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  loader: { marginTop: 20 },
})
