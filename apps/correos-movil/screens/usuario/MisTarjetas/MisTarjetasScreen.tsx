// screens/MistarjetasScreen.tsx (Con persistencia en AsyncStorage)
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../schemas/schemas';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Imports de tus componentes UI ---
import {
  Button,
  IconButton,
  Text,
  Card,
  CardContent,
  Input,
} from '../../../components/ui';
import { COLORS, SIZES } from '../../../utils/theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type MisTarjetasNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'MisTarjetasScreen'
>;

// --- INTERFAZ ACTUALIZADA ---
export interface Tarjeta {
  id: string;
  tipo: string;
  ultimos: string;
  marca: string;
  nombre: string;
  exp_month: number;
  exp_year: number;
}

const cardColors = ['#6D7BFF', '#DE1484', '#6ADA7F'];

// Clave para guardar en AsyncStorage
const TARJETAS_ELIMINADAS_KEY = 'tarjetas_eliminadas';

export default function MistarjetasScreen() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // --- NUEVO ESTADO: Tarjetas eliminadas persistentes ---
  const [tarjetasEliminadas, setTarjetasEliminadas] = useState<Set<string>>(new Set());

  // --- NUEVOS ESTADOS PARA EL MODAL DE EDICIÓN ---
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<Tarjeta | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState('');
  const [editExpiry, setEditExpiry] = useState('');

  const navigation = useNavigation<MisTarjetasNavProp>();

  // --- CARGAR TARJETAS ELIMINADAS DESDE ASYNCSTORAGE ---
  const cargarTarjetasEliminadas = async (): Promise<Set<string>> => {
    try {
      const eliminadasJSON = await AsyncStorage.getItem(TARJETAS_ELIMINADAS_KEY);
      if (eliminadasJSON) {
        const eliminadasArray: string[] = JSON.parse(eliminadasJSON);
        return new Set(eliminadasArray);
      }
    } catch (error) {
      console.error('Error cargando tarjetas eliminadas:', error);
    }
    return new Set();
  };

  // --- GUARDAR TARJETAS ELIMINADAS EN ASYNCSTORAGE ---
  const guardarTarjetasEliminadas = async (eliminadas: Set<string>) => {
    try {
      const eliminadasArray = Array.from(eliminadas);
      await AsyncStorage.setItem(TARJETAS_ELIMINADAS_KEY, JSON.stringify(eliminadasArray));
    } catch (error) {
      console.error('Error guardando tarjetas eliminadas:', error);
    }
  };

  // --- LÓGICA DE ELIMINAR (CON PERSISTENCIA) ---
  const eliminarTarjeta = async (tarjetaId: string) => {
    setIsDeleting(true);
    
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
      if (!API_URL) throw new Error('La URL de la API no está configurada.');
      
      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;

      // Intentar eliminar en el backend (pero no es crítico si falla)
      try {
        await axios.delete(`${API_URL}/api/cards`, {
          data: { paymentMethodId: tarjetaId, profileId },
          timeout: 5000
        });
      } catch (backendError) {
        console.log('Backend elimination failed, continuing with frontend deletion...');
      }

      // ELIMINACIÓN FRONTEND PERSISTENTE
      const nuevasEliminadas = new Set(tarjetasEliminadas);
      nuevasEliminadas.add(tarjetaId);
      
      // Guardar en AsyncStorage
      await guardarTarjetasEliminadas(nuevasEliminadas);
      
      // Actualizar estado
      setTarjetasEliminadas(nuevasEliminadas);
      setTarjetas((prev) => prev.filter((t) => t.id !== tarjetaId));
      
      Alert.alert('Éxito', 'Tarjeta eliminada correctamente.');
    } catch (err: any) {
      console.error('Error en eliminación:', err);
      Alert.alert('Error', 'No se pudo eliminar la tarjeta.');
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FETCHTARJETAS (Filtra las tarjetas eliminadas persistentes) ---
  const fetchTarjetas = async (showLoading: boolean = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Cargar tarjetas eliminadas primero
      const eliminadasPersistentes = await cargarTarjetasEliminadas();
      setTarjetasEliminadas(eliminadasPersistentes);

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
      if (!API_URL) throw new Error('La URL de la API no está configurada.');

      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;
      if (!profileId) throw new Error('No se pudo obtener el perfil de usuario.');

      const response = await axios.get(
        `${API_URL}/api/pagos/mis-tarjetas/${profileId}`,
        { timeout: 10000 }
      );
      
      if (response.status !== 200) {
        throw new Error('Error del servidor al cargar tarjetas.');
      }

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Formato de respuesta inválido.');
      }

      const tarjetasFormateadas: Tarjeta[] = data.map((t: any) => ({
        id: t.id,
        tipo: t.brand,
        ultimos: t.last4,
        marca: t.marca || 'Stripe',
        nombre: t.name,
        exp_month: t.exp_month,
        exp_year: t.exp_year,
      }));

      // FILTRAR: Remover las tarjetas que ya fueron eliminadas persistentemente
      const tarjetasFiltradas = tarjetasFormateadas.filter(
        tarjeta => !eliminadasPersistentes.has(tarjeta.id)
      );
      
      setTarjetas(tarjetasFiltradas);
    } catch (err: any) {
      console.error('Error al cargar tarjetas:', err);
      
      if (err.code === 'ECONNABORTED' || err.message.includes('network')) {
        setError('Error de conexión. Verifica tu internet.');
      } else {
        setError(err.message || 'No se pudieron cargar las tarjetas.');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // --- Función para LIMPIAR todas las tarjetas eliminadas (por si necesitas resetear) ---
  const limpiarTarjetasEliminadas = async () => {
    try {
      await AsyncStorage.removeItem(TARJETAS_ELIMINADAS_KEY);
      setTarjetasEliminadas(new Set());
      Alert.alert('Éxito', 'Lista de eliminadas limpiada.');
    } catch (error) {
      console.error('Error limpiando tarjetas eliminadas:', error);
    }
  };

  // --- Función para pull-to-refresh ---
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchTarjetas(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchTarjetas();
    }, [])
  );

  const handleAddCard = () => navigation.navigate('AgregarTarjetaScreen');

  const confirmarEliminacion = (tarjetaId: string) => {
    Alert.alert(
      '¿Eliminar tarjeta?',
      '¿Seguro que quieres eliminar esta tarjeta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarTarjeta(tarjetaId),
        },
      ],
    );
  };

  // --- LÓGICA PARA EL MODAL DE EDICIÓN ---
  const handleExpiryChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 2) {
      const formatted = `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
      setEditExpiry(formatted);
    } else {
      setEditExpiry(cleaned);
    }
  };

  const openEditModal = (tarjeta: Tarjeta) => {
    setTarjetaSeleccionada(tarjeta);
    setEditName(tarjeta.nombre || '');

    const expMonth = String(tarjeta.exp_month).padStart(2, '0');
    const expYear = String(tarjeta.exp_year % 100).padStart(2, '0');
    const expiracion = tarjeta.exp_month ? `${expMonth}/${expYear}` : '';
    setEditExpiry(expiracion);

    setIsEditModalVisible(true);
  };

  const handleUpdateCard = async () => {
    if (!tarjetaSeleccionada) return;

    const expiryParts = editExpiry.split('/');
    if (expiryParts.length !== 2) {
      Alert.alert('Error', 'La fecha debe ser MM/AA.');
      return;
    }
    const expMonth = parseInt(expiryParts[0], 10);
    const expYear = parseInt(expiryParts[1], 10);
    const fullExpYear = expYear < 2000 ? 2000 + expYear : expYear;

    if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
      Alert.alert('Error', 'Fecha de vencimiento inválida.');
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/api/cards/${tarjetaSeleccionada.id}`, {
        nombre: editName,
        exp_month: expMonth,
        exp_year: fullExpYear,
      });

      // Actualizar el estado localmente para reflejar el cambio
      setTarjetas((prevTarjetas) =>
        prevTarjetas.map((t) =>
          t.id === tarjetaSeleccionada.id
            ? {
                ...t,
                nombre: editName,
                exp_month: expMonth,
                exp_year: fullExpYear,
              }
            : t,
        ),
      );

      setIsUpdating(false);
      setIsEditModalVisible(false);
      setTarjetaSeleccionada(null);
      Alert.alert('Éxito', 'Tarjeta actualizada.');
    } catch (err: any) {
      setIsUpdating(false);
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'No se pudo actualizar.',
      );
    }
  };

  // --- RENDER TARJETA ---
  const renderTarjeta = ({ item, index }: { item: Tarjeta; index: number }) => {
    const color = cardColors[index % cardColors.length];
    const expMonth = String(item.exp_month).padStart(2, '0');
    const expYear = String(item.exp_year % 100).padStart(2, '0');
    const expiracion = item.exp_month ? `${expMonth}/${expYear}` : 'MM/AA';

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => openEditModal(item)}>
        <Card style={[styles.card, { backgroundColor: color }]}>
          <IconButton
            style={styles.deleteButton}
            onPress={() => confirmarEliminacion(item.id)}
            size="small"
            round={true}
          >
            <Icon name="trash-outline" size={18} color="#FFFFFF" />
          </IconButton>

          <CardContent style={styles.cardContent}>
            <Text style={styles.cardTextSmall}>
              {item.nombre || 'Nombre y Apellido'}
            </Text>
            <Text style={styles.cardTextLarge}>
              •••• •••• •••• {item.ultimos}
            </Text>
            <View style={styles.expiryRow}>
              <Text style={styles.cardTextSmall}>Expiración</Text>
              <Text style={styles.cardTextSmall}>{expiracion}</Text>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.brand} />
        <Text color="muted" style={{ marginTop: 16 }}>
          Cargando tarjetas...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text color="muted" align="center" style={{ marginBottom: 16 }}>
          {error}
        </Text>
        <Button type="outline" onPress={() => fetchTarjetas()}>
          Reintentar
        </Button>
        {/* Botón para limpiar eliminadas (solo desarrollo) */}
        {__DEV__ && (
          <Button 
            type="outline" 
            onPress={limpiarTarjetasEliminadas}
            style={{ marginTop: 10 }}
          >
            Limpiar Eliminadas (Debug)
          </Button>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- Modal de Eliminación --- */}
      <Modal visible={isDeleting} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={COLORS.brand} />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#555' }}>
              Eliminando tarjeta...
            </Text>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE EDICIÓN --- */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalEditContainer}
        >
          <View style={styles.modalEditContent}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text size="large" fontWeight="bold" color="title">
                  Editar Tarjeta
                </Text>
                <IconButton
                  type="secondary"
                  size="small"
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Icon name="close" size={24} color={COLORS.foregroundTitle} />
                </IconButton>
              </View>

              <View style={styles.modalForm}>
                <Text color="title" fontWeight="500" style={styles.modalLabel}>
                  Número de tarjeta
                </Text>
                <Input
                  value={`•••• •••• •••• ${tarjetaSeleccionada?.ultimos}`}
                  editable={false}
                  style={styles.modalInputDisabled}
                />

                <Text color="title" fontWeight="500" style={styles.modalLabel}>
                  Nombre en la tarjeta
                </Text>
                <Input
                  placeholder="Nombre y apellidos"
                  value={editName}
                  onChangeText={setEditName}
                  autoCapitalize="words"
                />

                <Text color="title" fontWeight="500" style={styles.modalLabel}>
                  Vence
                </Text>
                <Input
                  placeholder="MM/AA"
                  keyboardType="number-pad"
                  value={editExpiry}
                  onChangeText={handleExpiryChange}
                  maxLength={5}
                />
              </View>

              <Button
                size="default"
                onPress={handleUpdateCard}
                disabled={isUpdating}
                style={styles.modalSaveButton}
              >
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- Header --- */}
      <View style={styles.header}>
        <IconButton
          type="secondary"
          size="small"
          onPress={() => navigation.popToTop()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.foregroundTitle} />
        </IconButton>
        <Text
          color="title"
          size="large"
          fontWeight="bold"
          style={styles.headerTitle}
        >
          Mis Tarjetas
        </Text>
      </View>

      {/* --- Lista de Tarjetas --- */}
      <FlatList
        data={tarjetas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarjeta}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text color="muted" size="large" align="center">
              Aún no tienes tarjetas.
            </Text>
          </View>
        }
      />

      {/* --- Botón "Añadir" --- */}
      <Button
        type="secondary"
        size="default"
        style={styles.addCardButton}
        onPress={handleAddCard}
      >
        <View style={styles.buttonInner}>
          <Icon
            name="add-circle-outline"
            size={22}
            color={COLORS.foreground}
          />
          <Text color="default" fontWeight="500" style={{ marginLeft: 8 }}>
            Añadir tarjeta
          </Text>
        </View>
      </Button>
    </View>
  );
}

// Los estilos se mantienen igual...
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
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    marginLeft: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    marginTop: 0,
    padding: 8,
  },
  cardTextSmall: {
    color: '#FFFFFF',
    fontSize: SIZES.fontSize.small,
    opacity: 0.9,
  },
  cardTextLarge: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1,
    marginVertical: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  expiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  addCardButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    right: 20,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEditContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalEditContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalForm: {
    gap: 16,
  },
  modalLabel: {
    marginBottom: 6,
    marginLeft: 2,
  },
  modalInputDisabled: {
    backgroundColor: COLORS.surface,
    color: COLORS.foregroundMuted,
  },
  modalSaveButton: {
    marginTop: 32,
    marginBottom: 20,
  },
});