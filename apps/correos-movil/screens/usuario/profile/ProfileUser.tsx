// Archivo: apps/correos-movil/src/screens/usuario/profile/ProfileUser.tsx

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Keyboard, // <-- Importa Keyboard
  TouchableWithoutFeedback, // <-- Importa Touchable
  KeyboardAvoidingView, // <-- Importa KeyboardAvoidingView
  Platform // <-- Importa Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { usuarioPorId } from '../../../api/profile'; // Asumiendo que esta API existe
import { RootStackParamList, SchemaProfileUser } from '../../../schemas/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from 'react-native-size-matters';
import { useMyAuth } from '../../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../../components/common/Loader';


type SectionItem = {
  label: string;
  icon: string;
  to: keyof RootStackParamList;
  params?: Record<string, any>;
};

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'ProfileUser'>;

// --- Lista de Motivos ---
const deleteReasons = [
  'No me gusta la aplicación.',
  'Encontré otro e-commerce que se ajusta mejor a lo que busco.',
  'Tuve una mala experiencia con un servicio o pedido.',
  'Ya no me siento interesado en tener una cuenta en esta aplicación.',
  'Otro (déjanos tus comentarios):',
];

export default function ProfileUser({ navigation }: { navigation: ProfileNavProp }) {
  const isFocused = useIsFocused();
  const { logout, userId: profileIdFromAuth, userRol } = useMyAuth();
  const [usuario, setUsuario] = useState<SchemaProfileUser | null>(null);

  // --- Estados para Modales ---
  const [showReasonModal, setShowReasonModal] = useState(false); // Para el modal de motivo
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Para el modal de contraseña

  // --- Estados para Datos ---
  const [selectedReason, setSelectedReason] = useState<string | null>(null); // Opción seleccionada
  const [otherReasonText, setOtherReasonText] = useState(''); // Texto de "Otro"
  const [passwordInput, setPasswordInput] = useState(''); // Contraseña
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      try {
        if (profileIdFromAuth) {
          const perfil = await usuarioPorId(parseInt(profileIdFromAuth, 10));
          setUsuario(perfil);
          console.log('Rol del usuario:', userRol);
        } else {
          console.warn('⚠️ No se encontró profileId en AuthContext');
          Alert.alert('Error', 'No se pudo cargar la información del usuario.');
        }
      } catch (error) {
        console.error('❌ Error al cargar el perfil:', error);
        Alert.alert('Error', 'No se pudo cargar tu perfil.');
      }
    })();
  }, [isFocused, profileIdFromAuth]);


  if (!usuario) {
    return <Loader message="Cargando tu perfil..." />;
  }

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', JSON.stringify(err, null, 2));
    }
  };

  // --- Inicia el proceso: Muestra el modal de MOTIVO ---
  const handleDeletePress = () => {
    if (!profileIdFromAuth) {
      console.error('No se pudo obtener el profileId desde AuthContext al intentar eliminar');
      Alert.alert('Error', 'No se pudo obtener tu información de usuario para iniciar la eliminación.');
      return;
    }
    // Resetea todos los estados
    setSelectedReason(null);
    setOtherReasonText('');
    setPasswordInput('');
    setShowReasonModal(true); // <-- Muestra el modal de MOTIVO
  };

  // --- Confirma y ejecuta la eliminación (llamado desde el modal de CONTRASEÑA) ---
  const confirmDeleteAccount = async () => {
    if (!passwordInput) {
      Alert.alert('Contraseña requerida', 'Ingresa tu contraseña para confirmar.');
      return;
    }
    if (!profileIdFromAuth) {
      Alert.alert('Error', 'No se encontró el ID de usuario.');
      return;
    }
    if (!selectedReason) { // Verificación extra
      Alert.alert('Error', 'No se seleccionó un motivo.');
      return;
    }

    setDeleteLoading(true);

    // --- Construye el motivo ---
    const finalSelectedOption = selectedReason;
    const finalOtherText = (selectedReason === 'Otro (déjanos tus comentarios):') ? otherReasonText : null;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de sesión.');
      }

      // 1. Construir la URL completa
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/auth/delete-account`;
      console.log("Intentando eliminar cuenta en URL:", apiUrl);

      // 2. Hacer la llamada a axios.delete
      const response = await axios.delete(
        apiUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          // Envía los datos estructurados al backend
          data: {
            password: passwordInput,
            selectedOption: finalSelectedOption,
            otherText: finalOtherText
          }
        }
      );

      if (response.status === 200) {
        Alert.alert('Cuenta Eliminada', 'Tu cuenta ha sido desactivada exitosamente.');
        await handleSignOut(); // Cierra sesión
      } else {
        const errorMessage = response.data?.message || 'El servidor devolvió un error inesperado.';
        throw new Error(errorMessage);
      }

    } catch (error) {
      let errorMessage = 'Ocurrió un error inesperado al eliminar la cuenta.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
        if (error.message === 'Network Error') {
          console.error('Error Axios eliminando cuenta: "Network Error" - Verifica la conexión.');
          errorMessage = 'Error de red. Asegúrate de estar conectado y que el servidor esté accesible.';
        } else {
          console.error('Error Axios eliminando cuenta:', JSON.stringify(error.response?.data || error.message));
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error desconocido eliminando cuenta:', error);
      } else {
        console.error('Error desconocido (no Error object):', error);
      }
      Alert.alert('Error al Eliminar', errorMessage);
    } finally {
      setDeleteLoading(false);
      setShowConfirmModal(false);
    }
  };

  // --- Array de secciones (sin cambios) ---
  const sections: { title: string; items: SectionItem[] }[] = [
    // ... (Tu código de secciones) ...
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E6007A" translucent={false} />

      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        {/* ... (Tu código del Header) ... */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => usuario && navigation.navigate('UserDetailsScreen', { user: usuario })}
          >
            <Image
              source={{ uri: usuario?.imagen?.startsWith('http') ? usuario.imagen : `${process.env.EXPO_PUBLIC_API_URL}/uploads/defaults/avatar-default.png` }}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {usuario?.nombre} {usuario?.apellido}
              </Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Mi perfil</Text>
                <Icon name="chevron-right" size={16} color="#fff" style={{ marginLeft: moderateScale(4) }} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.contentSafe}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* ... (Tu código .map de secciones) ... */}
          {sections.map((sec, si) => (
            <View key={si} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.params) {
                      navigation.navigate(item.to, item.params);
                    } else {
                      navigation.navigate(item.to);
                    }
                  }}
                >
                  <View style={styles.itemLeft}>
                    <Icon name={item.icon} size={20} />
                    <Text style={styles.itemText}>{item.label}</Text>
                  </View>
                  <Icon name="chevron-right" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* --- Sección de Acciones --- */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={handleSignOut}>
              <View style={styles.itemLeft}>
                <Icon name="log-out" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Cerrar sesión</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>

            {/* --- Botón Eliminar Cuenta (llama a handleDeletePress) --- */}
            <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={handleDeletePress}>
              <View style={styles.itemLeft}>
                <Icon name="trash-2" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Eliminar cuenta</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>

            {
              userRol !== 'vendedor' ?
                <TouchableOpacity
                  style={styles.item}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('FormularioVendedor')}
                >
                  <View style={styles.itemLeft}>
                    <Icon name="box" size={20} color="#E6007A" />
                    <Text style={[styles.itemText, { color: '#E6007A' }]}>Convierte en vendedor</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#E6007A" />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={styles.itemSeller}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('TabsVendedor' as never)}
                >
                  <View style={styles.itemLeft}>
                    <Icon name="box" size={20} color="#fff" />
                    <Text style={[styles.itemText, { color: '#fff' }]}>Panel de vendedor</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>
            }
          </View >
        </ScrollView >
      </SafeAreaView >

      {/* --- MODAL PARA LA RAZÓN (Diseño de tu amigo) --- */}
      < Modal
        visible={showReasonModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowReasonModal(false)
        }
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          {/* --- Envoltorio para cerrar teclado --- */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Icon name="trash-2" size={moderateScale(20)} color="#333" />
                <Text style={styles.modalTitle}>Eliminar cuenta</Text>
              </View>
              <Text style={styles.modalSubtitle}>
                Lamentamos que quieras eliminar tu cuenta. Por favor, cuéntanos un poco sobre el porqué te gustaría
                hacerlo.
              </Text>

              {/* Opciones */}
              {deleteReasons.map((reason, index) => {
                const isSelected = selectedReason === reason;
                const isOther = reason === 'Otro (déjanos tus comentarios):';
                return (
                  <View key={`${reason}-${index}`}>
                    <TouchableOpacity
                      style={styles.radioOption}
                      activeOpacity={0.7}
                      onPress={() => setSelectedReason(reason)}
                    >
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioCircleInner} />}
                      </View>
                      <Text style={styles.radioLabel}>{reason}</Text>
                    </TouchableOpacity>

                    {/* Muestra el TextInput solo si "Otro" está seleccionado */}
                    {isOther && isSelected && (
                      <TextInput
                        style={styles.textInput}
                        placeholder="Escribe tus comentarios..."
                        placeholderTextColor="#999"
                        value={otherReasonText}
                        onChangeText={setOtherReasonText}
                        multiline
                      />
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonDelete,
                  !selectedReason && styles.modalButtonDisabled, // Deshabilita si no hay razón
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setShowReasonModal(false);   // Oculta este modal
                  setShowConfirmModal(true);  // Muestra el modal de CONTRASEÑA
                }}
                disabled={!selectedReason}
              >
                {/* Texto cambiado a "Continuar" para el flujo de 2 pasos */}
                <Text style={styles.modalButtonText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                activeOpacity={0.8}
                onPress={() => setShowReasonModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal >

      {/* --- MODAL DE CONTRASEÑA (Tu código original) --- */}
      < Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !deleteLoading && setShowConfirmModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
              <Text style={styles.modalMessage}>
                Esta acción es permanente. Para confirmar, ingresa tu contraseña.
              </Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
                autoCapitalize="none"
                editable={!deleteLoading}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowConfirmModal(false)}
                  disabled={deleteLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton, deleteLoading && styles.disabledButton]}
                  onPress={confirmDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Eliminar Cuenta</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal >
      {/* --- FIN MODAL --- */}
    </>
  );
}

// --- ESTILOS ---
// (Asegúrate de copiar todos los estilos que te pasó tu amigo
// y los que ya tenías, incluyendo los estilos del modal de contraseña
// y el nuevo 'reasonInput' y los estilos de radio button)
const styles = StyleSheet.create({
  // ... (Estilos de headerSafe, contentSafe, header, profileButton, avatar, etc.) ...
  headerSafe: { backgroundColor: '#E6007A' },
  contentSafe: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: moderateScale(16) },
  profileButton: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: moderateScale(48), height: moderateScale(48), borderRadius: moderateScale(24), backgroundColor: '#fff' },
  textContainer: { marginLeft: moderateScale(12), flex: 1 },
  name: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#fff' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: moderateScale(4) },
  subtitle: { fontSize: moderateScale(14), color: '#fff' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: moderateScale(16), paddingTop: moderateScale(24), paddingBottom: moderateScale(120) },
  section: { marginBottom: moderateScale(24) },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: 'bold', marginBottom: moderateScale(12), color: '#333' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: moderateScale(14), marginBottom: moderateScale(10), borderRadius: moderateScale(10), shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: moderateScale(16), marginLeft: moderateScale(10), color: '#333' },

  // --- Estilos de Modales (Combinados) ---
  modalBackdrop: { // De tu amigo
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlay: { // Tuyo (funciona también, puedes elegir uno)
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(20), // De tu amigo (si usas modalBackdrop)
    borderTopRightRadius: moderateScale(20), // De tu amigo (si usas modalBackdrop)
    borderRadius: moderateScale(12), // Tuyo (si usas modalOverlay)
    padding: moderateScale(24),
    paddingBottom: moderateScale(40), // De tu amigo
    width: '100%', // Tuyo
    maxWidth: 400, // Tuyo
    alignItems: 'center', // Tuyo
  },
  modalHeader: { // De tu amigo
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: moderateScale(10),
    color: '#333',
    marginLeft: moderateScale(10), // De tu amigo
  },
  modalSubtitle: { // De tu amigo
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: moderateScale(20),
    lineHeight: moderateScale(20),
    textAlign: 'center', // Añadido para centrar
  },
  modalMessage: { // Tuyo
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: moderateScale(20),
    color: '#555',
    lineHeight: moderateScale(20),
  },
  radioOption: { // De tu amigo
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(16),
  },
  radioCircle: { // De tu amigo
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  radioCircleSelected: { // De tu amigo
    borderColor: '#E6007A',
  },
  radioCircleInner: { // De tu amigo
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: '#E6007A',
  },
  radioLabel: { // De tu amigo
    fontSize: moderateScale(14),
    color: '#333',
    flex: 1,
  },
  textInput: { // De tu amigo (para 'Otro')
    height: moderateScale(80),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    textAlignVertical: 'top',
    marginBottom: moderateScale(20),
    marginLeft: moderateScale(32),
    fontSize: moderateScale(14),
  },
  passwordInput: { // Tuyo (para contraseña)
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    fontSize: moderateScale(14),
    marginBottom: moderateScale(20),
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  reasonInput: { // Tuyo (para el modal simple) - AHORA USADO por el modal de tu amigo
    height: moderateScale(80),
    textAlignVertical: 'top',
  },
  modalButtons: { // Tuyo
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemSeller: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6007A',
    padding: moderateScale(14),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButton: {
    flex: 1,
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginHorizontal: moderateScale(5),
    marginTop: moderateScale(10),
  },
  alignItems: 'center',
  marginHorizontal: moderateScale(5), // Tuyo
  marginTop: moderateScale(10), // De tu amigo
},
  cancelButton: { // Tuyo
  backgroundColor: '#eee',
  borderWidth: 1,
  borderColor: '#ddd',
},
  confirmButton: { // Tuyo
  backgroundColor: '#E6007A',
},
  disabledButton: { // Tuyo
  backgroundColor: '#cccccc',
},
  cancelButtonText: { // Tuyo
  color: '#333',
  fontWeight: '500',
  fontSize: moderateScale(14),
},
  confirmButtonText: { // Tuyo
  color: '#fff',
  fontWeight: 'bold',
  fontSize: moderateScale(14),
},
  modalButtonDelete: { // De tu amigo
  backgroundColor: '#E6007A',
},
  modalButtonCancel: { // De tu amigo
  backgroundColor: '#f0f0f0',
},
  modalButtonText: { // De tu amigo
  color: '#fff',
  fontSize: moderateScale(16),
  fontWeight: 'bold',
},
  modalButtonTextCancel: { // De tu amigo
  color: '#333',
  fontSize: moderateScale(16),
  fontWeight: 'bold',
},
});