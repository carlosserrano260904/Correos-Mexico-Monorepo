import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const PINK = '#E6007A';

export default function Loader({ message = "Cargando..." }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={PINK} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  message: { marginTop: 12, fontSize: 14, color: '#555', textAlign: 'center' }
});
