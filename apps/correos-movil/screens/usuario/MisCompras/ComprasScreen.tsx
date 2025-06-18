import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';


const purchases = [
  {
    id: '1',
    title: 'Audífonos Bluetooth',
    date: '10 de mayo, 2025',
    price: '$799',
    image: 'https://cdn-icons-png.flaticon.com/512/2740/2740650.png',
  },
  {
    id: '2',
    title: 'Smartwatch Rosa',
    date: '2 de mayo, 2025',
    price: '$1,299',
    image: 'https://cdn-icons-png.flaticon.com/512/846/846449.png',
  },
  {
    id: '3',
    title: 'Cámara Deportiva 4K',
    date: '22 de abril, 2025',
    price: '$1,999',
    image: 'https://cdn-icons-png.flaticon.com/512/882/882704.png',
  },
];

export default function ComprasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Compras</Text>
      <FlatList
        data={purchases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.details}>
              <Text style={styles.product}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F6FA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  product: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});
