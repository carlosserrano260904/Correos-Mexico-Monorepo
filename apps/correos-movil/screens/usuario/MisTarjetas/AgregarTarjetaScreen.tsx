import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AgregarTarjetaScreen() {
  const router = useRouter();

  const [numero, setNumero] = useState('');
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [cvv, setCvv] = useState('');

  const handleAddCard = () => {
    // Aquí puedes manejar el guardado/envío de datos
    console.log({ numero, nombre, fecha, cvv });
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Agregar Tarjetas</Text>
      </View>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Añadir Tarjeta</Text>

      {/* Campos de entrada */}
      <TextInput
        placeholder="Número de tarjeta"
        value={numero}
        onChangeText={setNumero}
        style={styles.input}
        keyboardType="number-pad"
      />
      <TextInput
        placeholder="Nombre en la tarjeta"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de caducidad"
        value={fecha}
        onChangeText={setFecha}
        style={styles.input}
      />
      <TextInput
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        style={styles.input}
        keyboardType="numeric"
        secureTextEntry
      />

      {/* Botón añadir */}
      <TouchableOpacity style={styles.button} onPress={handleAddCard}>
        <Text style={styles.buttonText}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#e91e63',
    padding: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'flex-end',
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
