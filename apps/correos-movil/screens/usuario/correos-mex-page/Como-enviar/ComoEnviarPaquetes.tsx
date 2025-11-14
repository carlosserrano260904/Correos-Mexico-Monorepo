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
  faBoxOpen,
  faBox, 
} from '@fortawesome/free-solid-svg-icons';
import {
  Text, // Tu componente de Texto
  IconButton, // Tu componente de Botón de Icono
} from '../../../../components/ui'; // Ruta a tus componentes UI
import { COLORS, SIZES } from '../../../../utils/theme'; // Ruta a tu theme
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient'; // <-- IMPORTANTE para el gradiente

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
        {description}
      </View>
    </View>
  );
};

/**
 * Pantalla: Cómo Enviar Paquetes
 */
export default function ComoEnviarPaquetes() {
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
            Paquetes
          </Text>
          {/* Espaciador para centrar el título */}
          <View style={{ width: SIZES.button.default }} />
        </View>

        {/* --- Contenido Principal --- */}
        {/* Usamos LinearGradient como el contenedor de la tarjeta */}
        <LinearGradient
          // Gradiente ajustado a un rosa más claro
          colors={['#FFDDEE', '#ffeaf3']} // Cambiado el color inicial
          style={styles.contentWrapper}
        >
          <View style={styles.cardBody}>
            {/* Icono de caja en círculo */}
            <View style={styles.iconBackground}>
              <FontAwesomeIcon
                icon={faBoxOpen} // <-- 1. ICONO ACTUALIZADO
                size={moderateScale(30)}
                color={COLORS.white}
              />
            </View>

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
              Paquetes
            </Text>

            <Text color="default" style={styles.introText}>
              Hacer un envío a través de Correos de México es muy sencillo. Para
              que tu paquete llegue de manera correcta a su destino, sigue estos
              pasos:
            </Text>

            {/* --- Lista de Pasos --- */}

            <StepItem
              number="1"
              title="Asegúrate de que tu envío no contenga objetos prohibidos."
              description={<></>}
            />

            <StepItem
              number="2"
              title="Coloca tus productos en un sobre o una caja"
              description={
                <Text color="default" style={styles.stepDescription}>
                  que se adapte a las necesidades de tu artículo,{' '}
                  <Text fontWeight="bold" style={styles.textHighlight}>
                    pero no lo cierres ni selles
                  </Text>
                  , pues en la Oficina Postal será revisado antes de enviar.
                </Text>
              }
            />

            <StepItem
              number="3"
              title="Rotula tu paquete."
              description={
                <Text color="default" style={styles.stepDescription}>
                  En una de las caras de la caja, coloca a mano o en etiqueta
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
                  {'\n\n'}
                  Ambos deben inscribirse en el siguiente orden: nombre completo,
                  domicilio con calle, número interior o exterior, colonia,
                  código postal, alcaldía o municipio, ciudad o población,
                  entidad federativa.
                </Text>
              }
            />

            <Image
              // Nueva URL de la imagen sin fondo
              source={{
                uri: 'https://correosenmexico.com.mx/wp-content/uploads/2023/05/como-enviar-un-paquete-por-correos-de-mexico.png',
              }}
              style={styles.packageImage} // Usamos un estilo específico para esta imagen
              resizeMode="contain"
            />

            <StepItem
              number="4"
              title="Lleva tu paquete a la Oficina Postal más cercana."
              description={<></>}
            />

            <StepItem
              number="5"
              title="Acude con la caja abierta, tijeras y cinta adhesiva"
              description={
                <Text color="default" style={styles.stepDescription}>
                  para sellarlo una vez revisado.
                </Text>
              }
            />

            <StepItem
              number="6"
              title="Elige el tipo de envío"
              description={
                <Text color="default" style={styles.stepDescription}>
                  (servicio estándar o servicio express MEXPOST) y realiza el
                  pago correspondiente.
                </Text>
              }
            />

            <StepItem
              number="7"
              title="Sella y entrega tu paquete para recibir tu número de guía."
              description={<></>}
            />

            <StepItem
              number="8"
              title="Rastrea tu envío en línea."
              description={<></>}
            />
          </View>
        </LinearGradient>
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
    borderRadius: SIZES.borderRadius.large, // Bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden', // Necesario para que el gradiente respete el borderRadius
  },
  cardBody: {
    padding: moderateScale(20),
  },
  iconBackground: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(60),
    backgroundColor: COLORS.brand, 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', 
    marginBottom: moderateScale(16),
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: moderateScale(2),
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.fontSize.default,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.4,
    marginBottom: moderateScale(4),
  },
  stepDescription: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  textHighlight: {
    color: COLORS.brand, // Texto rosa
    fontWeight: 'bold',
  },
  packageImage: {
    width: '100%',
    height: moderateScale(180),
    alignSelf: 'center', // Para centrar la imagen
    marginVertical: moderateScale(16),
  },
});