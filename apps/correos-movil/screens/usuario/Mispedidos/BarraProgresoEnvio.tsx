import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Paso {
  titulo: string;
  fecha: string;
  completado: boolean;
}

interface Props {
  pasos: Paso[];
}

export default function LineaProgresoVertical({ pasos }: Props) {
  return (
    <View style={styles.container}>
      {pasos.map((paso, index) => {
        const esUltimo = index === pasos.length - 1;
        return (
          <View key={index} style={styles.pasoContainer}>
            <View style={styles.colIzq}>
              <View style={[styles.circulo, paso.completado && styles.circuloActivo]}>
                {paso.completado && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              {!esUltimo && (
                <View
                  style={[
                    styles.lineaVertical,
                    pasos[index + 1].completado ? styles.lineaActiva : styles.lineaInactiva,
                  ]}
                />
              )}
            </View>
            <View style={styles.colDer}>
              <Text style={styles.titulo}>{paso.titulo}</Text>
              {paso.fecha ? <Text style={styles.fecha}>{paso.fecha}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const rosa = "#e91e63";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pasoContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  colIzq: {
    alignItems: 'center',
    marginRight: 12,
  },
  circulo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: rosa,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloActivo: {
    backgroundColor: rosa,
  },
  lineaVertical: {
    width: 2,
    flex: 1,
    marginTop: 2,
  },
  lineaActiva: {
    backgroundColor: rosa,
  },
  lineaInactiva: {
    backgroundColor: '#ddd',
  },
  colDer: {
    flex: 1,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fecha: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
});


