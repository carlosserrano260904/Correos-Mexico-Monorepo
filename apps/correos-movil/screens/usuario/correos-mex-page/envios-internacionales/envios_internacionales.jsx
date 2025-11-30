import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

// --- DATOS CON RUTAS DE IMAGEN CORRECTAS Y TEXTO SIMPLIFICADO ---
const cardData = [
  {
    title: "Correspondencia Internacional",
    description:
      "Envía tus cartas, documentos o tarjetas a cualquier parte del mundo.",
    imageUrl: require("../../../../assets/correspondencia.jpg"), // Ruta actualizada por el usuario
    link: "CorrespondenciaInter",
  },
  {
    title: "Paquetería Internacional",
    description: "Exporta productos y mercancías a más de 180 países.",
    imageUrl: require("../../../../assets/paquete.jpg"), // Ruta actualizada por el usuario
    link: "PaqueteriaInter",
  },
  {
    title: "Impresos Internacional",
    description:
      "Haz crecer tu negocio enviando nuestro material de impresión a distintos países.",
    imageUrl: require("../../../../assets/impresos2.png"), // Ruta actualizada por el usuario
    link: "ImpresosInter",
  },
  {
    title: "Servicios Adicionales Internacionales",
    description: "Conoce todos los servicios especiales que tenemos para ti.",
    imageUrl: require("../../../../assets/adicionales.jpg"), // Ruta actualizada por el usuario
    link: "ServiciosAdicionalesInter",
  },
];
// --- FIN DE DATOS ---

// --- COMPONENTE DE TARJETA
const ServicioCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Image source={item.imageUrl} style={styles.cardImage} />
    <View style={styles.cardContentWrapper}>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>

      <TouchableOpacity style={styles.cardFooter} onPress={onPress}>
        <Text style={styles.moreInfoText}>Más información</Text>
        <View style={styles.cardArrowContainer}>
          <Icon name="arrow-right" size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);
// --- FIN DEL COMPONENTE DE TARJETA ---

export default function EnviosInternacionalesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.container}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Título de la pantalla */}
        <Text style={styles.title}>
          Envíos
          {"\n"}
          Internacionales
        </Text>

        {/* Contenedor de las tarjetas */}
        <View style={styles.cardsList}>
          {cardData.map((item, index) => (
            <ServicioCard
              key={index}
              item={item}
              onPress={() => navigation.navigate(item.link)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 40,
  },
  cardsList: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e5e7eb", // Placeholder color
    resizeMode: "cover", // Asegurarse que la imagen cubra el espacio
  },
  cardContentWrapper: {
    // Contenedor para el contenido de texto y footer
    padding: 20,
    paddingBottom: 0, // Ajuste para que el footer gestione su propio padding
  },
  cardTextContainer: {
    marginBottom: 16, // Espacio entre la descripción y el footer
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  cardFooter: {
    // Footer de la tarjeta
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16, // Espacio entre la descripción y el footer
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moreInfoText: {
    fontSize: 14,
    color: "#ec4899", // Color rosa
    fontWeight: "600",
  },
  cardArrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
  },
});
