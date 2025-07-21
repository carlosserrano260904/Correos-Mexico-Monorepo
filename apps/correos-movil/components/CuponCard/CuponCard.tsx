import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export type CuponProps = {
  titulo: string;
  descripcion: string;
  porcentaje: number;
  compraMinima: number;
  vence: string;
  categoria: string;
};

const colores = {
  Tecnología: '#AEDFE6',
  Belleza: '#F6C1D4',
  'Hecho en México': '#FFF4A3',
  Todos: '#D6C3E5',
};

const CuponCard = ({ titulo, descripcion, porcentaje, compraMinima, vence, categoria }: CuponProps) => {
  const colorFondo = colores[categoria as keyof typeof colores] || '#ECEFF1';

  const handleApply = () => {
    Alert.alert('Cupón aplicado', `Has aplicado el cupón: ${titulo}`);
  };

  const fechaConAnio = `${vence} de 2025`;

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        <View style={[styles.header, { backgroundColor: colorFondo }]}>
          <Text style={styles.headerText}>{`${titulo} - ${porcentaje}% OFF`}</Text>
        </View>

        <View style={styles.circleLeft} />
        <View style={styles.circleRight} />

        <View style={styles.content}>
          <Text style={styles.descripcion}>{descripcion}</Text>
          <Text style={styles.detalle}>Compra mínima: ${compraMinima}</Text>
          <Text style={styles.vencimiento}>Vence: {fechaConAnio}</Text>
          <View style={styles.divisor} />
          <TouchableOpacity style={styles.boton} onPress={handleApply}>
            <Text style={styles.botonTexto}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  cardContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
  },
  header: {
    padding: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  descripcion: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  },
  detalle: {
    fontSize: 13,
    color: '#424242',
  },
  vencimiento: {
    fontSize: 12,
    color: '#616161',
    fontStyle: 'italic',
    marginTop: 4,
  },
  divisor: {
    height: 1,
    backgroundColor: '#BDBDBD',
    marginVertical: 10,
  },
  boton: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#EC008C',
  },
  botonTexto: {
    color: '#EC008C',
    fontWeight: 'bold',
  },
  circleLeft: {
    position: 'absolute',
    top: '50%',
    left: -14,
    width: 28,
    height: 28,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    zIndex: 10,
  },
  circleRight: {
    position: 'absolute',
    top: '50%',
    right: -14,
    width: 28,
    height: 28,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    zIndex: 10,
  },
});

export default CuponCard;
