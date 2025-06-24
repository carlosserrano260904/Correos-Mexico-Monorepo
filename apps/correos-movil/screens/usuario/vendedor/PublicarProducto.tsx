import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { myIp } from '../../../api/miscompras';

export default function CrearProductoScreen({ navigation }) {
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [inventario, setInventario] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Necesitamos permisos para acceder a tus imágenes.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (result.canceled) return;
    const uri = result.assets[0].uri;
    setImagen(uri);
  };

  const handleSubmit = async () => {
    if (!nombre || !descripcion || !inventario || !precio || !categoria || !color || !imagen) {
      alert('Por favor completa todos los campos, incluida la imagen.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('inventario', inventario);
    formData.append('precio', precio);
    formData.append('categoria', categoria);
    formData.append('color', color);
    formData.append('imagen', { uri: imagen, name: 'photo.jpg', type: 'image/jpeg' } as any);

    try {
      const res = await fetch(`http://${myIp}:3000/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('Producto creado con éxito');
        setNombre('');
        setDescripcion('');
        setInventario('');
        setPrecio('');
        setCategoria('');
        setColor('');
        setImagen(null);
      } else {
        alert(`Error al crear producto:\n${data.message || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de red, revisa tu conexión o la URL del servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={PINK} />
      {/* Header con SafeArea */}
      <SafeAreaView style={{ backgroundColor: PINK }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear nuevo producto</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      {/* Contenido con KeyboardAvoiding */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Television"
              />

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Television con excelente calidad"
                multiline
              />

              <Text style={styles.label}>Inventario</Text>
              <TextInput
                style={styles.input}
                value={inventario}
                onChangeText={setInventario}
                placeholder="10"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Precio</Text>
              <TextInput
                style={styles.input}
                value={precio}
                onChangeText={setPrecio}
                placeholder="1200"
                keyboardType="numeric"
              />

              <Text style={styles.label}>Categoría</Text>
              <TextInput
                style={styles.input}
                value={categoria}
                onChangeText={setCategoria}
                placeholder="Blancos"
              />

              <Text style={styles.label}>Color (hex)</Text>
              <TextInput
                style={styles.input}
                value={color}
                onChangeText={setColor}
                placeholder="#000"
              />

              <Text style={styles.label}>Imagen</Text>
              <TouchableOpacity
                style={[styles.imagePicker, !imagen && { borderStyle: 'dashed' }]}
                onPress={pickImage}
              >
                {imagen ? (
                  <Image source={{ uri: imagen }} style={styles.image} />
                ) : (
                  <Text style={styles.imagePlaceholder}>Selecciona imagen</Text>
                )}
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
              ) : (
                <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
                  <Text style={styles.btnSubmitText}>Crear producto</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const PINK = '#e91e63';
const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: PINK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePicker: {
    height: 100,
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imagePlaceholder: {
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  btnSubmit: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: PINK,
  },
  btnSubmitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
