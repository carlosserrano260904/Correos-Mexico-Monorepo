import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  // Ya no se necesitan TextInputs
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native'; // <--- 1. IMPORTAR

const CheckoutButton = ({ amount, email, profileId, onPaymentSuccess, onPaymentError }) => {
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;
  const navigation = useNavigation<any>(); // <--- 2. OBTENER NAVEGACIÓN

  // Estados principales
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  
  // Estados para modales
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Se elimina el estado de showCardModal

  // Estados para tarjetas guardadas
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingCards, setLoadingCards] = useState(false);

  // Obtener tarjetas del usuario
  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const res = await fetch(`http://${IP}:3000/api/pagos/mis-tarjetas/${profileId}`);
      if (!res.ok && res.status === 404) {
        setCards([]); // Si da 404 (sin tarjetas), es un array vacío
        return;
      }
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error al obtener tarjetas:", error);
      setCards([]); // En caso de error, array vacío
    } finally {
      setLoadingCards(false);
    }
  };

  // Efecto para cargar tarjetas cuando se abre el modal
  useEffect(() => {
    // Usamos `showPaymentModal` como disparador.
    // Cuando el usuario navegue de vuelta de "AgregarTarjetaScreen",
    // tendrá que presionar "Pagar" de nuevo, lo que pondrá
    // showPaymentModal a true y disparará este fetch actualizado.
    if (profileId && showPaymentModal) {
      fetchCards();
    }
  }, [profileId, showPaymentModal]);


  // --- SE ELIMINARON LAS SIGUIENTES FUNCIONES ---
  // formatCardNumber, formatExpiryDate, getTestPaymentMethod,
  // validateCardData, createPaymentMethod, handlePayment, handleAddCardOnly
  // porque eran parte del formulario roto.


  // Crear cliente Stripe (Sigue siendo necesario para pagar)
  const createStripeCustomer = async () => {
    try {
      const res = await fetch(`http://${IP}:3000/api/pagos/crear-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setCustomerId(data.id);
      return data.id;
    } catch (err) {
      console.error("Error creando cliente:", err);
      throw err;
    }
  };

  // Procesar pago (Sigue siendo necesario)
  const processPayment = async (customerId, paymentMethodId) => {
    try {
      const res = await fetch(`http://${IP}:3000/api/pagos/realizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          customerId,
          paymentMethodId
        })
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error procesando pago:", error);
      throw error;
    }
  };

  // Procesar pago con tarjeta guardada
  const handlePaymentWithSavedCard = async () => {
    if (!selectedCard) {
      Alert.alert('Error', 'Selecciona una tarjeta para continuar');
      return;
    }

    setLoading(true);
    try {
      let custId = customerId;
      if (!custId) {
        // Busca el customerId del perfil si no lo tenemos en el estado
        // (Asumiendo que el profileId es el mismo que el userId de AsyncStorage)
        // Esta lógica puede necesitar ajuste basado en tu app
        const userProfileRes = await fetch(`http://${IP}:3000/api/profile/${profileId}`);
        const userProfile = await userProfileRes.json();
        custId = userProfile.stripeCustomerId;
        if (!custId) {
          // Si AÚN no existe, lo creamos
          custId = await createStripeCustomer();
        }
        setCustomerId(custId);
      }

      const result = await processPayment(custId, selectedCard.stripeCardId); // <--- Usar stripeCardId
      
      setShowPaymentModal(false);
      setSelectedCard(null);
      Alert.alert('Éxito', `Pago de $${amount} MXN exitoso.`);
      onPaymentSuccess?.(result);
    } catch (err) {
      Alert.alert('Error', 'No se pudo procesar el pago.');
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCard(null);
  };

  // Renderizar tarjeta guardada
  const renderSavedCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.cardItem,
        selectedCard?.id === item.id && styles.selectedCard
      ]}
      onPress={() => setSelectedCard(item)}
    >
      <View style={styles.cardInfo}>
        <Ionicons name="card" size={24} color="#DE1484" />
        <View style={styles.cardDetails}>
          <Text style={styles.cardBrand}>{item.brand?.toUpperCase() || 'CARD'}</Text>
          {/* Aseguramos que `item.last4` exista */}
          <Text style={styles.cardNumber}>•••• •••• •••• {item.last4 || '????'}</Text>
        </View>
      </View>
      {selectedCard?.id === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#DE1484" />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Botón principal de pago */}
      <TouchableOpacity
        style={[styles.payButton, !amount && styles.disabledButton]}
        onPress={() => setShowPaymentModal(true)}
        disabled={!amount} // No deshabilitar por 'loading' aquí
      >
        <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.payButtonText}>Pagar ${amount} MXN</Text>
      </TouchableOpacity>

      {/* Modal principal de selección de pago */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Método de Pago</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleClosePaymentModal}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentContent}>
              <Text style={styles.amountText}>Total: ${amount} MXN</Text>
              
              <View style={styles.cardsSection}>
                <Text style={styles.sectionTitle}>Mis tarjetas</Text>
                
                {loadingCards ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#DE1484" />
                    <Text>Cargando tarjetas...</Text>
                  </View>
                ) : cards.length > 0 ? (
                  <FlatList
                    data={cards}
                    // `item.id` podría no ser único si hay error, usamos stripeCardId
                    keyExtractor={(item) => (item.stripeCardId || item.id).toString()}
                    renderItem={renderSavedCard}
                    style={styles.cardsList}
                  />
                ) : (
                  <Text style={styles.noCardsText}>No tienes tarjetas guardadas</Text>
                )}
                
                {/* --- 3. BOTÓN CORREGIDO --- */}
                <TouchableOpacity
                  style={styles.addCardButton}
                  onPress={() => {
                    // 1. Cierra este modal
                    setShowPaymentModal(false);
                    // 2. Navega a la pantalla que SÍ funciona
                    navigation.navigate('AgregarTarjetaScreen'); 
                  }}
                >
                  <Ionicons name="add" size={20} color="#DE1484" />
                  <Text style={styles.addCardText}>Agregar nueva tarjeta</Text>
                </TouchableOpacity>
              </View>
              
              {selectedCard && (
                <TouchableOpacity
                  style={[
                    styles.processButton,
                    loading && styles.disabledButton
                  ]}
                  onPress={handlePaymentWithSavedCard}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.processButtonText}>Pagar con Tarjeta Seleccionada</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* --- SE ELIMINÓ EL MODAL "showCardModal" --- */}
      {/* Ya no es necesario porque usamos la pantalla real */}

    </View>
  );
};

// --- Estilos (sin cambios) ---
const styles = StyleSheet.create({
  payButton: {
    backgroundColor: '#DE1484',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonIcon: {
    marginRight: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 5,
  },
  paymentContent: {
    padding: 20,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DE1484',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  cardsList: {
    maxHeight: 200,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedCard: {
    borderColor: '#DE1484',
    backgroundColor: '#f8f9ff',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetails: {
    marginLeft: 12,
  },
  cardBrand: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 16,
    color: '#000',
  },
  noCardsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#DE1484',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 10,
  },
  addCardText: {
    color: '#DE1484',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  processButton: {
    backgroundColor: '#DE1484',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutButton;