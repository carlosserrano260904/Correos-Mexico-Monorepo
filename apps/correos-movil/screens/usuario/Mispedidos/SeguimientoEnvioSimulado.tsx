import React from 'react';
import { Platform, StyleSheet, Text, UIManager, View } from 'react-native';
import BarraProgresoEnvio from './BarraProgresoEnvio';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const estadosBase = [
  "Orden realizada",
  "Vendedor empaquetando tu pedido",
  "En camino",
  "Recibido"
];

const estadoMap: Record<string, string> = {
  pendiente: "Orden realizada",
  empaquetado: "Vendedor empaquetando tu pedido",
  enviado: "En camino",
  completado: "Recibido",
};

type Props = {
  status: string;
};

export default function SeguimientoEnvioSimulado({ status }: Props) {
  const estadoVisual = estadoMap[status] || "Orden realizada";
  const indexActual = estadosBase.indexOf(estadoVisual);

  const pasos = estadosBase.map((titulo, idx) => ({
    titulo,
    completado: idx <= indexActual,
    fecha:
      idx <= indexActual
        ? new Date().toLocaleString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seguimiento de tu envío</Text>
      <BarraProgresoEnvio pasos={pasos} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginTop: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
});
