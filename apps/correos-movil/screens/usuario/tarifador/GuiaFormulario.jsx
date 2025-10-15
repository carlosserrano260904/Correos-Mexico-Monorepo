import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const GuiaFormulario = ({ route, navigation }) => {
  // Recibe los datos del tarifador
  const { datosTarifador } = route.params;

  // Estados para remitente y destinatario
  const [remitente, setRemitente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      numeroInterior: "",
      asentamiento: "",
      codigoPostal: datosTarifador.codigoOrigen || "",
      localidad: "",
      estado: "",
      pais: "Mexico"
    }
  });
  
  const [destinatario, setDestinatario] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      numeroInterior: "",
      asentamiento: "",
      codigoPostal: datosTarifador.codigoDestino || "",
      localidad: "",
      estado: "",
      pais: "Mexico"
    }
  });

  const [valorDeclarado, setValorDeclarado] = useState("");
  const [loading, setLoading] = useState(false);

  // Validación de campos requeridos
  const validarCampos = () => {
    const camposRequeridos = [
      { valor: remitente.nombres, nombre: "Nombres del remitente" },
      { valor: remitente.apellidos, nombre: "Apellidos del remitente" },
      { valor: remitente.telefono, nombre: "Teléfono del remitente" },
      { valor: remitente.direccion.calle, nombre: "Calle del remitente" },
      { valor: remitente.direccion.numero, nombre: "Número del remitente" },
      { valor: remitente.direccion.asentamiento, nombre: "Colonia del remitente" },
      { valor: destinatario.nombres, nombre: "Nombres del destinatario" },
      { valor: destinatario.apellidos, nombre: "Apellidos del destinatario" },
      { valor: destinatario.telefono, nombre: "Teléfono del destinatario" },
      { valor: destinatario.direccion.calle, nombre: "Calle del destinatario" },
      { valor: destinatario.direccion.numero, nombre: "Número del destinatario" },
      { valor: destinatario.direccion.asentamiento, nombre: "Colonia del destinatario" },
    ];

    for (const campo of camposRequeridos) {
      if (!campo.valor || campo.valor.trim() === "") {
        Alert.alert("Campo requerido", `Por favor completa: ${campo.nombre}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) {
      return;
    }

    setLoading(true);
    
    // Arma el objeto para el backend
    const paquete = {
      alto_cm: parseFloat(datosTarifador.alto),
      ancho_cm: parseFloat(datosTarifador.ancho),
      largo_cm: parseFloat(datosTarifador.largo)
    };
    
    const peso = parseFloat(datosTarifador.peso);
    
    const datosGuia = {
      remitente,
      destinatario,
      paquete,
      peso,
      valorDeclarado: parseFloat(valorDeclarado) || 0
    };

    console.log('Datos a enviar:', JSON.stringify(datosGuia, null, 2));

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      
      if (!API_URL) {
        throw new Error('URL de API no configurada');
      }

      console.log('Enviando request a:', `${API_URL}/guias/generar-pdf-nacional`);
      
      const response = await fetch(`${API_URL}/api/guias/generar-pdf-nacional`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/pdf"
        },
        body: JSON.stringify(datosGuia)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || `Error del servidor: ${response.status}`);
      }

      // Obtener el PDF como blob
      const pdfBlob = await response.blob();
      console.log('PDF blob size:', pdfBlob.size);

      // Convertir blob a base64 para guardarlo
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64data = reader.result.split(',')[1];
          const fileName = `guia-${Date.now()}.pdf`;
          const fileUri = `${FileSystem.documentDirectory}${fileName}`;
          
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log('PDF guardado en:', fileUri);

          // Compartir el archivo
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          }

          Alert.alert(
            "Éxito", 
            "PDF generado y guardado correctamente",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        } catch (saveError) {
          console.error('Error al guardar PDF:', saveError);
          Alert.alert("Error", "PDF generado pero no se pudo guardar");
        }
      };
      reader.readAsDataURL(pdfBlob);

    } catch (err) {
      console.error('Error completo:', err);
      Alert.alert("Error", err.message || "No se pudo generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderInput = (placeholder, value, onChangeText, keyboardType = "default", maxLength = null, required = false) => (
    <TextInput
      style={styles.input}
      placeholder={`${placeholder}${required ? ' *' : ''}`}
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      editable={!loading}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>
            Generar guía de envío{"\n"}
            <Text style={styles.subtitle}>MEXPOST</Text>
          </Text>
        </View>

        {/* Resumen del envío */}
        <View style={styles.resumenContainer}>
          <Text style={styles.sectionTitle}>Resumen del envío</Text>
          <View style={styles.resumenGrid}>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Origen (CP)</Text>
              <Text style={styles.resumenValue}>{datosTarifador.codigoOrigen}</Text>
            </View>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Destino (CP)</Text>
              <Text style={styles.resumenValue}>{datosTarifador.codigoDestino}</Text>
            </View>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Peso</Text>
              <Text style={styles.resumenValue}>{datosTarifador.peso} kg</Text>
            </View>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenLabel}>Dimensiones</Text>
              <Text style={styles.resumenValue}>
                {datosTarifador.largo}×{datosTarifador.ancho}×{datosTarifador.alto} cm
              </Text>
            </View>
          </View>
          <View style={styles.costoContainer}>
            <Text style={styles.costoLabel}>Costo total:</Text>
            <Text style={styles.costoValue}>MXN ${datosTarifador.costo}</Text>
          </View>
        </View>

        {/* Formulario Remitente */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#e91e63" />
            <Text style={styles.sectionTitle}>Datos del remitente</Text>
          </View>
          
          {renderInput("Nombres", remitente.nombres, 
            v => setRemitente(r => ({ ...r, nombres: v })), "default", null, true)}
          
          {renderInput("Apellidos", remitente.apellidos, 
            v => setRemitente(r => ({ ...r, apellidos: v })), "default", null, true)}
          
          {renderInput("Teléfono", remitente.telefono, 
            v => setRemitente(r => ({ ...r, telefono: v })), "phone-pad", null, true)}
          
          <View style={styles.subsectionHeader}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.subsectionTitle}>Dirección</Text>
          </View>
          
          {renderInput("Calle", remitente.direccion.calle, 
            v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, calle: v } })), "default", null, true)}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              {renderInput("Número", remitente.direccion.numero, 
                v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, numero: v } })), "default", null, true)}
            </View>
            <View style={styles.inputHalf}>
              {renderInput("Número Interior", remitente.direccion.numeroInterior, 
                v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, numeroInterior: v } })))}
            </View>
          </View>
          
          {renderInput("Colonia/Asentamiento", remitente.direccion.asentamiento, 
            v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, asentamiento: v } })), "default", null, true)}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Código Postal"
                placeholderTextColor="#999"
                value={remitente.direccion.codigoPostal}
                editable={false}
              />
            </View>
            <View style={styles.inputHalf}>
              {renderInput("Localidad", remitente.direccion.localidad, 
                v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, localidad: v } })))}
            </View>
          </View>
          
          {renderInput("Estado", remitente.direccion.estado, 
            v => setRemitente(r => ({ ...r, direccion: { ...r.direccion, estado: v } })))}
        </View>

        {/* Formulario Destinatario */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#e91e63" />
            <Text style={styles.sectionTitle}>Datos del destinatario</Text>
          </View>
          
          {renderInput("Nombres", destinatario.nombres, 
            v => setDestinatario(r => ({ ...r, nombres: v })), "default", null, true)}
          
          {renderInput("Apellidos", destinatario.apellidos, 
            v => setDestinatario(r => ({ ...r, apellidos: v })), "default", null, true)}
          
          {renderInput("Teléfono", destinatario.telefono, 
            v => setDestinatario(r => ({ ...r, telefono: v })), "phone-pad", null, true)}
          
          <View style={styles.subsectionHeader}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.subsectionTitle}>Dirección</Text>
          </View>
          
          {renderInput("Calle", destinatario.direccion.calle, 
            v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, calle: v } })), "default", null, true)}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              {renderInput("Número", destinatario.direccion.numero, 
                v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, numero: v } })), "default", null, true)}
            </View>
            <View style={styles.inputHalf}>
              {renderInput("Número Interior", destinatario.direccion.numeroInterior, 
                v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, numeroInterior: v } })))}
            </View>
          </View>
          
          {renderInput("Colonia/Asentamiento", destinatario.direccion.asentamiento, 
            v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, asentamiento: v } })), "default", null, true)}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Código Postal"
                placeholderTextColor="#999"
                value={destinatario.direccion.codigoPostal}
                editable={false}
              />
            </View>
            <View style={styles.inputHalf}>
              {renderInput("Localidad", destinatario.direccion.localidad, 
                v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, localidad: v } })))}
            </View>
          </View>
          
          {renderInput("Estado", destinatario.direccion.estado, 
            v => setDestinatario(r => ({ ...r, direccion: { ...r.direccion, estado: v } })))}
        </View>

        {/* Valor Declarado */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={20} color="#e91e63" />
            <Text style={styles.sectionTitle}>Valor declarado</Text>
          </View>
          
          {renderInput("Valor declarado (MXN)", valorDeclarado, setValorDeclarado, "numeric")}
        </View>

        {/* Botón de generar PDF */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.generateButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.generateButtonText}>Generar PDF de la guía</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
  resumenContainer: {
    marginHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  resumenGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resumenItem: {
    width: "48%",
    marginBottom: 12,
  },
  resumenLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  resumenValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  costoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  costoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  costoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  subsectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 6,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
    borderWidth: 1,
    borderColor: "transparent",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#666",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputHalf: {
    width: "48%",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  generateButton: {
    backgroundColor: "#e91e63",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 52,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GuiaFormulario;