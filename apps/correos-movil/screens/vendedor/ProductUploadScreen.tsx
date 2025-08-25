import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Camera, ArrowLeft } from 'lucide-react-native';
import ColorPalette from 'react-native-color-palette';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { useMyAuth } from './../../context/AuthContext';

import { Float } from 'react-native/Libraries/Types/CodegenTypes';

const IP = process.env.EXPO_PUBLIC_API_URL;

const MAX_IMAGES = 9;

// Interfaz para los datos del formulario del producto
interface ProductFormData {
  nombre: string;
  descripcion: string;
  altura: number | null;
  ancho: number | null;
  largo: number | null;
  peso: number | null;
  precio: number | null;
  categoria: string;
  inventario: number | null;
  color: string;
  marca: string;
  slug: string;
  vendedor: string;
}

// Interfaz para los items de imágenes, distinguiendo locales y remotas
interface ImageItem {
  id: number;
  uri: string;
  orden: number;
  productId: number;
  fileName?: string | null;
  mimeType?: string | null;
}

// Datos iniciales del formulario
const initialFormData: ProductFormData = {
  nombre: '',
  descripcion: '',
  altura: null,
  ancho: null,
  largo: null,
  peso: null,
  precio: null,
  categoria: '',
  inventario: null,
  color: '',
  marca: '',
  slug: '',
  vendedor: '',
};

const ProductUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useMyAuth();

  // Maneja cambios en inputs de texto
  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Limpia el formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setImageItems([]);
  };

  // Maneja cambios en inputs numéricos, asegurando que el estado almacene un número o null
  const handleNumericFieldChange = (
    field: 'precio' | 'inventario' | 'peso' | 'altura' | 'ancho' | 'largo',
    text: string
  ) => {
    const isIntegerField = field === 'inventario';

    if (text === '') {
      setFormData(prev => ({ ...prev, [field]: null }));
      return;
    }

    const sanitizedText = isIntegerField ? text.replace(/[^0-9]/g, '') : text.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(sanitizedText);

    if (!isNaN(numericValue)) {
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    }
  };
  
  // Sube una nueva imagen desde la galería
  const handleImageUpload = async () => {
    if (imageItems.length >= MAX_IMAGES) {
      Alert.alert('Límite alcanzado', `Puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permisos para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setImageItems(prev => [
        ...prev,
        {
          id: Date.now(),              // Usar un ID único para evitar duplicados
          uri: asset.uri,              // la uri que recibes del picker
          fileName: asset.fileName,    // Nombre del archivo desde el asset
          mimeType: asset.mimeType,    // Tipo MIME desde el asset
          orden: prev.length + 1,      // posición en el array
          productId: 0,
        },
      ]);
    }
  };

  // Elimina una imagen
  const handleRemoveImage = (indexToRemove: number) => {
    setImageItems(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Selecciona un color y lo agrega si no existe
  const handleColorSelect = (selectedColor: string) => {
    setFormData(prev => ({
      ...prev,
      color: selectedColor, // asigna el color directamente
    }));
    setColorPickerVisible(false);
  };

  // Elimina un color seleccionado
  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      color: prev.color === colorToRemove ? "" : prev.color, // lo borra si coincide
    }));
  };

  function generateRandomSku(): string {
    let digits = '';
    for (let i = 0; i < 12; i++) {
      digits += Math.floor(Math.random() * 10); // genera un número del 0 al 9
    }
    return `sku-${digits}`;
  }

  function generateSlug(formData: { nombre: string; marca?: string; slug?: string }): string {
  if (formData.slug && formData.slug.trim() !== '') {
    return formData.slug; // si ya existe slug, lo usamos
  }

  // Combinar propiedades que quieras usar para el slug
  let base = formData.nombre;
  if (formData.marca) {
    base += ' ' + formData.marca;
  }

  // Limpiar y normalizar
  return base
    .toLowerCase() // minúsculas
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina acentos
    .replace(/[^a-z0-9]+/g, '-') // reemplaza caracteres no alfanuméricos por '-'
    .replace(/^-+|-+$/g, ''); // elimina '-' al inicio y fin
}

  // Envía el formulario de creación
  const handleSubmit = async () => {

    if (!formData.nombre) {
      Alert.alert('Error', 'Por favor ingresa el nombre del producto.');
      return;
    }
    if (!formData.precio) {
      Alert.alert('Error', 'Por favor ingresa el precio del producto.');
      return;
    }
    const precioNum = parseFloat(String(formData.precio));
    if (isNaN(precioNum) || precioNum <= 0) {
      Alert.alert('Error', 'El precio debe ser un número mayor que 0');
      return;
    }
    if (!formData.descripcion) {
      Alert.alert('Error', 'Por favor ingresa una descripcion del producto.');
      return;
    }
    if (!formData.categoria) {
      Alert.alert('Error', 'Por favor ingresa la categoria del producto.');
      return;
    }
    if (!formData.inventario) {
      Alert.alert('Error', 'Por favor ingresa la cantidad de productos disponibles.');
      return;
    }
    if (!formData.marca) {
      Alert.alert('Error', 'Por favor ingresa la marca del producto.');
      return;
    }
    if (!formData.color) {
      Alert.alert('Error', 'Por favor selecciona el color del producto.');
      return;
    }
    if (!formData.peso) {
      Alert.alert('Error', 'Por favor ingresa el peso del producto.');
      return;
    }
    if (isNaN(formData.peso) || formData.peso <= 0) {
      Alert.alert('Error', 'El peso debe ser un número mayor que 0');
      return;
    }
    if (!formData.altura) {
      Alert.alert('Error', 'Por favor ingresa la altura del producto.');
      return;
    }
    if (isNaN(formData.altura) || formData.altura <= 0) {
      Alert.alert('Error', 'La altura debe ser un número mayor que 0');
      return;
    }
    if (!formData.ancho) {
      Alert.alert('Error', 'Por favor ingresa el ancho del producto.');
      return;
    }
    if (isNaN(formData.ancho) || formData.ancho <= 0) {
      Alert.alert('Error', 'El ancho debe ser un número mayor que 0');
      return;
    }
    if (!formData.largo) {
      Alert.alert('Error', 'Por favor ingresa el largo del producto.');
      return;
    }
    if (isNaN(formData.largo) || formData.largo <= 0) {
      Alert.alert('Error', 'El largo debe ser un número mayor que 0');
      return;
    }
    if (!formData.vendedor) {
      Alert.alert('Error', 'Por favor ingresa el vendedor del producto.');
      return;
    }
    
    if (imageItems.length === 0) {
      Alert.alert('Error', 'Por favor, sube al menos una imagen del producto.');
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('precio', String(formData.precio));
    data.append('categoria', formData.categoria);
    data.append('inventario', String(formData.inventario));
    data.append('marca', formData.marca);
    data.append('peso', formData.peso.toString());
    data.append('altura', formData.altura.toString());
    data.append('ancho', formData.ancho.toString());
    data.append('largo', formData.largo.toString());
    data.append('color', formData.color || 'Sin color');
    data.append('vendedor', formData.vendedor);
    data.append('slug', generateSlug(formData));
    data.append('sku', generateRandomSku());
    data.append('estado', 'true');
    data.append('vendidos', '0');
       
    if (userId) {
      data.append('idPerfil', userId);
    }

    // Agrega las imágenes
    for (const item of imageItems) {
      const uri = item.uri;
      // Usar el nombre de archivo del asset si está disponible, si no, derivarlo de la URI.
      const filename = item.fileName || uri.split('/').pop();

      // Si no podemos determinar un nombre de archivo, es mejor omitir esta imagen.
      if (!filename) {
        console.warn('No se pudo determinar el nombre del archivo para la imagen, omitiendo:', uri);
        continue;
      }

      // Usar el tipo MIME del asset si está disponible, si no, derivarlo de la extensión.
      const match = /\.(\w+)$/.exec(filename);
      const type = item.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');
      data.append('images', { uri, name: filename, type } as any);
    }

    try {
      const response = await fetch(`${IP}/api/products`, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(result.message)
          ? result.message.join('\n')
          : result.message || 'Error al actualizar el producto';
        throw new Error(errorMessage);
      }

      Alert.alert('Éxito', 'Producto creado correctamente');
      resetForm();
      navigation.goBack();
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error);
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navega hacia atrás
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color="#000000ff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear producto</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Input para nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.nombre}
            onChangeText={(text) => handleInputChange('nombre', text)}
            maxLength={60}
            placeholder="Ej: Camisa de algodón"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para precio */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.precio === null ? '' : String(formData.precio)}
            onChangeText={text => handleNumericFieldChange('precio', text)}
            keyboardType="decimal-pad"
            placeholder="Ej: 299.99"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para descripcion */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(text) => handleInputChange('descripcion', text)}
            multiline
            maxLength={120}
            placeholder="Describe tu producto detalladamente"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para categoria */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.categoria}
              onValueChange={(value) => handleInputChange('categoria', value)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              <Picker.Item label="Accesorios de moda" value="Accesorios de moda" />
              <Picker.Item label="Alimentos y bebidas" value="Alimentos y bebidas" />
              <Picker.Item label="Antigüedades" value="Antigüedades" />
              <Picker.Item label="Arte y coleccionables" value="Arte y coleccionables" />
              <Picker.Item label="Artesanías mexicanas" value="Artesanías mexicanas" />
              <Picker.Item label="Automotriz y refacciones" value="Automotriz y refacciones" />
              <Picker.Item label="Bebés y maternidad" value="Bebés y maternidad" />
              <Picker.Item label="Belleza y cuidado personal" value="Belleza y cuidado personal" />
              <Picker.Item label="Bolsas y mochilas" value="Bolsas y mochilas" />
              <Picker.Item label="Calzado deportivo" value="Calzado deportivo" />
              <Picker.Item label="Celulares y tablets" value="Celulares y tablets" />
              <Picker.Item label="Computadoras y accesorios" value="Computadoras y accesorios" />
              <Picker.Item label="Deportes y fitness" value="Deportes y fitness" />
              <Picker.Item label="Electrodomésticos" value="Electrodomésticos" />
              <Picker.Item label="Electrónica" value="Electrónica" />
              <Picker.Item label="FONART" value="FONART" />
              <Picker.Item label="Filatelia mexicana" value="Filatelia mexicana" />
              <Picker.Item label="Hecho en Tamaulipas" value="Hecho en Tamaulipas" />
              <Picker.Item label="Herramientas y construcción" value="Herramientas y construcción" />
              <Picker.Item label="Hogar y decoración" value="Hogar y decoración" />
              <Picker.Item label="Jóvenes construyendo el futuro" value="Jóvenes construyendo el futuro" />
              <Picker.Item label="Joyería y bisutería" value="Joyería y bisutería" />
              <Picker.Item label="Juegos y juguetes" value="Juegos y juguetes" />
              <Picker.Item label="Libros" value="Libros" />
              <Picker.Item label="Mascotas" value="Mascotas" />
              <Picker.Item label="Música e instrumentos musicales" value="Música e instrumentos musicales" />
              <Picker.Item label="Original" value="Original" />
              <Picker.Item label="Papelería y oficina" value="Papelería y oficina" />
              <Picker.Item label="Películas y series" value="Películas y series" />
              <Picker.Item label="Productos ecológicos y sustentables" value="Productos ecológicos y sustentables" />
              <Picker.Item label="Relojes y gafas" value="Relojes y gafas" />
              <Picker.Item label="Ropa, moda y calzado" value="Ropa, moda y calzado" />
              <Picker.Item label="Sabores artesanales" value="Sabores artesanales" />
              <Picker.Item label="Salud y cuidado médico" value="Salud y cuidado médico" />
              <Picker.Item label="SEDECO Michoacán" value="SEDECO Michoacán" />
              <Picker.Item label="Servicios digitales" value="Servicios digitales" />
              <Picker.Item label="Software y apps" value="Software y apps" />
              <Picker.Item label="Viajes y experiencias" value="Viajes y experiencias" />
              <Picker.Item label="Videojuegos y consolas" value="Videojuegos y consolas" />
            </Picker>
          </View>
        </View>

        {/* Input para inventario */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Inventario *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.inventario === null ? '' : String(formData.inventario)}
            onChangeText={text => handleNumericFieldChange('inventario', text)}
            keyboardType='decimal-pad'
            placeholder="Ej: 50"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para marca */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.marca}
            onChangeText={(text) => handleInputChange('marca', text)}
            maxLength={60}
            placeholder="Ej: Mi Marca"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Sección para color */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color *</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setColorPickerVisible(true)}>
            <Text style={styles.addButtonText}>Añadir color</Text>
          </TouchableOpacity>
          <View style={styles.colorChipsContainer}>
            {formData.color ? (
              <View style={styles.colorChip}>
                <View style={[styles.colorPreview, { backgroundColor: formData.color }]} />
                <Text style={styles.colorChipText}>{formData.color}</Text>
                <TouchableOpacity onPress={() => handleRemoveColor(formData.color)}>
                  <Text style={styles.removeColorText}>×</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.noColorText}>Ningún color seleccionado</Text>
            )}
          </View>
        </View>

        {/* Input para peso */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.peso === null ? '' : String(formData.peso)}
            onChangeText={text => handleNumericFieldChange('peso', text)}
            maxLength={40}
            keyboardType='decimal-pad'
            placeholder="Ej: 0.5 (en kg)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para altura */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.altura === null ? '' : String(formData.altura)}
            onChangeText={text => handleNumericFieldChange('altura', text)}
            maxLength={40}
            keyboardType='decimal-pad'
            placeholder="Ej: 10 (en cm)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para ancho */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ancho *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.ancho === null ? '' : String(formData.ancho)}
            onChangeText={text => handleNumericFieldChange('ancho', text)}
            maxLength={40}
            keyboardType='decimal-pad'
            placeholder="Ej: 20 (en cm)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para largo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Largo *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.largo === null ? '' : String(formData.largo)}
            onChangeText={text => handleNumericFieldChange('largo', text)}
            maxLength={40}
            keyboardType='decimal-pad'
            placeholder="Ej: 30 (en cm)"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Input para vendedor */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de la tienda del Vendedor *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.vendedor}
            onChangeText={(text) => handleInputChange('vendedor', text)}
            maxLength={80}
            placeholder="Ej: Mi Tienda Oficial"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Sección para imágenes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Imágenes del producto (máx. {MAX_IMAGES}) *</Text>
          <View style={styles.imageContainer}>
            {imageItems.map((item, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {imageItems.length < MAX_IMAGES && (
              <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
                <Camera style={styles.cameraIcon} />
                <Text style={styles.addImageText}>Añadir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Text style={styles.submitButtonText}>Subiendo...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Subir producto</Text>
          )}
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isColorPickerVisible}
          onRequestClose={() => {
            setColorPickerVisible(!isColorPickerVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecciona un color</Text>
              <ColorPalette
                onChange={handleColorSelect}
                colors={[
                  '#C0392B', '#E74C3C', '#9B59B6', '#8E44AD', '#2980B9', '#3498DB',
                  '#1ABC9C', '#16A085', '#27AE60', '#2ECC71', '#F1C40F', '#F39C12',
                  '#E67E22', '#D35400', '#ECF0F1', '#BDC3C7', '#95A5A6', '#7F8C8D',
                  '#34495E', '#2C3E50', '#000000',
                ]}
                title={''}
                icon={<Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>✔</Text>}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setColorPickerVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '30%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    color: '#1F2937',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageUpload: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 20,
  },
  cameraIcon: {
    color: '#9CA3AF',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  addButton: {
    backgroundColor: '#EC4899',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  colorChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  noColorText: {
    marginTop: 8,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 16,
  },
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  colorChipText: {
    color: '#1F2937',
    fontWeight: '500',
  },
  removeColorText: {
    marginLeft: 8,
    color: '#6B7280',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#6B7280',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#EC4899',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
});

export default ProductUploadScreen;