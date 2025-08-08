// CircularProgressAvatar.tsx
import React, { useMemo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

// Definición de constantes para el círculo de progreso
const RADIUS = 67; // Radio del círculo de fondo y progreso
const STROKE_WIDTH = 5; // Grosor del trazo del círculo
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Longitud total del perímetro del círculo

type Props = {
  userData: any;      // Datos del usuario con campos para calcular completitud
  imageUri: string;   // URI de la imagen de avatar
  size?: number;      // Tamaño del SVG y el avatar (opcional, por defecto 140)
};

export default function CircularProgressAvatar({ userData, imageUri, size = 140 }: Props) {
  // Agrupamos los campos relevantes del perfil para calcular cuántos están completados
  const campos = useMemo(() => [
    userData.nombre,
    userData.apellido,
    userData.imagen,
    userData.numero,
    userData.codigoPostal,
    userData.calle,
    userData.fraccionamiento,
    userData.ciudad,
    userData.estado,
  ], [userData]);

  // Contamos cuántos campos no están vacíos o solo contienen espacios
  const completados = campos.reduce((acc, campo) => acc + (campo?.trim() ? 1 : 0), 0);
  // Calculamos el porcentaje de campos completados
  const porcentaje = Math.round((completados / campos.length) * 100);
  // Convertimos el porcentaje en desplazamiento para strokeDashoffset
  const progress = CIRCUMFERENCE - (porcentaje / 100) * CIRCUMFERENCE;

  return (
      <View style={styles.wrapper}>
          <View style={styles.svgWrapper}>
              {/* Círculo de fondo en gris */}
              <Svg width={size} height={size}>
                  <Circle
                      stroke="#E0E0E0" // Color de fondo
                      fill="none"
                      cx={size / 2}     // Centro X
                      cy={size / 2}     // Centro Y
                      r={RADIUS}        // Radio
                      strokeWidth={STROKE_WIDTH}
                  />
                  {/* Círculo de progreso en rosa, rotado -90° para que comience arriba */}
                  <Circle
                      stroke="#E6007E" // Color del progreso
                      fill="none"
                      cx={size / 2}
                      cy={size / 2}
                      r={RADIUS}
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={progress} // Desplazamiento según porcentaje
                      strokeLinecap="round"      // Bordes redondeados
                      strokeWidth={STROKE_WIDTH}
                      transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
              </Svg>
              {/* Avatar centrado sobre el SVG */}
              <Image
                  source={{ uri: imageUri }}
                  style={[
                      styles.image,
                      {
                          width: size - STROKE_WIDTH * 2,
                          height: size - STROKE_WIDTH * 2,
                          borderRadius: (size - STROKE_WIDTH * 2) / 2,
                      },
                  ]}
              />
          </View>
          {/* Texto que muestra el porcentaje */}
          <Text style={styles.percentageText}>{porcentaje}%</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',       // Centrar contenido horizontal
    justifyContent: 'center',   // Centrar contenido vertical
    marginBottom: 16,           // Margen inferior
  },
  svgWrapper: {
    justifyContent: 'center',   // Centrar SVG
    alignItems: 'center',
    position: 'relative',       // Para posicionar el Image absolut
  },
  image: {
    position: 'absolute',       // Avatar encima del SVG
  },
  percentageText: {
    marginTop: 7,               // Separación respecto al SVG
    color: '#E6007E',           // Color del texto
    fontWeight: 'bold',         // Negrita
  },
});
