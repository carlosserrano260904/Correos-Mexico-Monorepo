import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const CheckoutButton = ({ amount, email, profileId, onPaymentSuccess, onPaymentError }) => {
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;

  // Estados principales (manteniendo la funcionalidad original)
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  
  // Estados para modales (usando el diseño mejorado)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Estados para nueva tarjeta (funcionalidad original)
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Estados para tarjetas guardadas (manteniendo funcionalidad original)
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loadingCards, setLoadingCards] = useState(false);

  // Obtener tarjetas del usuario (funcionalidad original)
  const fetchCards = async () => {
    setLoadingCards(true);
    try {
      const res = await fetch(`http://${IP}:3000/api/pagos/mis-tarjetas/${profileId}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("Error al obtener tarjetas:", error);
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    if (profileId && showPaymentModal) {
      fetchCards();
    }
  }, [profileId, showPaymentModal]);

  // Funciones de formateo (funcionalidad original)
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned.length >= 2 ? cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) : cleaned;
  };

  // Función para obtener método de pago de prueba (funcionalidad original)
  const getTestPaymentMethod = () => {
    const testCards = {
      '4242424242424242': 'pm_card_visa',
      '4000056655665556': 'pm_card_visa_debit',
      '5555555555554444': 'pm_card_mastercard',
      '2223003122003222': 'pm_card_mastercard',
      '4000002500003155': 'pm_card_visa_prepaid',
    };
    const clean = cardNumber.replace(/\s/g, '');
    return testCards[clean] || 'pm_card_visa';
  };

  // Validación de datos de tarjeta (funcionalidad original)
  const validateCardData = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Error', 'Número de tarjeta inválido');
      return false;
    }
    if (!expiryDate || expiryDate.length !== 5) {
      Alert.alert('Error', 'Fecha de expiración inválida');
      return false;
    }
    if (!cvc || cvc.length < 3) {
      Alert.alert('Error', 'CVC inválido');
      return false;
    }
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Nombre del titular requerido');
      return false;
    }
    return true;
  };

  // Crear cliente Stripe (funcionalidad original)
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

  // Crear método de pago (funcionalidad original)
  const createPaymentMethod = async () => {
    const testToken = getTestPaymentMethod();
    setPaymentMethodId(testToken);
    return testToken;
  };

  // Asociar tarjeta al cliente (funcionalidad original)
  const associateCardToCustomer = async (profileId, customerId, paymentMethodId) => {
    try {
      await fetch(`http://${IP}:3000/api/pagos/asociar-tarjeta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, paymentMethodId, profileId })
      });
    } catch (error) {
      console.error("Error asociando tarjeta:", error);
    }
  };

  // Procesar pago (funcionalidad original)
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

  // Manejar pago con nueva tarjeta (funcionalidad original)
  const handlePayment = async () => {
    if (!validateCardData()) return;

    setLoading(true);
    try {
      let custId = customerId;
      if (!custId) {
        custId = await createStripeCustomer();
      }

      const pmId = await createPaymentMethod();
      await associateCardToCustomer(profileId, custId, pmId);
      const result = await processPayment(custId, pmId);

      setShowCardModal(false);
      setShowPaymentModal(false);
      clearCardForm();
      fetchCards();
      Alert.alert('Éxito', `Pago de ${amount} MXN exitoso.`);
      onPaymentSuccess?.(result);
    } catch (err) {
      Alert.alert('Error', 'No se pudo procesar el pago.');
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para solo agregar tarjeta sin procesar pago
  const handleAddCardOnly = async () => {
    if (!validateCardData()) return;

    setLoading(true);
    try {
      let custId = customerId;
      if (!custId) {
        custId = await createStripeCustomer();
      }

      const pmId = await createPaymentMethod();
      await associateCardToCustomer(profileId, custId, pmId);

      setShowCardModal(false);
      clearCardForm();
      fetchCards();
      Alert.alert('Éxito', 'Tarjeta agregada correctamente');
      
      // Volver al modal principal después de agregar
      setTimeout(() => setShowPaymentModal(true), 500);
    } catch (err) {
      Alert.alert('Error', 'No se pudo agregar la tarjeta.');
    } finally {
      setLoading(false);
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
        custId = await createStripeCustomer();
      }

      const result = await processPayment(custId, selectedCard.stripeCardId);
      
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

  // Limpiar formulario (funcionalidad original)
  const clearCardForm = () => {
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setCardholderName('');
  };

  // Cerrar modales
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCard(null);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
    clearCardForm();
    setLoading(false);
    // Volver al modal principal después de cerrar
    setTimeout(() => setShowPaymentModal(true), 100);
  };

  // Renderizar tarjeta guardada (usando diseño mejorado)
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
          <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
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
        disabled={!amount || loading}
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
              
              {/* Lista de tarjetas guardadas */}
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
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderSavedCard}
                    style={styles.cardsList}
                  />
                ) : (
                  <Text style={styles.noCardsText}>No tienes tarjetas guardadas</Text>
                )}
                
                {/* Botón para agregar nueva tarjeta */}
                <TouchableOpacity
                  style={styles.addCardButton}
                  onPress={() => {
                    setShowPaymentModal(false);
                    setTimeout(() => setShowCardModal(true), 100);
                  }}
                >
                  <Ionicons name="add" size={20} color="#DE1484" />
                  <Text style={styles.addCardText}>Agregar nueva tarjeta</Text>
                </TouchableOpacity>
              </View>
              
              {/* Botón de pagar con tarjeta guardada */}
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

      {/* Modal para agregar nueva tarjeta */}
      <Modal 
        visible={showCardModal} 
        animationType="slide" 
        transparent 
        onRequestClose={handleCloseCardModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar Nueva Tarjeta</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseCardModal}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.newCardForm}>
              <Text style={styles.amountText}>Total a pagar: ${amount} MXN</Text>
              
              <Text style={styles.testCardInfo}>
                💡 Tarjetas de prueba disponibles:{'\n'}
                • 4242 4242 4242 4242 (Visa){'\n'}
                • 5555 5555 5555 4444 (Mastercard){'\n'}
                • 4000 0566 5566 5556 (Visa Debit){'\n'}
                Usa cualquier fecha futura y CVC de 3 dígitos
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nombre del titular"
                value={cardholderName}
                onChangeText={setCardholderName}
                autoCapitalize="words"
                editable={!loading}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
                editable={!loading}
              />
              
              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!loading}
                />
                
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVC"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <View style={styles.cardRow}>
                <TouchableOpacity
                  style={[styles.processButton, styles.halfButton, loading && styles.disabledButton]}
                  onPress={handleAddCardOnly}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.processButtonText}>Solo Agregar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.processButton, styles.halfButton, loading && styles.disabledButton]}
                  onPress={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.processButtonText}>Agregar y Pagar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  newCardForm: {
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
  testCardInfo: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    lineHeight: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
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
  halfButton: {
    width: '48%',
  },
});

export default CheckoutButton;