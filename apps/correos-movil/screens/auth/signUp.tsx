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
  Modal,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import type { StackNavigationProp } from '@react-navigation/stack'
import { useMyAuth } from '../../context/AuthContext'
import * as AuthSession from 'expo-auth-session'
import { useSSO, useClerk } from '@clerk/clerk-expo'
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type CheckoutStackParamList = {
  SignIn: undefined
  SignUp: undefined
}

type NavigationProp = StackNavigationProp<CheckoutStackParamList>


export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { setIsAuthenticated, reloadUserData } = useMyAuth()
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [nombre, setNombre] = useState('')
  // const [apellido, setApellido] = useState('')
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
  
  // Estado para modal de términos y condiciones
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'signup' | 'oauth' | null>(null)
  const [pendingOAuthStrategy, setPendingOAuthStrategy] = useState<'oauth_google' | 'oauth_facebook' | 'oauth_apple' | null>(null)
  
  // Estado para guardar datos OAuth temporalmente
  const [pendingOAuthData, setPendingOAuthData] = useState<{
    proveedor: string;
    sub: string;
    correo: string;
    nombre: string;
  } | null>(null)

  // Función para mostrar modal de términos y condiciones
  const showTermsAndConditions = (actionType: 'signup' | 'oauth', oauthStrategy?: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
    setPendingAction(actionType)
    if (oauthStrategy) {
      setPendingOAuthStrategy(oauthStrategy)
    }
    setShowTermsModal(true)
  }

  // Función para aceptar términos y condiciones
  const acceptTermsAndConditions = () => {
    setShowTermsModal(false)
    if (pendingAction === 'signup') {
      continueSignUp()
    } else if (pendingAction === 'oauth' && pendingOAuthStrategy) {
      continueOAuth(pendingOAuthStrategy)
    }
    setPendingAction(null)
    setPendingOAuthStrategy(null)
  }

  // Función para rechazar términos y condiciones
  const rejectTermsAndConditions = () => {
    setShowTermsModal(false)
    setPendingAction(null)
    setPendingOAuthStrategy(null)
    setPendingOAuthData(null)
    setLoading(false)
  }

  // Función para continuar con el registro después de aceptar términos
  const continueSignUp = async () => {
  // Aquí solo se debe mandar el OTP una vez, la función ya lo hace correctamente al ser llamada desde acceptTermsAndConditions
  // No es necesario reenviar el OTP aquí, solo activar la verificación
  setLoading(false)
  setPendingVerification(true)
  }

  // Función para continuar con OAuth después de aceptar términos
  const continueOAuth = async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
    try {
      // Usar los datos OAuth cacheados en lugar de hacer una nueva llamada
      if (!pendingOAuthData) {
        Alert.alert('Error', 'No se encontraron datos de autenticación')
        return
      }

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingOAuthData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`OAuth backend error: ${res.status} - ${errorText}`)
      }

      const data = await res.json()
      await AsyncStorage.setItem('token', data.token)
      await reloadUserData()
      setIsAuthenticated(true)
      
      // Limpiar datos cacheados después del registro exitoso
      setPendingOAuthData(null)
    } catch (err) {
      console.error(`[continueOAuth] OAuth ${strategy} error:`, err)
      Alert.alert('Error', 'No se pudo completar el registro con la red social')
    } finally {
      setLoading(false)
    }
  }

  const onSignUpPress = async () => {
  if (!nombre || !emailAddress || !password || !confirmPassword) {
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
          // apellido: apellido, // eliminado porque ya no se pide
        }),
      })
      if (!res.ok) {
        const errorData = await res.json();
        console.log('Error response:', errorData);

        if (res.status === 401 && errorData.message === 'El correo ya está en uso') {
          Alert.alert(
            'Correo duplicado',
            'Este email ya tiene una cuenta. Inicia sesión para continuar.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Iniciar sesión', onPress: () => navigation.navigate('SignIn') }
            ]
          );
          setLoading(false);
          return;
        }
      }

      const data = await res.json()
      setToken(data.token)
      console.log("token: ", data.token)

      // Mostrar términos y condiciones después de crear la cuenta
      showTermsAndConditions('signup')
    } catch (err) {
      setLoading(false);
      let errorMessage = "Error desconocido";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      console.error('Signup error details:', err);
      Alert.alert('Error al registrarse', errorMessage);
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
      await reloadUserData() 
      setIsAuthenticated(true)

      Alert.alert('¡Registro verificado!', 'Ya puedes usar la app.')
    } catch (err) {
      Alert.alert('Error', 'El código es incorrecto o expiró.')
      console.error('Verify OTP error:', JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Handler para los botones sociales (lógica igual a SignIn.tsx)
  const handleOAuthPress = React.useCallback(
    async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
      setLoading(true)
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

          console

          // Verificar si el usuario ya existe
          const usuarioExistsRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/proveedores/sub`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sub: oauthData.sub }),
          })

          console.log("usuarioExistsRes: ", usuarioExistsRes)

          if (!usuarioExistsRes.ok) {
            // Usuario nuevo - guardar datos OAuth y mostrar términos y condiciones
            setPendingOAuthData(oauthData)
            await clerk.signOut()
            showTermsAndConditions('oauth', strategy)
            return
          }
          
          // Usuario existente - continuar directamente
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
        Alert.alert('Error', 'No se pudo conectar con la red social')
      } finally {
        setLoading(false)
      }
    },
    [startSSOFlow, clerk]
  )

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
    <>
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

          {/* Apellido removido */}

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

            {/*<TouchableOpacity style={styles.socialButtonColumn} disabled={loading} onPress={() => handleOAuthPress('oauth_facebook')}>
              <Icon name="facebook" size={24} color="#1877F3" style={{ marginRight: 12 }} />
              <Text style={styles.socialTextColumn}>Ingresar con Facebook</Text>
            </TouchableOpacity>*/}

            {/*<TouchableOpacity style={styles.socialButtonColumn} disabled={loading} onPress={() => handleOAuthPress('oauth_apple')}>
              <Icon name="apple" size={24} color="#000" style={{ marginRight: 12 }} />
              <Text style={styles.socialTextColumn}>Ingresar con Apple</Text>
            </TouchableOpacity>*/}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')} disabled={loading}>
            <Text style={styles.footerText}>
              ¿Ya tienes cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de Términos y Condiciones */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={rejectTermsAndConditions}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            <TouchableOpacity onPress={rejectTermsAndConditions} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.termsText}>
              <Text style={styles.termsTitle}>TÉRMINOS Y CONDICIONES DE USO – CORREOS CLIC (APLICACIÓN MÓVIL){'\n\n'}</Text>
              
              <Text style={styles.sectionTitle}>1. Información General{'\n'}</Text>
              • La aplicación móvil “Correos Clic”, operada por el Servicio Postal Mexicano (SEPOMEX), está disponible para dispositivos Android e iOS y permite comprar, vender, 
              rastrear envíos y recibir notificaciones comerciales.{'\n'}

              <Text style={styles.sectionTitle}>2. Objeto{'\n'}</Text>
              • Este documento regula el uso de la App, incluyendo permisos, pagos, envíos, notificaciones, seguridad y tratamiento de datos personales.{'\n'}

              <Text style={styles.sectionTitle}>3. Acceso y Uso{'\n'}</Text>
              • Es necesario tener un dispositivo móvil compatible y acceso a internet.{'\n'}
              • Algunas funciones requieren permisos como acceso a cámara, ubicación o almacenamiento.{'\n'}
              • El usuario puede configurar estos permisos desde su dispositivo.{'\n'}

              <Text style={styles.sectionTitle}>4. Registro de Usuario{'\n'}</Text>
              • Es necesario registrarse con datos verídicos.{'\n'}
              • El usuario es responsable de su contraseña y del uso de su cuenta.{'\n'}
              • Correos Clic puede suspender cuentas ante actividades sospechosas.{'\n'}
              
              <Text style={styles.sectionTitle}>5. Compras y Pagos{'\n'}</Text>
              • Se procesan mediante pasarelas seguras (no se almacenan datos bancarios).{'\n'}
              • Se aceptan tarjetas y otros métodos disponibles según región.{'\n'}
              • Los precios incluyen IVA y están en pesos mexicanos{'\n'}

              
              <Text style={styles.sectionTitle}>6. Envíos, Tiempos de Entrega y Devoluciones{'\n'}</Text>
              • Entregas a través de Mexpost o socios autorizados.{'\n'}
              • Tiempo estimado: 7 a 15 días hábiles.{'\n'}
              • Las políticas de devolución están detalladas en el sitio.{'\n'}
              • No aplican devoluciones para alimentos, ropa íntima o productos personalizados.{'\n'}

              <Text style={styles.sectionTitle}>7. Notificaciones{'\n'}</Text>
              • La App puede enviar notificaciones automáticas sobre pedidos, promociones y actualizaciones.{'\n'}
              • El usuario puede desactivarlas desde la configuración de su dispositivo.{'\n'}

              <Text style={styles.sectionTitle}>8. Privacidad y Protección de Datos{'\n'}</Text>
              • La App solo solicita los datos necesarios para operar{'\n'}
              • Se respetan los Derechos ARCO: 
              ° Acceso, Rectificación, Cancelación y Oposición.{'\n'}
              • Las solicitudes pueden enviarse a:
              ○	Compradores: contactocc@correosdemexico.gob.mx
              ○	Vendedores: correosclic@correosdemexico.gob.mx{'\n'}

            <Text style={styles.sectionTitle}>9. Propiedad Intelectual{'\n'}</Text>
              • El diseño, código fuente, interfaces y contenido de la App pertenecen al Servicio Postal Mexicano.{'\n'}
              • Está prohibido su uso o reproducción sin autorización expresa.{'\n'}

            <Text style={styles.sectionTitle}>10. Seguridad{'\n'}</Text>
              • Se utilizan protocolos de cifrado.{'\n'}
              • En operaciones sensibles se podrá requerir verificación de identidad.{'\n'}

            <Text style={styles.sectionTitle}>11. Actualizaciones{'\n'}</Text>
              • La App puede actualizarse automáticamente para mejorar funciones o corregir errores.{'\n'}
              • El usuario es responsable de mantener la App actualizada.{'\n'}
            
            <Text style={styles.sectionTitle}>12. Legislación y Jurisdicción{'\n'}</Text>
              • Aplican las leyes de los Estados Unidos Mexicanos.{'\n'}
              • En caso de disputa, se acudirá a los tribunales de la Ciudad de México.{'\n'}
            
            <Text style={styles.sectionTitle}>13. Contacto{'\n'}</Text>
              •	Sitio web: www.correosclic.gob.mx{'\n'}
              •	Correo electrónico:{'\n'}
              ○	Compradores: contactocc@correosdemexico.gob.mx{'\n'}
              ○	Vendedores: correosclic@correosdemexico.gob.mx{'\n'}
              •	Teléfono: (55) 5130 4100 ext. 4500 / 800 701 7000{'\n'}
            </Text>

          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.rejectButton} onPress={rejectTermsAndConditions}>
              <Text style={styles.rejectButtonText}>Rechazar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={acceptTermsAndConditions}>
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  // Estilos para el modal de términos y condiciones
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6007A',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#E6007A',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
})
