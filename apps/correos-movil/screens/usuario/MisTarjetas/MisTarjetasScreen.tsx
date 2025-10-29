// screens/MistarjetasScreen.tsx (Refactorizado y Corregido con Modal)
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
  TouchableOpacity, // <-- AÑADIDO
  KeyboardAvoidingView, // <-- AÑADIDO
  ScrollView, // <-- AÑADIDO
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
  Input, // <-- AÑADIDO
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

export default function MistarjetasScreen() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NUEVOS ESTADOS PARA EL MODAL DE EDICIÓN ---
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<Tarjeta | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [editName, setEditName] = useState('');
  const [editExpiry, setEditExpiry] = useState('');
  // ---

  const navigation = useNavigation<MisTarjetasNavProp>();

  // --- LÓGICA DE ELIMINAR (Sin cambios) ---
  const eliminarTarjeta = async (tarjetaId: string) => {
    setIsDeleting(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
      if (!API_URL) throw new Error('La URL de la API no está configurada.');
      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;

      const res = await axios.delete(`${API_URL}/api/cards`, {
        data: { paymentMethodId: tarjetaId, profileId },
      });
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

  // --- FETCHTARJETAS (Lógica de anidación corregida) ---
  const fetchTarjetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID del usuario.');
      if (!API_URL)
        throw new Error(
          'La URL de la API no está configurada. Revisa tus variables de entorno.',
        );

      const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
      const profileId = profileRes.data?.id;
      if (!profileId) throw new Error('No se pudo obtener el perfil de usuario.');

      const response = await axios.get(
        `${API_URL}/api/pagos/mis-tarjetas/${profileId}`,
      );
      if (response.status !== 200)
        throw new Error('Error del servidor al cargar tarjetas.');

      const data = response.data;

      // --- CORRECCIÓN AQUÍ ---
      // Leemos todos los campos del nivel superior (plano)
      const tarjetasFormateadas: Tarjeta[] = data.map((t: any) => ({
        id: t.id,
        tipo: t.brand, // <-- Corregido
        ultimos: t.last4, // <-- Corregido
        marca: t.marca || 'Stripe',
        nombre: t.name, // <-- Corregido (asumiendo que tu API lo devuelve como 'name')
        exp_month: t.exp_month, // <-- Corregido
        exp_year: t.exp_year, // <-- Corregido
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
    }, []),
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

  // --- NUEVA LÓGICA PARA EL MODAL DE EDICIÓN ---
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
    // Asume que el año de 2 dígitos es del siglo 2000
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
        exp_year: fullExpYear, // Enviamos el año completo
      });

      // Actualizar el estado localmente para reflejar el cambio
      setTarjetas((prevTarjetas) =>
        prevTarjetas.map((t) =>
          t.id === tarjetaSeleccionada.id
            ? {
                ...t,
                nombre: editName,
                exp_month: expMonth,
                // Guardamos el año completo también en el estado local
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
  // --- FIN LÓGICA MODAL EDICIÓN ---

  // --- RENDER TARJETA (con TouchableOpacity) ---
  const renderTarjeta = ({ item, index }: { item: Tarjeta; index: number }) => {
    const color = cardColors[index % cardColors.length];
    const expMonth = String(item.exp_month).padStart(2, '0');
    // Aseguramos que el año (ej: 2030) se convierta en 2 dígitos (ej: 30)
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
        <Button type="outline" onPress={fetchTarjetas}>
          Reintentar
        </Button>
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

      {/* --- NUEVO MODAL DE EDICIÓN --- */}
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
      {/* --- FIN MODAL EDICIÓN --- */}

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

// --- Estilos Refactorizados (con estilos de Modal) ---
const styles = StyleSheet.create({
  // Estilos de Modal (sin cambios)
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
  // Contenedor principal
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

  // --- NUEVOS ESTILOS PARA EL MODAL DE EDICIÓN ---
  modalEditContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Sube el modal desde abajo
    backgroundColor: 'rgba(0,0,0,0.4)', // Fondo oscuro translúcido
  },
  modalEditContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%', // Altura máxima
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalForm: {
    gap: 16, // Espacio entre inputs
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

