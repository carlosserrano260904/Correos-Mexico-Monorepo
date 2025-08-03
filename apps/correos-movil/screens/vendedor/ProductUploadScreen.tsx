import React, { useState } from 'react';
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

const IP = Constants.expoConfig?.extra?.IP_LOCAL;

const MAX_IMAGES = 9;

interface ProductFormData {
  nombre: string;
  descripcion: string;
  precio: string;
  inventario: string;
  categoria: string;
  color: string[];
}

const initialFormData: ProductFormData = {
  nombre: '',
  descripcion: '',
  precio: '',
  inventario: '',
  categoria: '',
  color: [],
};

const ProductUploadScreen: React.FC = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    if (field === 'color') return;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImageUris([]);
  };

  const handlePriceInputChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    handleInputChange('precio', numericValue);
  };

const handleImageUpload = async () => {
  if (imageUris.length >= MAX_IMAGES) {
    Alert.alert('Límite alcanzado', `Puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
    return;
  }
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso denegado', 'Necesitas dar permisos para acceder a la galería.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const uri = result.assets[0].uri;
    setImageUris(prevImages => [...prevImages, uri]);
  }
};

  const handleRemoveImage = (uriToRemove: string) => {
    setImageUris(prevUris => prevUris.filter(uri => uri !== uriToRemove));
  };

  const handleColorSelect = (selectedColor: string) => {
    if (formData.color.length >= 15) {
      Alert.alert('Límite alcanzado', 'Puedes agregar un máximo de 15 colores.');
      setColorPickerVisible(false);
      return;
    }
    if (!formData.color.includes(selectedColor)) {
      setFormData(prev => ({
        ...prev,
        color: [...prev.color, selectedColor],
      }));
    }
    setColorPickerVisible(false);
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      color: prev.color.filter(color => color !== colorToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.inventario || !formData.categoria) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (imageUris.length === 0) {
      Alert.alert('Error', 'Por favor, sube al menos una imagen del producto.');
      return;
    }

    setIsLoading(true);

    const data = new FormData();

    // Adjuntar datos del formulario
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    data.append('inventario', formData.inventario);
    // El backend espera el precio como número, el DTO lo convierte desde string
    data.append('precio', String(parseInt(formData.precio, 10) / 100));
    data.append('categoria', formData.categoria);
    // El backend espera los colores como un string separado por comas
    if (formData.color.length > 0) {
      data.append('color', formData.color.join(','));
    }

    // Adjuntar imágenes
    for (const uri of imageUris) {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename!);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      // FormData en React Native necesita un objeto con uri, name y type
      data.append('imagen', { uri, name: filename, type } as any);
    }

    try {
      const response = await fetch(`http://${IP}:3000/api/products`, {
        method: 'POST',
        body: data,
        // No establezcas 'Content-Type', fetch lo hará automáticamente
        // con el boundary correcto para multipart/form-data.
      });

      const result = await response.json();

      if (!response.ok) {
        // El backend de NestJS devuelve los errores de validación en un arreglo
        const errorMessage = Array.isArray(result.message)
          ? result.message.join('\n')
          : result.message || 'Error al crear el producto';
        throw new Error(errorMessage);
      }

      Alert.alert('Éxito', 'Producto creado correctamente');
      resetForm();
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error);
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Subir nuevo producto</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del producto *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ingresa el nombre del producto"
            placeholderTextColor="#9CA3AF"
            value={formData.nombre}
            onChangeText={(text) => handleInputChange('nombre', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Describe tu producto"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.descripcion}
            onChangeText={(text) => handleInputChange('descripcion', text)}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Precio *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="$0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={
                formData.precio
                  ? new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(parseInt(formData.precio, 10) / 100)
                  : ''
              }
              onChangeText={handlePriceInputChange}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Stock disponible *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.inventario}
              onChangeText={(text) => handleInputChange('inventario', text)}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Categoría *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.categoria}
              onValueChange={(itemValue) => handleInputChange('categoria', itemValue)}
              style={[styles.picker, !formData.categoria && { color: '#9CA3AF' }]}
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              <Picker.Item label="Electrónicos" value="Electrónicos" />
              <Picker.Item label="Ropa" value="Ropa" />
              <Picker.Item label="Hogar" value="Hogar" />
              <Picker.Item label="Deportes" value="Deportes" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Colores (máx. 15) *</Text>
          <TouchableOpacity
            style={[styles.addButton, formData.color.length >= 15 && styles.disabledButton]}
            onPress={() => setColorPickerVisible(true)}
            disabled={formData.color.length >= 15}
          >
            <Text style={styles.addButtonText}>Añadir color</Text>
          </TouchableOpacity>

          <View style={styles.colorChipsContainer}>
            {formData.color.length > 0 ? (
              formData.color.map((color, index) => (
                <View key={index} style={styles.colorChip}>
                  <View style={[styles.colorPreview, { backgroundColor: color }]} />
                  <Text style={styles.colorChipText}>{color}</Text>
                  <TouchableOpacity onPress={() => handleRemoveColor(color)}>
                    <Text style={styles.removeColorText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noColorText}>Ningún color seleccionado</Text>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Imágenes del producto (máx. {MAX_IMAGES}) *</Text>
          <View style={styles.imageContainer}>
            {imageUris.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(uri)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {imageUris.length < MAX_IMAGES && (
              <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
                <Camera style={styles.cameraIcon} />
                <Text style={styles.addImageText}>Añadir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <Text style={styles.submitButtonText}>Enviando...</Text>
          ) : (
            <Text style={styles.submitButtonText}>Enviar solicitud</Text>
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
                value={'#C0392B'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 60,
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
  uploadAllButton: {
    backgroundColor: '#10B981',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  uploadAllButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
    opacity: 0.6,
  },
});

export default ProductUploadScreen;