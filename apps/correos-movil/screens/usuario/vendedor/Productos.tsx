import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { myIp } from '../../../api/miscompras';

const PINK = '#e91e63';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch(`http://${myIp}:3000/api/products`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={PINK} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imagen && (
        <Image source={{ uri: item.imagen }} style={styles.image} />
      )}
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
      <Text style={styles.precio}>${item.precio}</Text>
    </View>
  );

  return (
    <FlatList
      data={productos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  precio: {
    fontSize: 16,
    color: PINK,
    marginTop: 8,
  },
});
