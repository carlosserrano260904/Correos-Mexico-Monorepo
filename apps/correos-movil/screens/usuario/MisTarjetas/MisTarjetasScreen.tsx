
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';


const tarjetas = [
  { id: '1', tipo: 'Mastercard', ultimos: '2398', marca: 'nu' },
  { id: '2', tipo: 'Visa', ultimos: '4581', marca: 'spin' },
];
type MisTarjetasNavProp = NativeStackNavigationProp<RootStackParamList, 'MisTarjetasScreen'>;

const showTarjetas = () => {}

export default function MistarjetasScreen() {
  const navigation = useNavigation<MisTarjetasNavProp>();


  const handleAddCard = () => navigation.navigate('AgregarTarjetaScreen');

  const showTarjetas = () => {
  }



  const renderTarjeta = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTipo}>{item.tipo}</Text>
        <Text style={styles.cardUltimos}>*** {item.ultimos}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardMarca}>{item.marca}</Text>
        <TouchableOpacity>
          <Text style={styles.quitar}>Quitar</Text>
          
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Tarjetas</Text>
      </View>

      {/* Lista de tarjetas */}
      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarjeta}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Botón añadir tarjeta */}
      <TouchableOpacity style={styles.addCard} onPress={handleAddCard}>

        <Icon name="add-circle-outline" size={24} color="#555" />
        <Text style={{ marginLeft: 8, color: '#555' }}>Añadir tarjeta</Text>
      </TouchableOpacity>
      


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  card: {
    backgroundColor: '#e6d4f7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTipo: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardUltimos: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMarca: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b28ae6',
  },
  quitar: {
    color: 'red',
    backgroundColor: '#fdd',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: '500',
  },
  addCard: {
    backgroundColor: '#eee',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 80,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
});
