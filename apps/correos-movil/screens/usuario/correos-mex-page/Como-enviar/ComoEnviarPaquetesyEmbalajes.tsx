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
} from '@fortawesome/free-solid-svg-icons';
import {
  Text,
  IconButton,
  Button,
} from '../../../../components/ui';
import { COLORS, SIZES } from '../../../../utils/theme';
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';

// Definición de colores locales
const COLOR_GREEN = '#6EBF3B';
const COLOR_MAROON = '#C21E56';
const COLOR_PINK_BULLET = COLORS.brand;

/**
 * Componente reutilizable para un punto de lista (viñeta)
 */
const BulletItem = ({
  text,
  color,
  children,
}: {
  text?: string;
  color: string;
  children?: React.ReactNode;
}) => {
  return (
    <View style={styles.bulletContainer}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <View style={styles.bulletTextWrapper}>
        {text && <Text style={styles.bulletText}>{text}</Text>}
        {children}
      </View>
    </View>
  );
};

/**
 * Componente reutilizable para pasos numerados
 */
const NumberedStep = ({
  number,
  text,
  color,
}: {
  number: string;
  text: string;
  color: string;
}) => {
  return (
    <View style={styles.stepContainer}>
      <View style={[styles.stepNumberCircle, { backgroundColor: color }]}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.bulletTextWrapper}>
        <Text style={styles.bulletText}>{text}</Text>
      </View>
    </View>
  );
};

/**
 * Pantalla: Cómo Enviar Paquetes y Embalajes
 */
export default function ComoEnviarPaquetesyEmbalajes() {
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
            type="secondary"
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
            Empaques y Embalajes
          </Text>
          {/* Espaciador para centrar el título */}
          <View style={{ width: SIZES.button.default }} />
        </View>

        {/* --- Contenido Principal (Tarjeta con Gradiente) --- */}
        <LinearGradient
          colors={['#FFDDEE', '#FFF8FA']}
          style={styles.contentWrapper}
        >
          <View style={styles.cardBody}>
            {/* Icono de caja en círculo */}
            <View style={styles.iconBackground}>
              <FontAwesomeIcon
                icon={faBoxOpen}
                size={moderateScale(30)}
                color={COLORS.white}
              />
            </View>

            {/* Títulos */}
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
              style={[styles.title, { color: COLORS.brand }]}
            >
              Empaques y Embalajes
            </Text>

            <Text color="default" style={styles.introText}>
              Garantiza la entrega adecuada y segura de tus empaques y embalajes
              tomando en cuenta las siguientes recomendaciones:
            </Text>

            {/* --- Sección Asegura --- */}
            <Button
              size="default"
              style={[styles.sectionButton, { backgroundColor: COLORS.brand }]}
            >
              Asegura
            </Button>
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Elije un empaque que cubra las necesidades de tu envío (tamaño, peso, fragilidad)."
            />
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Utiliza cajas de cartón corrugado suficientemente resistentes y en buen estado."
            />
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Sella con cintas especiales de embalaje (como cintas adhesivas de polipropileno, vinilo o reforzadas)."
            />

            {/* --- Sección Protege --- */}
            <Button
              size="default"
              style={[styles.sectionButton, { backgroundColor: COLOR_GREEN }]}
            >
              Protege
            </Button>
            <Text color="default" style={styles.sectionText}>
              Para amortiguar y evitar posibles que vibraciones, sacudidas o
              impactos dañen tu producto, deja un espacio de aproximadamente 5
              cm entre el artículo y las caras de la caja, y rellénalo con
              material de embalaje. Como:
            </Text>
            <BulletItem
              color={COLOR_GREEN}
              text="Burbujas de aire sellado."
            />
            <BulletItem
              color={COLOR_GREEN}
              text="Espumas de baja densidad."
            />
            <BulletItem color={COLOR_GREEN} text="Bolsas de aire." />
            <BulletItem color={COLOR_GREEN} text="Cartón corrugado." />

            {/* --- Sección Restricciones --- */}
            <Button
              size="default"
              style={[styles.sectionButton, { backgroundColor: COLOR_MAROON }]}
            >
              Restricciones
            </Button>
            <BulletItem
              color={COLOR_MAROON}
              text="No utilices cajas de regalo, cajas de huevo o cajas usadas que estén rayadas o  dañadas."
            />
            <BulletItem
              color={COLOR_MAROON}
              text="No utilices bolsas de plástico que impidan la visibilidad de la caja o del sobre."
            />
            <BulletItem
              color={COLOR_MAROON}
              text="No obstruyas la lectura de los datos del remitente y del destinatario al sellar el paquete o al colocar las guías."
            />

            {/* --- Sección Pesos y Medidas --- */}
            <Text
              size="xl"
              fontWeight="800"
              color="title"
              style={styles.sectionTitle}
            >
              Pesos y medidas de los envíos
            </Text>
            <Text color="default" style={styles.sectionText}>
              Toma en cuenta los límites de peso de acuerdo a las características
              de tu envío. Para efectos de cobro se aplicará el peso mayor.
            </Text>
            <Text
              fontWeight="800"
              color="title"
              style={styles.subSectionTitle}
            >
              Nacional (MEXPOST)
            </Text>
            <BulletItem color={COLOR_PINK_BULLET}>
              <Text style={styles.bulletText}>
                <Text fontWeight="bold" style={{ color: COLORS.brand }}>
                  Peso real máximo:
                </Text>
                {' 25 kg.'}
              </Text>
            </BulletItem>
            <BulletItem color={COLOR_PINK_BULLET}>
              <Text style={styles.bulletText}>
                <Text fontWeight="bold" style={{ color: COLORS.brand }}>
                  Peso volumétrico:
                </Text>
                {' 25 kg.'}
              </Text>
            </BulletItem>

            <Text
              fontWeight="800"
              color="title"
              style={styles.subSectionTitle}
            >
              Internacional (MEXPOST)
            </Text>
            <BulletItem color={COLOR_PINK_BULLET}>
              <Text style={styles.bulletText}>
                <Text fontWeight="bold" style={{ color: COLORS.brand }}>
                  Peso real máximo:
                </Text>
                {' 20 kg.'}
              </Text>
            </BulletItem>
            <BulletItem color={COLOR_PINK_BULLET}>
              <Text style={styles.bulletText}>
                <Text fontWeight="bold" style={{ color: COLORS.brand }}>
                  Peso volumétrico:
                </Text>
                {' 30 kg.'}
              </Text>
            </BulletItem>

            {/* --- Sección Tips de Embalaje --- */}
            <Text
              size="xl"
              fontWeight="800"
              color="title"
              style={[
                styles.sectionTitle,
                { textAlign: 'left', alignSelf: 'flex-start' },
              ]}
            >
              Tips de embalaje
            </Text>
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Si envías varios artículos en la misma caja, envuélvelos por separado."
            />
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Utiliza cajas de doble capa para artículos frágiles o pesados."
            />
            <BulletItem
              color={COLOR_PINK_BULLET}
              text="Sella tu caja con el método H de encintado:"
            />

            {/* Lista numerada anidada */}
            <View style={{ marginLeft: moderateScale(20) }}>
              <NumberedStep
                number="1"
                text="Aplica cinta adhesiva de embalaje sobre las solapas centrales de la caja (superiores e inferiores)."
                color={COLOR_PINK_BULLET}
              />
              <NumberedStep
                number="2"
                text="Sella todos los bordes plegables para terminar de cerrarla."
                color={COLOR_GREEN}
              />
            </View>

            <BulletItem color={COLOR_PINK_BULLET}>
              <Text style={styles.bulletText}>
                Acude a la Oficina Postal con tijeras y cinta adhesiva para
                sellar tu envío,{' '}
                <Text fontWeight="bold" style={{ color: COLOR_PINK_BULLET }}>
                  recuerda que deberás presentar el empaque abierto para una
                  revisión de seguridad.
                </Text>
              </Text>
            </BulletItem>
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
    backgroundColor: COLORS.surface,  
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
    backgroundColor: COLORS.background,  
  },
  headerTitle: {
    // Título centrado
  },
  contentWrapper: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
    borderRadius: SIZES.borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: 'hidden',
  },
  cardBody: {
    padding: moderateScale(20),
  },
  iconBackground: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
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
    marginBottom: moderateScale(20),
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  sectionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(60),
    paddingVertical: moderateScale(10),
    marginVertical: moderateScale(16),
  },
  sectionText: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
    marginBottom: moderateScale(12),
  },
  sectionTitle: {
    textAlign: 'center',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(12),
  },
  subSectionTitle: {
    marginTop: moderateScale(16),
    marginBottom: moderateScale(8),
    fontSize: SIZES.fontSize.default,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScale(12), 
  },
  bulletDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    marginRight: moderateScale(10),
    marginTop: moderateScale(6),
  },
  bulletTextWrapper: {
    flex: 1,
  },
  bulletText: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScale(12),
  },
  stepNumberCircle: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
    marginTop: moderateScale(2),
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.fontSize.small,
  },
});