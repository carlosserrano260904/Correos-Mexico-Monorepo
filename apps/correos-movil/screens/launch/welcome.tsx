// welcome.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [animationKey, setAnimationKey] = useState(0);

  // Reinicia la animación cada vez que se enfoca la pantalla
  useFocusEffect(
    useCallback(() => {
      setAnimationKey(prev => prev + 1);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Animated.Image
        key={animationKey}
        entering={FadeInDown.duration(1000)}
        source={require('../../assets/logo3.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.welcome}>Bienvenido a</Text>
      <Text style={styles.brand}>CorreosClic</Text>
      <Text style={styles.description}>
        De los talleres de México, a cada rincón del país.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>¡Empecemos!</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        ¿Ya tienes una cuenta?
        <Text style={styles.link} onPress={() => navigation.navigate('SignIn')}> Ingresa aquí</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  logo: {
    width: 325,
    height: 310,
    resizeMode: 'contain',
    position: 'absolute',
    top: 180,
    left: 0,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d20a7c',
    marginBottom: 1,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#d20a7c',
    paddingVertical: 12,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginBottom: 100,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 30,
  },
  link: {
    color: '#d20a7c',
    fontWeight: '500',
  },
});
