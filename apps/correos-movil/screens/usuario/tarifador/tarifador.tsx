"use client"

import { useState, useEffect, useRef } from "react"
import {View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, ActivityIndicator, Modal, FlatList, Animated, KeyboardAvoidingView, Platform, Dimensions} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckoutButton from '../../../components/Boton-pago-tariffador/CheckoutButton';
import { ScrollView } from "react-native"

const { height: screenHeight } = Dimensions.get('window');

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

  //obtener profileId
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

  {/* SE SUPONE QUE SIRVE ESTE CODIGO SOLO QUE LO VAMOS A UTILIZAR DESPUES
  useEffect(() => {
    if (!showCountryModal) return
    fetch(`http://${IP}:3000/api/shipping-rates/paises-internacionales`)
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(() => setPaises([]))
  }, [showCountryModal])
  */}

  useEffect(() => {
    if (!showCountryModal) return;

    // --- 👇 1. Pega tus datos falsos aquí ---
    const MOCK_PAISES = [
      { id: 1, name: "Estados Unidos" },
      { id: 2, name: "Canadá" },
      { id: 3, name: "Argentina" },
      { id: 4, name: "Brasil" },
      { id: 5, name: "España" },
      { id: 6, name: "Francia" },
      { id: 7, name: "Japón" },
      { id: 8, name: "Alemania" },
      { id: 9, name: "Reino Unido" },
      { id: 10, name: "China" },
    ];

    // --- 👇 2. Reemplaza el 'fetch' con esta simulación ---
    console.log("Mock: Cargando lista de países...");
    
    // Simula una pequeña espera (0.5 segundos)
    setTimeout(() => {
      setPaises(MOCK_PAISES);
      console.log("Mock: Países cargados.");
    }, 500);
  }, [showCountryModal]);

  {/* SE SUPONE QUE SI SIRVE ESTE CODIGO SOLO QUE LO VAMOS A UTILIZAR DESPUES
  //Funcion para validad los C.P y calculo de distancia nacional
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
  */}

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

    //  datos falsos 
    const MOCK_DATOS_ENVIO = {
      ciudadOrigen: "Victoria de Durango, Durango.",
      ciudadDestino: "Jesús María, Aguascalientes.",
      servicio: "Estándar",
      zona: {
        nombre: "B"
      }
    };
    try {
      //Simula una espera de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      //Establece los datos falsos como si vinieran del backend
      setDatosEnvio(MOCK_DATOS_ENVIO);
      
      //Muestra la sección de resultados
      setShowResults(true);

    } catch (err) {
      console.error("Error en la simulación:", err);
      Alert.alert("Error", "Ocurrió un error en la simulación");
    } finally {
      // Oculta el spinner de carga
      setLoading(false);
    }
  };

  {/* SE SUPONE QUE SI SIRVE ESTE CODIGO SOLO QUE LO VAMOS A UTILIZAR DESPUES
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
  */}

  const handleSearchInternacional = async () => {
    if (!paisDestino || !paisDestino.name) {
      Alert.alert("Error", "Selecciona un país válido")
      return
    }
    setLoading(true)

    // --- 1. Tus datos falsos ---
    const MOCK_INFO_PAIS = {
      descripcionZona: "América del Norte (Resto)"
    };

    // --- 2. Tu simulación ---
    try {
      // 1. Simula una espera de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. Guarda los datos falsos
      setInfoPais(MOCK_INFO_PAIS); 
      
      // 3. Muestra la sección de "Cotizar Envío"
      setShowResults(true); 
      
      // 4. Cierra el modal de países
      setShowCountryModal(false); 

    } catch (err) {
      console.error("Error en la simulación (Internacional):", err);
    } finally {
      setLoading(false);
    }
  };  

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
      Alert.alert("Campos vacíos", "Es necesario completar todas las dimensiones y peso.")
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
      navigation.goBack(); // regresa si ya no hay nada que cerrar
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
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        {/* Header fijo */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Tarificador</Text>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Tarificador de Envíos MEXPOST</Text>
          <Text style={styles.subtitle}>
            Cotiza los precios de tus envíos de forma fácil con nuestro tarificador.
          </Text>
        </View>

        {/* Contenido scrolleable */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Código postal de origen</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa 5 dígitos"
                    placeholderTextColor="#999"
                    value={codigoOrigen}
                    onChangeText={setCodigoOrigen}
                    keyboardType="numeric"
                    maxLength={5}
                    editable={!showQuote && !loading}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Código postal de destino</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingresa 5 dígitos"
                    placeholderTextColor="#999"
                    value={codigoDestino}
                    onChangeText={setCodigoDestino}
                    keyboardType="numeric"
                    maxLength={5}
                    editable={!showQuote && !loading}
                  />
                </View>
              </>
            ) : (

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>País de destino</Text>
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
              </View>
            )}

            {activeTab === "Nacional" && !showResults && (
              <TouchableOpacity
                style={[styles.searchButton, loading && styles.disabledButton]}
                onPress={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={styles.activeTab.backgroundColor} /> 
                ) : (
                  <>
                    <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.searchButtonText}>Realizar búsqueda</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Results Section */}
          {showResults && (
            <View style={styles.resultsContainer}>
              {activeTab === "Nacional" && datosEnvio && (
                <View style={styles.resultsCard}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Resultados</Text>
                    <TouchableOpacity style={styles.limpiarButton} onPress={handleLimpiar}>
                      <Ionicons name="close-circle-outline" size={18} color="#fff" />
                      <Text style={styles.limpiarButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Origen */}
                  <View style={styles.resultsInfoRow}>
                    <Text style={styles.resultsInfoLabel}>Origen</Text>
                    <Text style={styles.resultsInfoValue}>{datosEnvio.ciudadOrigen}</Text>
                  </View>
                  
                  {/* Destino */}
                  <View style={styles.resultsInfoRow}>
                    <Text style={styles.resultsInfoLabel}>Destino</Text>
                    <Text style={styles.resultsInfoValue}>{datosEnvio.ciudadDestino}</Text>
                  </View>

                  {/* Servicio */}
                  <View style={styles.resultsInfoRow}>
                    <Text style={styles.resultsInfoLabel}>Servicio</Text>
                    <Text style={styles.resultsInfoValue}>{datosEnvio.servicio || "Estándar"}</Text>
                  </View>
                  
                  {/* Pills (Zona e IVA) */}
                  <View style={styles.pillsContainer}>
                    <View style={[styles.pill, styles.pillZona]}>
                      <Text style={[styles.pillText, styles.pillTextZona]}>
                        Zona "{datosEnvio.zona?.nombre}"
                      </Text>
                    </View>
                    <View style={[styles.pill, styles.pillIva]}>
                      {/* El IVA no viene en datosEnvio, lo pongo como en el Figma */}
                      <Text style={[styles.pillText, styles.pillTextIva]}>
                        IVA: 0.16
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {activeTab === "Internacional" && infoPais && (
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Zona:</Text>
                    <Text style={styles.infoValue}>{infoPais.zona}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Descripción de zona:</Text>
                    <Text style={styles.infoValue}>{infoPais.descripcionZona}</Text>
                  </View>
                </View>
              )}

              {!showQuote && (
                <View style={styles.dimensionsSection}>
                  <Text style={styles.sectionTitle}>Cotizar Envío</Text>

                  {/* Grid de 2x2 para inputs */}
                  <View style={styles.inputGrid}>
                    <View style={styles.inputGridItem}>
                    <Text style={styles.inputLabel}>Peso en kilogramos</Text>
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
                      <Text style={styles.unitLabel}>kg</Text>
                    )}
                  </View>

                  <View style={styles.inputGridItem}>
                    <Text style={styles.inputLabel}>Altura en centímetros</Text>
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
                </View> 

                <View style={styles.inputGrid}>
                  <View style={styles.inputGridItem}>
                    <Text style={styles.inputLabel}>Ancho en centímetros</Text>
                    <TextInput
                      ref={anchoRef}
                      style={styles.input}
                      placeholder="Ancho en cm"
                      placeholderTextColor="#999"
                      value={ancho}
                      onChangeText={val => {
                        if (parseFloat(val) > max_ancho) {
                          Alert.alert("Límite excedido", `El ancho máximo permitido es ${max_ancho} cm. Pruebe con un valor menor.`);
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

                  <View style={styles.inputGridItem}>
                    <Text style={styles.inputLabel}>Largo en centímetros</Text>
                    <TextInput
                      ref={largoRef}
                      style={styles.input}
                      placeholder="Largo en cm"
                      placeholderTextColor="#999"
                      value={largo}
                      onChangeText={val => {
                        if (parseFloat(val) > max_largo) {
                          Alert.alert("Límite excedido", `El largo máximo permitido es ${max_largo} cm. Pruebe con un valor menor.`);
                          return;
                        }
                        setLargo(val.replace(/[^0-9.]/g, ""));
                      }}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                    />
                    {largo !== "" && (
                      <Text style={styles.unitLabel}>cm</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                    style={[styles.searchButton, loadingQuote && styles.disabledButton]}
                    onPress={activeTab === "Internacional" ? handleCotizarInternacional : handleCotizarNacional}
                    disabled={loadingQuote}
                  >
                    {loadingQuote ? (
                      <ActivityIndicator color={styles.activeTab.backgroundColor} />
                    ) : (
                      <>
                        <Ionicons name="wallet-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.searchButtonText}>Realizar cotización</Text>
                      </>
                    )}
                  </TouchableOpacity>  
                </View>
              )}

              {showQuote && cotizacionData && (
                <View style={styles.quoteSection}>
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

                  {/* Costo total y botón de pago */}
                  <View style={styles.costoTotalContainer}>
                    <Text style={styles.costoTotalLabel}>Costo del envío:</Text>
                    <Text style={styles.costoTotalValue}>
                      {activeTab === "Nacional" 
                        ? `MXN ${costo || 'N/A'}` 
                        : `USD ${cotizacionData.total || "N/A"}`
                      }
                    </Text>
                  </View>

                  <View style={styles.paymentButtonContainer}>
                    <CheckoutButton
                      amount={activeTab === "Nacional" ? costo : cotizacionData.total}
                      email={email}
                      profileId={profileId || 115}
                      onPaymentSuccess={(paymentResult) => {
                        console.log('Pago exitoso:', paymentResult);
                        navigation.navigate('GuiaFormulario', {
                          datosTarifador: {
                            codigoOrigen,
                            codigoDestino,
                            peso,
                            alto,
                            ancho,
                            largo,
                            costo: activeTab === "Nacional" ? costo : cotizacionData.total,
                            tipoEnvio: activeTab,
                          }
                        });
                      }}
                      onPaymentError={(error) => {
                        console.error('Error en pago:', error);
                        Alert.alert('Error', 'Hubo un problema con el pago');
                      }}
                    />
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Espaciado adicional para Android */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Modal de países */}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
    paddingHorizontal: 20, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 15,
    padding: 5, 
  },
  title: {
    fontSize: 20, 
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    flex: 1,
    marginRight: 44,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginHorizontal: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffffff",
    borderRadius: 30,
    padding: 4,
    marginBottom: 25,
    marginHorizontal: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12, 
    alignItems: "center",
    borderRadius: 30, 
  },
  activeTab: {
    backgroundColor: "#E6007E", 
    shadowColor: "#E6007E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  formContainer: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff", 
    borderWidth: 1,
    borderColor: "#f7f7f7ff", 
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 15,
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
  unitLabel: {
    position: "absolute",
    right: 25,
    top: "40%",
    transform: [{ translateY: -10 }],
    color: "#E6007E",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8, 
  },
  searchButton: {
    backgroundColor: "#E6007E",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20, 
    marginBottom: 20,
    justifyContent: "center",
    minHeight: 52,
    flexDirection: "row", 
    shadowColor: "#E6007E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E6007E",
    flexDirection: "row", 
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16, 
    fontWeight: "bold", 
  },
  resultsContainer: {
    paddingHorizontal: 20, 
    backgroundColor: "#ffffffff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
  },
  infoContainer: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  dimensionsSection: {
    marginTop: 25,
    marginBottom: 30,
  },
  quoteSection: {
    marginTop: 20,
    paddingBottom: 30,
  },
  detallesContainer: {
    marginBottom: 20,
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    padding: 16,
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
    flex: 1,
  },
  detalleValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  costoTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: "#E6007E",
    borderBottomWidth: 2,
    borderBottomColor: "#E6007E",
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "#fdf2f8",
    borderRadius: 12,
  },
  costoTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  costoTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E6007E",
  },
  paymentButtonContainer: {
    marginTop: 15,
    marginBottom: Platform.OS === 'android' ? 25 : 15,
  },
  bottomSpacer: {
    height: Platform.OS === 'android' ? 50 : 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    paddingBottom: 20,
    width: '100%',
    height: '90%', 
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
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalCloseButton: {
    padding: 5,
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
    backgroundColor: "#fde7f3",
    borderLeftWidth: 4,
    borderLeftColor: "#E6007E",
  },
  countryText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  countryTextSelected: {
    fontWeight: "bold",
    color: "#E6007E",
  },
  floatingButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10, 
    paddingBottom: 30, 
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  floatingButton: {
    backgroundColor: "#E6007E",
    borderRadius: 30,
    paddingVertical: 16, 
    paddingHorizontal: 40,
    width: '90%', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#E6007E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16, 
    fontWeight: "bold",
  },
  floatingButtonDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 1,
  },
  resultsCard: {
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30, 
  },
  limpiarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6007E', 
    borderRadius: 10,        
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: "#E6007E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  limpiarButtonText: {
    color: '#fff',             
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffffff',
  },
  resultsInfoLabel: {
    fontSize: 16,
    color: '#666',
  },
  resultsInfoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
    textAlign: 'right',
  },
  pillsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  pill: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 40,
    marginHorizontal: 4, 
  },
  pillText: {
    fontWeight: '600',
    fontSize: 14,
  },
  pillZona: {
    backgroundColor: '#E6E9FF', 
  },
  pillTextZona: {
    color: '#495BCC', 
  },
  pillIva: {
    backgroundColor: '#F0F0F0',
  },
  pillTextIva: {
    color: '#666', 
  },
  inputGrid: {
    flexDirection: 'row',
    marginTop: 15,
  },
  inputGridItem: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 10,
  },
});

export default TarificadorMexpost