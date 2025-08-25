"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckoutButton from '../../../components/Boton-pago-tariffador/CheckoutButton';
import { ScrollView } from "react-native"

const TarificadorMexpost = () => {
  const navigation = useNavigation();
  const IP = Constants.expoConfig?.extra?.IP_LOCAL;
  const [activeTab, setActiveTab] = useState("Nacional")
  const [codigoOrigen, setCodigoOrigen] = useState("")
  const [codigoDestino, setCodigoDestino] = useState("")
  const [paisOrigen] = useState("México")
  const [paises, setPaises] = useState([])
  const [paisDestino, setPaisDestino] = useState(null)
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [infoPais, setInfoPais] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [peso, setPeso] = useState("")
  const [alto, setAlto] = useState("")
  const [ancho, setAncho] = useState("")
  const [largo, setLargo] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [datosEnvio, setDatosEnvio] = useState(null)
  const [cotizacionData, setCotizacionData] = useState(null)
  const costo = cotizacionData?.costoTotal || 0;
  const email = 'cliente@example.com';
  const [profileId, setProfileId] = useState(null);
  const [modalAnim] = useState(new Animated.Value(0));
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // Definimos las dimensiones máximas
  const max_peso  = 50;
  const max_alto  = 300;
  const max_ancho = 300;
  const max_largo = 300;

  //obtener profielid
  useEffect(() => {
    const fetchProfileId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) throw new Error('No se encontró el ID del usuario.');
        if (!API_URL) throw new Error('La URL de la API no está configurada.');

        const profileRes = await axios.get(`${API_URL}/api/profile/${userId}`);
        const profileId = profileRes.data?.id;
        setProfileId(profileId); // ✅ Guardamos solo el profileId
      } catch (err) {
        console.error('Error al cargar el profileId:', err);
      }
    };

    fetchProfileId();
  }, []);

  useEffect(() => {
    if (!showCountryModal) return
    fetch(`http://${IP}:3000/api/shipping-rates/paises-internacionales`)
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(() => setPaises([]))
  }, [showCountryModal])

  //Funcion para validad los C.P y calculo de distancia
  const handleSearchNacional = async () => {
    if (!codigoOrigen || !codigoDestino) {
      Alert.alert("Error", "Por favor ingresa ambos códigos postales");
      return;
    }
    if (codigoOrigen.length !== 5 || codigoDestino.length !== 5) {
      Alert.alert("Error", "Los códigos postales deben tener 5 dígitos");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://${IP}:3000/api/shipping-rates/calculate-distance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoOrigen, codigoDestino }),
      });
      const data = await response.json();

      if (response.ok) {
        setDatosEnvio(data);
        setShowResults(true);
      } else {
        if (data.message.includes('Código postal inválido')) {
          Alert.alert("Error", data.message); // Error específico de C.P.
        } else {
          Alert.alert("Error", "No se pudo calcular la distancia");
        }
      }
    } catch {
      Alert.alert("Error", "Error de conexión. Verifica tu internet.");
    } finally {
      setLoading(false);
    }
  };

  // Cambia handleSearchInternacional para que solo busque y muestre zona/desc. después de cerrar el modal
  const handleSearchInternacional = async () => {
    if (!paisDestino || !paisDestino.name) {
      Alert.alert("Error", "Selecciona un país válido")
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`http://${IP}:3000/api/shipping-rates/consultar-pais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paisDestino: paisDestino.name }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "No se pudo obtener la zona")
      setInfoPais(data)
      setShowResults(true) // Muestra zona y descripción
      setShowCountryModal(false) // Cierra el modal
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo obtener la zona")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (activeTab === "Nacional") handleSearchNacional()
    // Para internacional, solo abre el modal (la búsqueda se hace en el modal)
    else setShowCountryModal(true)
  }

  const handleCotizarNacional = async () => {
    if (!peso || !alto || !ancho || !largo) {
      Alert.alert("Error", "Por favor completa todas las dimensiones y peso")
      return
    }
    setLoadingQuote(true)
    try {
      const response = await fetch(`http://${IP}:3000/api/shipping-rates/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peso: parseFloat(peso),
          alto: parseFloat(alto),
          ancho: parseFloat(ancho),
          largo: parseFloat(largo),
          tipoServicio: "nacional",
          codigoOrigen,
          codigoDestino,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setCotizacionData(data)
        setShowQuote(true)
      } else {
        Alert.alert("Error", data.message || "No se pudo realizar la cotización")
      }
    } catch {
      Alert.alert("Error", "Error de conexión. Verifica tu internet.")
    } finally {
      setLoadingQuote(false)
    }
  }

  const handleCotizarInternacional = async () => {
    if (!peso || !alto || !ancho || !largo) {
      Alert.alert("Campos vacios", "Es necesario completar todas las dimensiones y peso.")
      return
    }
    if (!paisDestino || !paisDestino.name) {
      Alert.alert("Error", "Selecciona un país válido")
      return
    }
    setLoadingQuote(true)
    try {
      const response = await fetch(`http://${IP}:3000/api/shipping-rates/cotizar-internacional`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paisDestino: paisDestino.name,
          peso: parseFloat(peso),
          alto: parseFloat(alto),
          ancho: parseFloat(ancho),
          largo: parseFloat(largo),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "No se pudo obtener tarifa")
      setCotizacionData(data)
      setShowQuote(true)
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo calcular tarifa")
    } finally {
      setLoadingQuote(false)
    }
  }

  const handleLimpiar = () => {
    setCodigoOrigen("")
    setCodigoDestino("")
    setPaisDestino(null)
    setShowResults(false)
    setShowQuote(false)
    setPeso("")
    setAlto("")
    setAncho("")
    setLargo("")
    setDatosEnvio(null)
    setCotizacionData(null)
    setInfoPais(null)
  }

  const handleNuevaConsulta = () => {
    setShowQuote(false)
    setPeso("")
    setAlto("")
    setAncho("")
    setLargo("")
    setCotizacionData(null)
  }

  const handleBack = () => {
    if (showQuote) {
      setShowQuote(false);
    } else if (showResults) {
      setShowResults(false);
    } else {
      navigation.goBack(); // ← regresa si ya no hay nada que cerrar
    }
  };

  const handleTabChange = (tab) => {
    if (!showResults) {
      setActiveTab(tab)
      handleLimpiar()
    }
  }

  const renderCountryItem = ({ item }) => {
    const isSelected = paisDestino?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.countryItemSelected
        ]}
        onPress={() => setPaisDestino(isSelected ? null : item)}
      >
        <Text
          style={[
            styles.countryText,
            isSelected && styles.countryTextSelected
          ]}
        >
          {item.name}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={20} color="#e91e63" style={{ marginLeft: 8 }} />
        )}
      </TouchableOpacity>
    );
  }

  // Animación al abrir/cerrar el modal
  useEffect(() => {
    if (showCountryModal) {
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showCountryModal]);

  // Calcula la posición vertical del modal
  const modalTranslateY = modalAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0], // Desliza desde 400px abajo hasta su posición
  });

  // Referencias para los campos
  const pesoRef = useRef(null);
  const altoRef = useRef(null);
  const anchoRef = useRef(null);
  const largoRef = useRef(null);

  // Función para cambiar de campo automáticamente
  const focusNextField = (nextRef) => {
    if (nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>
              Tarificador de envíos{"\n"}
              <Text style={styles.subtitle}>MEXPOST</Text>
            </Text>
          </View>
          {/* Tabs */}
          <View style={[styles.tabContainer, showQuote && styles.tabContainerWithBorder]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Nacional" && styles.activeTab]}
              onPress={() => handleTabChange("Nacional")}
              disabled={showResults}
            >
              <Text style={[styles.tabText, activeTab === "Nacional" && styles.activeTabText]}>Nacional</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Internacional" && styles.activeTab]}
              onPress={() => handleTabChange("Internacional")}
              disabled={showResults}
            >
              <Text style={[styles.tabText, activeTab === "Internacional" && styles.activeTabText]}>Internacional</Text>
            </TouchableOpacity>
          </View>
          {/* Form */}
          <View style={[styles.formContainer, showQuote && styles.formContainerWithBorder]}>
            {activeTab === "Nacional" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Código postal de origen"
                  placeholderTextColor="#999"
                  value={codigoOrigen}
                  onChangeText={setCodigoOrigen}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!showQuote && !loading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Código postal de destino"
                  placeholderTextColor="#999"
                  value={codigoDestino}
                  onChangeText={setCodigoDestino}
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!showQuote && !loading}
                />
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowCountryModal(true)}
                  disabled={showQuote || loading}
                >
                  <Text style={[styles.inputText, paisDestino ? styles.inputTextFilled : styles.inputTextPlaceholder]}>
                    {paisDestino?.name || "Selecciona un país"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#999" style={styles.inputIcon} />
                </TouchableOpacity>
              </>
            )}
            {activeTab === "Nacional" && !showResults && (
              <TouchableOpacity
                style={[styles.searchButton, loading && styles.disabledButton]}
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#DE1484" /> : <Text style={styles.searchButtonText}>Buscar</Text>}
              </TouchableOpacity>
            )}
          </View>
          {/* Results Section */}
          {showResults && (
            <View style={styles.resultsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Datos de envío</Text>
                <TouchableOpacity onPress={handleLimpiar}>
                  <Text style={styles.limpiarButton}>Limpiar</Text>
                </TouchableOpacity>
              </View>
              {activeTab === "Nacional" && datosEnvio && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Origen:</Text>
                    <Text style={styles.infoValue}>{datosEnvio.ciudadOrigen}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Destino:</Text>
                    <Text style={styles.infoValue}>{datosEnvio.ciudadDestino}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zona:</Text>
                    <Text style={styles.infoValue}>
                      {datosEnvio.zona?.nombre}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Servicio:</Text>
                    <Text style={styles.infoValue}>{datosEnvio.servicio || "Estándar"}</Text>
                  </View>
                </>
              )}
              {activeTab === "Internacional" && infoPais && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zona:</Text>
                    <Text style={styles.infoValue}>{infoPais.zona}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripción de zona:</Text>
                    <Text style={styles.infoValue}>{infoPais.descripcionZona}</Text>
                  </View>
                </>
              )}
              {!showQuote && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.sectionTitle}>Dimensiones y peso</Text>
                  </View>

                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={pesoRef}
                      style={styles.input}
                      placeholder="Peso en kg"
                      placeholderTextColor="#999"
                      value={peso}
                      onChangeText={val => {
                        if (parseFloat(val) > max_peso) {
                          Alert.alert("Límite excedido", `El peso máximo permitido es ${max_peso} kg. Pruebe con un valor menor.`);
                          return;
                        }
                        setPeso(val.replace(/[^0-9.]/g, ""));
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(altoRef)}
                      blurOnSubmit={false}
                    />
                    {peso !== "" && (
                      <Text style={styles.unitLabel}>kg</Text>)}
                  </View>

                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={altoRef}
                      style={styles.input}
                      placeholder="Alto en cm"
                      placeholderTextColor="#999"
                      value={alto}
                      onChangeText={val => {
                        if (parseFloat(val) > max_alto) {
                          Alert.alert("Límite excedido", `El alto máximo permitido es ${max_alto} cm. Pruebe con un valor menor.`);
                          return;
                        }
                        setAlto(val.replace(/[^0-9.]/g, ""));
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(anchoRef)}
                      blurOnSubmit={false}
                    />
                    {alto !== "" && (
                      <Text style={styles.unitLabel}>cm</Text>
                    )}
                  </View>

                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={anchoRef}
                      style={styles.input}
                      placeholder="Ancho en cm"
                      placeholderTextColor="#999"
                      value={ancho}
                      onChangeText={val => {
                        if (parseFloat(val) > max_ancho) {
                          Alert.alert("Límite excedido", `El alto máximo permitido es ${max_ancho} cm. Pruebe con un valor menor.`);
                          return;
                        }
                        setAncho(val.replace(/[^0-9.]/g, ""));
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="next"
                      onSubmitEditing={() => focusNextField(largoRef)}
                      blurOnSubmit={false}
                    />
                    {ancho !== "" && (
                      <Text style={styles.unitLabel}>cm</Text>
                    )}
                  </View>

                  <View style={{ position: 'relative' }}>
                    <TextInput
                      ref={largoRef}
                      style={styles.input}
                      placeholder="Largo en cm"
                      placeholderTextColor="#999"
                      value={largo}
                      onChangeText={val => {
                        if (parseFloat(val) > max_largo) {
                          Alert.alert("Límite excedido", `El alto máximo permitido es ${max_largo} cm. Pruebe con un valor menor.`);
                          return;
                        }
                        setLargo(val.replace(/[^0-9.]/g, ""));
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      onSubmitEditing={() => { /* Aquí puedes cerrar el teclado o hacer otra acción */ }}
                    />
                    {largo !== "" && (
                      <Text style={styles.unitLabel}>cm</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.searchButton, loadingQuote && styles.disabledButton]}
                    onPress={activeTab === "Internacional" ? handleCotizarInternacional : handleCotizarNacional}
                    disabled={loadingQuote}
                  >
                    {loadingQuote ? (
                      <ActivityIndicator color="#e91e63" />
                    ) : (
                      <Text style={styles.searchButtonText}>Cotizar</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
              {showQuote && cotizacionData && (
                <>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Detalles del servicio</Text>
                    <TouchableOpacity onPress={handleNuevaConsulta}>
                      <Text style={styles.limpiarButton}>Nueva consulta</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.detallesContainer}>
                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Tipo de envío:</Text>
                      <Text style={styles.detalleValue}>{activeTab}</Text>
                    </View>

                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Peso físico:</Text>
                      <Text style={styles.detalleValue}>
                        {cotizacionData.pesoFisico} kg
                      </Text>
                    </View>

                    <View style={styles.detalleRow}>
                      <Text style={styles.detalleLabel}>Peso volumétrico:</Text>
                      <Text style={styles.detalleValue}>
                        {cotizacionData.pesoVolumetrico} kg
                      </Text>
                    </View>

                    {activeTab === "Nacional" ? (
                      <>
                        {/* Nacional muestra tarifaSinIVA, iva y costoTotal */}
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>Tarifa sin IVA:</Text>
                          <Text style={styles.detalleValue}>
                            MXN {cotizacionData.tarifaSinIVA || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>IVA:</Text>
                          <Text style={styles.detalleValue}>
                            MXN {cotizacionData.iva || "N/A"}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Internacional muestra precioBase, iva, total */}
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>Precio base:</Text>
                          <Text style={styles.detalleValue}>
                            USD {cotizacionData.precioBase?.toFixed(2) || "N/A"}
                          </Text>
                        </View>
                        <View style={styles.detalleRow}>
                          <Text style={styles.detalleLabel}>IVA:</Text>
                          <Text style={styles.detalleValue}>
                            USD {cotizacionData.iva?.toFixed(2) || "N/A"}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                  {/* Solo mostrar el resumen de costo total en Nacional */}
                  {activeTab === "Nacional" && (
                    <View>
                      <View style={styles.costoTotalContainer}>
                        <Text style={styles.costoTotalLabel}>Costo del envío:</Text>
                        <Text style={styles.costoTotalValue}>
                          MXN {costo || 'N/A'}
                        </Text>
                      </View>

                      {/* Boton de pago simplificado */}
                      <CheckoutButton
                        amount={costo}
                        email={email}
                        profileId={115}
                        onPaymentSuccess={(paymentResult) => {
                          console.log('Pago exitoso:', paymentResult);
                          // Aquí puedes hacer lo que necesites después del pago
                          // Por ejemplo, redirigir, limpiar formulario, etc.
                          Alert.alert('Éxito', 'El pago se procesó correctamente');
                        }}
                        onPaymentError={(error) => {
                          console.error('Error en pago:', error);
                          // Manejar errores si es necesario
                        }}
                      />
                    </View>
                  )}

                  {activeTab === "Internacional" && (
                    <View style={styles.costoTotalContainer}>
                      <Text style={styles.costoTotalLabel}>Costo del envío:</Text>
                      <Text style={styles.costoTotalValue}>
                        USD {cotizacionData.total || "N/A"}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>

        <Modal
          visible={showCountryModal}
          transparent={true}
          animationType="none"
          onRequestClose={() => setShowCountryModal(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: "transparent" }]}>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: modalTranslateY }] },
                styles.modalShadow
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar país de destino</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCountryModal(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={paises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCountryItem}
                ListEmptyComponent={() => (
                  <Text style={{ padding: 20, textAlign: 'center' }}>
                    Cargando países...
                  </Text>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
              />
              <View style={styles.floatingButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.floatingButton,
                    !paisDestino && styles.floatingButtonDisabled
                  ]}
                  onPress={handleSearchInternacional}
                  disabled={!paisDestino}
                  activeOpacity={0.7}
                >
                  <Text style={styles.floatingButtonText}>Buscar país</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  infoLabel: {
    fontWeight: "bold",
    color: "#000",
  },
  infoValue: {
    color: "#333",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  itemText: {
    fontSize: 16,
    color: "#000",
  },
  emptyText: {
    padding: 20,
    textAlign: "center",
    color: "gray",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 3,
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 5,
    marginRight: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  tabContainerWithBorder: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  formContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  formContainerWithBorder: {
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 5,
    marginBottom: -5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 15,
    color: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputText: {
    fontSize: 16,
    flex: 1,
  },
  inputTextFilled: {
    color: "#000",
  },
  inputTextPlaceholder: {
    color: "#999",
  },
  inputIcon: {
    marginLeft: 10,
  },
  searchButton: {
    backgroundColor: "#e91e63",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
    minHeight: 52,
  },
  disabledButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e91e63",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 0,
  },
  limpiarButton: {
    color: "#e91e63",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  zonaText: {
    fontSize: 14,
    color: "#666",
  },
  ivaText: {
    fontSize: 14,
    color: "#666",
  },
  detallesContainer: {
    marginBottom: 20,
  },
  detalleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detalleLabel: {
    fontSize: 16,
    color: "#000",
  },
  detalleValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  costoTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 10,
  },
  costoTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  costoTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent", // Fondo transparente
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 20,
    width: '100%',
    height: '95%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  modalShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  modalCloseButton: {
    padding: 5,
  },
  countryList: {
    flex: 1,
  },
  unitLabel: {
  position: "absolute",
  right: 25,
  top: "40%",
  transform: [{ translateY: -10 }],
  color: "#e91e63",
  fontWeight: "bold",
  fontSize: 16,
},
  countryItem: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  countryItemSelected: {
    backgroundColor: "#fde7f3", // Fondo rosa claro para seleccionado
    borderLeftWidth: 4,
    borderLeftColor: "#e91e63",
  },
  countryText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  countryTextSelected: {
    fontWeight: "bold",
    color: "#e91e63", // Texto rosa para seleccionado
  },
  floatingButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  floatingButton: {
    backgroundColor: "#e91e63",
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    elevation: 5,
    shadowColor: "#e91e63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#e91e63",
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",

  },
  floatingButtonDisabled: {
    backgroundColor: "#e91e63",
    borderColor: "#e91e63",
    opacity: 0.5,
  },
})

export default TarificadorMexpost