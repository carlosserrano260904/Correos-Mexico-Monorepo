import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../schemas/schemas';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type MisTarjetasNavProp = NativeStackNavigationProp<RootStackParamList, 'MisTarjetasScreen'>;

interface Tarjeta {
  id: t.stripe_payment_method_id;
  tipo: t.brand,
  ultimos: t.last4;
  marca: 'Stripe' | 'Banorte' | 'Santander' | 'HSBC' | 'BBVA';
}

export default function MistarjetasScreen() {
  const [isDeleting, setIsDeleting] = useState(false);
  const eliminarTarjeta = async (tarjetaId: string) => {
    setIsDeleting(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
      if (!API_URL) throw new Error('La URL de la API no está configurada.');
      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;
      // Elimina la tarjeta en el backend (de Stripe y BD)
      const res = await axios.delete(`${API_URL}/api/cards`, { data: { paymentMethodId: tarjetaId, profileId } });
      if (res.status === 200) {
        setTarjetas((prev) => prev.filter((t) => t.id !== tarjetaId));
        Alert.alert('Éxito', 'Tarjeta eliminada correctamente.');
      } else {
        throw new Error(res.data?.message || 'No se pudo eliminar la tarjeta.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo eliminar la tarjeta.');
    } finally {
      setIsDeleting(false);
    }
  };
  const navigation = useNavigation<MisTarjetasNavProp>();
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTarjetas = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }
      if (!API_URL) {
        throw new Error('La URL de la API no está configurada. Revisa tus variables de entorno.');
      }
      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;
      const response = await axios.get(`${API_URL}/api/pagos/mis-tarjetas/${profileId}`);
      if (response.status !== 200) {
        throw new Error(`La respuesta del servidor no fue exitosa. Status: ${response.status}. Cuerpo: ${JSON.stringify(response.data)}`);
      }
      const data = response.data;
      const tarjetasFormateadas: Tarjeta[] = data.map((t: any) => ({
        id: t.stripeCardId || t.id, // Usar el id de Stripe si existe
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

  useFocusEffect(
    React.useCallback(() => {
      fetchTarjetas();
    }, [])
  );

  // Si la pantalla de añadir tarjeta está duplicada en el stack, usa replace en vez de navigate
  const handleAddCard = () => navigation.replace('AgregarTarjetaScreen');

  const renderTarjeta = ({ item }: { item: Tarjeta }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTipo}>{item.tipo}</Text>
        <Text style={styles.cardUltimos}>*** {item.ultimos}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardMarca}>{item.marca}</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              '¿Eliminar tarjeta?',
              '¿Seguro que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => eliminarTarjeta(item.id) }
              ]
            );
          }}
        >
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
      <Modal visible={isDeleting} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#b28ae6" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#555' }}>Eliminando tarjeta...</Text>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.popToTop()}>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
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
