import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  background: '#F5F5F5',
};

const PagoExitosoScreen = () => {
  const navigation = useNavigation();

  const volverAlInicio = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Tabs' as never }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="checkmark-circle-outline" size={100} color={Colors.primary} />
      <Text style={styles.title}>¡Pago exitoso!</Text>
      <Text style={styles.subtitle}>Gracias por tu compra</Text>

      <TouchableOpacity style={styles.button} onPress={volverAlInicio}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PagoExitosoScreen;
