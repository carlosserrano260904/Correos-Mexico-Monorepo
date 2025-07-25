import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type MisTarjetasNavProp = NativeStackNavigationProp<RootStackParamList, 'MisTarjetasScreen'>;

interface Tarjeta {
  id: string;
  tipo: string;
  ultimos: string;
  marca: string;
}

export default function MistarjetasScreen() {
  const navigation = useNavigation<MisTarjetasNavProp>();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          throw new Error('No se encontró el ID del usuario.');
        }
        if (!API_URL) {
          throw new Error('La URL de la API no está configurada. Revisa tus variables de entorno.');
        }
        const response = await axios.get(`${API_URL}/api/cards/user/${userId}`);
        if (response.status !== 200) {
          throw new Error(`La respuesta del servidor no fue exitosa. Status: ${response.status}. Cuerpo: ${JSON.stringify(response.data)}`);
        }
        const data = response.data;
        const tarjetasFormateadas: Tarjeta[] = data.map((t: any) => ({
          id: t.id,
          tipo: t.brand,
          ultimos: t.last4,
          marca: t.marca || 'Stripe',
        }));
        setTarjetas(tarjetasFormateadas);
      } catch (err: any) {
        console.error('Error al cargar tarjetas:', err);
        setError(err.message || 'No se pudieron cargar las tarjetas.');
      } finally {
        setLoading(false);
      }
    };
    fetchTarjetas();
  }, []);

  const handleAddCard = () => navigation.navigate('AgregarTarjetaScreen');

  const renderTarjeta = ({ item }: { item: Tarjeta }) => (
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Tarjetas</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando tarjetas...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Tarjetas</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 }}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Tarjetas</Text>
      </View>

      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarjeta}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>Aún no tienes tarjetas.</Text>
          </View>
        }
      />

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
