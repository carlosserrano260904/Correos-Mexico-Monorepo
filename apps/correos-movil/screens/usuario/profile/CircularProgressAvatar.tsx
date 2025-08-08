// CircularProgressAvatar.tsx
import React, { useMemo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

const RADIUS = 67; // Radio del círculo
const STROKE_WIDTH = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  userData: any;
  imageUri: string;
  size?: number;
};

export default function CircularProgressAvatar({ userData, imageUri, size = 140 }: Props) {
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

  const completados = campos.reduce((acc, campo) => acc + (campo?.trim() ? 1 : 0), 0);
  const porcentaje = Math.round((completados / campos.length) * 100);
  const progress = CIRCUMFERENCE - (porcentaje / 100) * CIRCUMFERENCE;

  return (
      <View style={styles.wrapper}>
          <View style={styles.svgWrapper}>
              <Svg width={size} height={size}>
                  <Circle
                      stroke="#E0E0E0"
                      fill="none"
                      cx={size / 2}
                      cy={size / 2}
                      r={RADIUS}
                      strokeWidth={STROKE_WIDTH}
                  />
                  <Circle
                      stroke="#E6007E"
                      fill="none"
                      cx={size / 2}
                      cy={size / 2}
                      r={RADIUS}
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={progress}
                      strokeLinecap="round"
                      strokeWidth={STROKE_WIDTH}
                      transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
              </Svg>
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
          <Text style={styles.percentageText}>{porcentaje}%</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  svgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    position: 'absolute',
  },
  percentageText: {
    marginTop: 7,
    color: '#E6007E',
    fontWeight: 'bold',
  },
});

