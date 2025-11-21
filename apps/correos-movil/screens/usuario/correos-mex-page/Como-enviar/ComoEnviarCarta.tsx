import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faEnvelope, // Icono para el círculo rosa
} from '@fortawesome/free-solid-svg-icons';
import {
  Text, // Tu componente de Texto
  IconButton, // Tu componente de Botón de Icono
} from '../../../../components/ui'; // Ruta a tus componentes UI
import { COLORS, SIZES } from '../../../../utils/theme'; // Ruta a tu theme
import { moderateScale } from 'react-native-size-matters';

/**
 * Componente reutilizable para cada paso numerado
 */
const StepItem = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: React.ReactNode;
}) => {
  return (
    <View style={styles.stepContainer}>
      {/* Círculo numerado */}
      <View style={styles.stepNumberCircle}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      {/* Contenido de texto */}
      <View style={styles.stepContent}>
        <Text
          size="default"
          fontWeight="bold"
          color="title"
          style={styles.stepTitle}
        >
          {title}
        </Text>
        {/* El 'description' puede ser un string o un componente de Texto con anidación */}
        {description}
      </View>
    </View>
  );
};

/**
 * Pantalla: Cómo Enviar Cartas (Correspondencia)
 */
export default function ComoEnviarCartas() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* --- Header --- */}
        <View style={styles.header}>
          <IconButton
            type="secondary" // Fondo gris claro
            size="default"
            round={true}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={moderateScale(18)}
              color={COLORS.foreground}
            />
          </IconButton>
          <Text
            size="large"
            fontWeight="bold"
            color="title"
            style={styles.headerTitle}
          >
            Correspondencia
          </Text>
          {/* Espaciador para centrar el título */}
          <View style={{ width: SIZES.button.default }} />
        </View>

        {/* --- Contenido Principal --- */}
        <View style={styles.contentWrapper}>
          {/* --- Cabecera de la Tarjeta (Rosa) --- */}
          {/* --- SECCIÓN ELIMINADA --- */}

          {/* --- Cuerpo de la Tarjeta --- */}
          <View style={styles.cardBody}>
            <Text
              size="xl"
              fontWeight="bold"
              color="title"
              style={styles.title}
            >
              Pasos para enviar
            </Text>
            <Text
              size="xl"
              fontWeight="bold"
              style={[styles.title, { color: COLORS.brand }]} // Color rosa
            >
              Correspondencia
            </Text>

            <Text color="default" style={styles.introText}>
              Hacer un envío a través de Correos de México es muy sencillo. Para
              que tu correspondencia llegue de manera correcta a su destino,
              sigue estos pasos:
            </Text>

            {/* --- Lista de Pasos --- */}

            <StepItem
              number="1"
              title="Rotula el sobre."
              description={
                <Text color="default" style={styles.stepDescription}>
                  En el anverso del sobre (frente), coloca a mano o en etiqueta
                  adherible los datos de:
                  {'\n'}•{' '}
                  <Text fontWeight="bold" style={styles.textHighlight}>
                    Remitente
                  </Text>{' '}
                  (persona que envía) en la esquina superior izquierda.
                  {'\n'}•{' '}
                  <Text fontWeight="bold" style={styles.textHighlight}>
                    Destinatario
                  </Text>{' '}
                  (persona que recibe) en el centro inferior derecho.
                </Text>
              }
            />

            <Image
              source={{
                uri: 'https://correosenmexico.com.mx/wp-content/uploads/2023/05/como-enviar-una-carta-por-correos-de-mexico.png', // URL de la imagen del sobre
              }}
              style={styles.envelopeImage}
              resizeMode="contain"
            />

            <StepItem
              number="2"
              title="Lleva tu carta a la Oficina Postal más cercana."
              description={<></>} // Sin descripción
            />

            <StepItem
              number="3"
              title="Elige la modalidad de envío"
              description={
                <Text color="default" style={styles.stepDescription}>
                  (servicio estándar o servicio express MEXPOST) y realiza el
                  pago correspondiente.
                </Text>
              }
            />

            <StepItem
              number="4"
              title="Coloca la estampilla de franqueo postal"
              description={
                <Text color="default" style={styles.stepDescription}>
                  en la esquina superior derecha.
                </Text>
              }
            />

            <StepItem
              number="5"
              title="Deposita tu carta."
              description={
                <Text color="default" style={styles.stepDescription}>
                  (Si agregaste el servicio adicional de Correo Registrado,
                  recibirás un número de seguimiento).
                </Text>
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface, // Fondo gris claro de la pantalla
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: moderateScale(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop:
      Platform.OS === 'android' ? moderateScale(24) : moderateScale(8),
    paddingBottom: moderateScale(16),
    backgroundColor: COLORS.background, // Header blanco
  },
  headerTitle: {
    // Título centrado
  },
  contentWrapper: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    backgroundColor: '#fbe7f2', // <-- CAMBIADO A ROSA PASTEL
    borderRadius: SIZES.borderRadius.large, // Bordes redondeados
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  // --- ESTILOS cardHeader y iconBackground ELIMINADOS ---
  cardBody: {
    padding: moderateScale(20),
  },
  title: {
    textAlign: 'center',
    lineHeight: SIZES.fontSize.xl * 1.2,
  },
  introText: {
    textAlign: 'center',
    marginTop: moderateScale(16),
    marginBottom: moderateScale(24),
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  // Estilos para el StepItem
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinear al inicio
    marginBottom: moderateScale(20),
  },
  stepNumberCircle: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.brand, // Círculo rosa
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
    marginTop: moderateScale(2), // Ajuste vertical
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.fontSize.default,
  },
  stepContent: {
    flex: 1, // Ocupar el resto del espacio
  },
  stepTitle: {
    fontSize: SIZES.fontSize.default, // Ajustado a 'default'
    lineHeight: SIZES.fontSize.default * 1.4,
    marginBottom: moderateScale(4),
  },
  stepDescription: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  textHighlight: {
    color: COLORS.brand, // Texto rosa para Remitente/Destinatario
    fontWeight: 'bold',
  },
  envelopeImage: {
    width: '100%',
    height: moderateScale(180),
    borderRadius: SIZES.borderRadius.default,
    backgroundColor: COLORS.surface,
    marginVertical: moderateScale(16),
  },
});