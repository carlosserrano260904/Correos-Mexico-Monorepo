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
} from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../schemas/schemas';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { actualizarUsuarioPorId, idUser, uploadAvatar } from '../../../api/profile';

const ACCENT = '#E6007E';
const BACKGROUND = '#F2F2F5';



type Props = NativeStackScreenProps<RootStackParamList, 'UserDetailsScreen'>;
export default function UserDetailsScreen({ route,navigation }: Props) {
   const { user } = route.params;
  const [userData, setUserData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const pickImage = async()=>{
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(status !=='granted'){
      return Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos para cambiar la foto de perfil.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[1,1],
      quality:0.7
    })
    if (!result.canceled && result.assets.length) {
      // 1.c) actualizar estado
      setUserData({ ...userData, imagen: result.assets[0].uri });
    }
  }

  const handleSave = async () => {
  try {
    // 1) Si la URI cambió, sube primero el avatar y obtén la URL remota
    if (isEditing && userData.imagen !== user.imagen) {
      const remoteUrl = await uploadAvatar(userData.imagen, idUser);
      userData.imagen = remoteUrl;
    }

    // 2) Ahora sí actualiza el resto del perfil
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


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {/* Botón de editar/cancelar */}
          <TouchableOpacity style={styles.editIcon} onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name={isEditing ? 'close-outline' : 'create-outline'} size={24} color={ACCENT} />
          </TouchableOpacity>

           <TouchableOpacity onPress={isEditing ? pickImage : undefined}>
            <Image
              source={{ uri: userData.imagen }}
              style={styles.avatar}
            />
            {isEditing && (
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Nombre y apellido */}
          {isEditing ? (
            <TextInput
              style={[styles.name, styles.input]}
              value={userData.nombre}
              onChangeText={text => handleChange('nombre', text)}
              placeholder="Nombre"
            />
          ) : (
            <Text style={styles.name}>{userData.nombre} {userData.apellido}</Text>
          )}
          {isEditing && (
            <TextInput
              style={[styles.name, styles.input]}
              value={userData.apellido}
              onChangeText={text => handleChange('apellido', text)}
              placeholder="Apellido"
            />
          )}

          {/* Sección Contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color={ACCENT} style={styles.icon} />
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
              <Ionicons name="location" size={18} color={ACCENT} style={styles.icon} />
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

          {/* Sección Dirección */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dirección</Text>
            <View style={styles.infoRow}>
              <Ionicons name="home" size={18} color={ACCENT} style={styles.icon} />
              {isEditing ? (
                <TextInput
                  style={[styles.infoText, styles.input]}
                  value={userData.fraccionamiento}
                  onChangeText={text => handleChange('fraccionamiento', text)}
                  placeholder="Fraccionamiento"
                />
              ) : (
                <Text style={styles.infoText}>{userData.fraccionamiento}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business" size={18} color={ACCENT} style={styles.icon} />
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
              <Ionicons name="pricetag" size={18} color={ACCENT} style={styles.icon} />
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

          {/* Botón Guardar */}
          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar Cambios</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: ACCENT,
    padding: 6,
    borderRadius: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    paddingTop: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    position: 'relative',
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
    marginBottom: 16,
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
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingVertical: 4,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
