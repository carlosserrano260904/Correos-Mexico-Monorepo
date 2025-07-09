import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

const myIp = "192.168.1.18";

type RootStackParamList = {
  MisPedidosScreen: { pedido: any };
};

export default function ListaPedidosScreen() {
  const [pedidos, setPedidos] = useState([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userId = 1
  
  
  ; // reemplaza por tu ID dinámico si lo tienes

  useEffect(() => {
    fetch(`http://${myIp}:3000/api/api/pedidos/user/${userId}`)
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(err => console.error("Error al cargar pedidos:", err));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MisPedidosScreen', { pedido: item })}
    >
      <Text style={styles.title}>Pedido #{item.id}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: ${item.total}</Text>
      <Text>Fecha: {new Date(item.fecha).toLocaleDateString('es-MX')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 12
  },
  title: { fontSize: 18, fontWeight: '600' }
});
