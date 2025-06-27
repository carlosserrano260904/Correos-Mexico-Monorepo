import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../../../schemas/schemas';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { actualizarUsuarioPorId, idUser, uploadAvatar } from '../../../api/profile';
import { obtenerDatosPorCodigoPostal } from '../../../api/postal';
import { moderateScale } from 'react-native-size-matters';

const PINK = '#E6007E';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetailsScreen'>;

export default function UserDetailsScreen({ route, navigation }: Props) {
  const { user } = route.params;
  const [userData, setUserData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [colonias, setColonias] = useState<string[]>([]);
  const [selectedColonia, setSelectedColonia] = useState('');

  const handleChange = async (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));

    if (field === 'codigoPostal' && value.length === 5) {
      const datosArray = await obtenerDatosPorCodigoPostal(value);
      if (datosArray && datosArray.length > 0) {
        const coloniasList = datosArray.map(d => d.d_asenta);
        setColonias(coloniasList);
        setSelectedColonia(coloniasList[0]);
        setUserData(prev => ({
          ...prev,
          estado: datosArray[0].d_estado || '',
          ciudad: datosArray[0].d_ciudad || '',
          fraccionamiento: datosArray[0].d_asenta || '',
        }));
      } else {
        setColonias([]);
        setSelectedColonia('');
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para cambiar la foto de perfil.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });
    if (!result.canceled && result.assets.length) {
      setUserData({ ...userData, imagen: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing && userData.imagen !== user.imagen) {
        const remoteUrl = await uploadAvatar(userData.imagen, idUser);
        userData.imagen = remoteUrl;
      }
      const usuario = await actualizarUsuarioPorId(userData, idUser);
      if (usuario?.ok) {
        Alert.alert('Éxito', 'Perfil actualizado', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'No se pudo actualizar tu perfil.');
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleCancel = () => {
    setUserData(user);
    setIsEditing(false);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PINK} />

      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi perfil</Text>
          {/* View vacío para balancear el espacio y centrar el título */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenido principal */}
      <SafeAreaView style={styles.contentSafe}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={isEditing ? pickImage : undefined}>
              <Image source={{ uri: userData.imagen }} style={styles.avatar} />
              {isEditing && (
                <View style={styles.cameraOverlay}>
                  <Ionicons name="camera" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Nombre y apellido */}
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.name, styles.input]}
                  value={userData.nombre}
                  onChangeText={text => handleChange('nombre', text)}
                  placeholder="Nombre"
                />
                <TextInput
                  style={[styles.name, styles.input]}
                  value={userData.apellido}
                  onChangeText={text => handleChange('apellido', text)}
                  placeholder="Apellido"
                />
              </>
            ) : (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={styles.name}>{userData.nombre}</Text>
                <Text style={styles.lastname}>{userData.apellido}</Text>
              </View>
            )}

            <View style={styles.divider} />
            {/* Contacto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contacto</Text>
              <View style={styles.infoRow}>
                <Ionicons name="call" size={18} color={PINK} style={styles.icon} />
                {isEditing ? (
                  <TextInput
                    style={[styles.infoText, styles.input]}
                    value={userData.numero}
                    onChangeText={text => handleChange('numero', text)}
                    keyboardType="phone-pad"
                    placeholder="Teléfono"
                  />
                ) : (
                  <Text style={styles.infoText}>{userData.numero}</Text>
                )}
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color={PINK} style={styles.icon} />
                {isEditing ? (
                  <TextInput
                    style={[styles.infoText, styles.input]}
                    value={userData.ciudad}
                    onChangeText={text => handleChange('ciudad', text)}
                    placeholder="Ciudad"
                  />
                ) : (
                  <Text style={styles.infoText}>{userData.ciudad}, {userData.estado}</Text>
                )}
              </View>
            </View>

            {/* Dirección */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dirección</Text>
              <View style={styles.infoRow}>
                <Ionicons name="home" size={18} color={PINK} style={styles.icon} />
                {isEditing ? (
                  colonias.length > 0 ? (
                    <Picker
                      selectedValue={selectedColonia}
                      onValueChange={(itemValue) => {
                        setSelectedColonia(itemValue);
                        setUserData(prev => ({ ...prev, fraccionamiento: itemValue }));
                      }}
                      style={{ flex: 1 }}
                    >
                      {colonias.map((colonia, index) => (
                        <Picker.Item key={index} label={colonia} value={colonia} />
                      ))}
                    </Picker>
                  ) : (
                    <TextInput
                      style={[styles.infoText, styles.input]}
                      value={userData.fraccionamiento}
                      onChangeText={text => handleChange('fraccionamiento', text)}
                      placeholder="Fraccionamiento"
                    />
                  )
                ) : (
                  <Text style={styles.infoText}>{userData.fraccionamiento}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="business" size={18} color={PINK} style={styles.icon} />
                {isEditing ? (
                  <TextInput
                    style={[styles.infoText, styles.input]}
                    value={userData.calle}
                    onChangeText={text => handleChange('calle', text)}
                    placeholder="Calle"
                  />
                ) : (
                  <Text style={styles.infoText}>{userData.calle}</Text>
                )}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="pricetag" size={18} color={PINK} style={styles.icon} />
                {isEditing ? (
                  <TextInput
                    style={[styles.infoText, styles.input]}
                    value={userData.codigoPostal}
                    onChangeText={text => handleChange('codigoPostal', text)}
                    keyboardType="numeric"
                    placeholder="CP"
                  />
                ) : (
                  <Text style={styles.infoText}>{userData.codigoPostal}</Text>
                )}
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              {isEditing ? (
                <>
                  <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.saveText}>Guardar Cambios</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => setIsEditing(true)}>
                  <Text style={styles.saveText}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  cameraOverlay: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    backgroundColor: PINK,
    padding: 8,
    borderRadius: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: PINK,
  },
  content: {
    alignItems: 'center',
  },
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(12),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(80),
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  lastname: {
    fontSize: 20,
    fontWeight: '400',
    color: '#666',
    marginTop: 2,
  },
  headerSafe: {
    backgroundColor: PINK,
  },
  contentSafe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(20),
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 30 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: moderateScale(20),
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },  
  section: {
    width: '100%',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingVertical: 4,
    fontSize: 16,
    color: '#555',
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: PINK,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonsContainer: {
    marginTop: 24,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: PINK,
    marginVertical: 16,
  },
});