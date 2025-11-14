import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faBoxOpen,
  faFlask,  
  faBomb,  
  faShieldHalved,  
  faFlag,  
  faMoneyBill,  
  faCat,  
  faBurger,  
} from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  Text,
  IconButton,
} from '../../../../components/ui';
import { COLORS, SIZES } from '../../../../utils/theme';
import { moderateScale } from 'react-native-size-matters';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Componente reutilizable para un punto de lista (viñeta con icono)
 */
const BulletItemWithIcon = ({
  icon,
  text,
}: {
  icon: IconProp;
  text: string;
}) => {
  return (
    <View style={styles.bulletContainer}>
      {/* Círculo rosa pálido */}
      <View style={styles.bulletCircle}>
        <FontAwesomeIcon
          icon={icon}
          size={moderateScale(16)}
          color={COLORS.brand}  
        />
      </View>
      {/* Contenido de texto */}
      <View style={styles.bulletTextWrapper}>
        <Text style={styles.bulletText}>{text}</Text>
      </View>
    </View>
  );
};

/**
 * Pantalla: Artículos Prohibidos
 */
export default function ComoEnviarArticulosProhibidos() {
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
            Artículos Prohibidos
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
              Artículos Prohibidos
            </Text>

            <Text color="default" style={styles.introText}>
              De conformidad con lo establecido en el Artículo 15 de la Ley del
              Servicio Postal Mexicano, queda prohibida la circulación por correo
              de los siguientes envíos y correspondencia de los siguientes
              productos:
            </Text>

            {/* --- Lista de Artículos Prohibidos (Iconos actualizados) --- */}

            <BulletItemWithIcon
              icon={faBomb}
              text="Los que contengan materias corrosivas, inflamables, explosivas o cualquier otra que puedan causar daños."
            />
            <BulletItemWithIcon
              icon={faBurger}
              text="Los que contengan materias corrosivas, inflamables, explosivas o cualquier otra que puedan causar daños."
            />
            <BulletItemWithIcon
              icon={faShieldHalved}  
              text="Los que presumiblemente puedan ser utilizados en la comisión de un delito."
            />
            <BulletItemWithIcon
              icon={faFlag}  
              text="Los que sean ofensivos o denigrantes para la Nación."
            />
            <BulletItemWithIcon
              icon={faMoneyBill}  
              text="Los que contengan billetes o anuncios de loterías extranjeras y, en general, de juegos prohibidos como texto principal. Si se trata de envíos o correspondencia internacional, se estará a lo dispuesto por el Artículo 29."
            />
            <BulletItemWithIcon
              icon={faCat}  
              text="Los que contengan animales vivos."
            />
            <BulletItemWithIcon
              icon={faFlask}
              text="Los que contengan sustancias ilegales, psicotrópicos o estupefacientes."
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
    marginBottom: moderateScale(16),
  },
  introText: {
    textAlign: 'center',
    marginTop: moderateScale(4),
    marginBottom: moderateScale(24),
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
  },
  // --- Estilos para viñetas (BulletItemWithIcon) ---
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: moderateScale(20),  
  },
  bulletCircle: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: 'rgba(222, 20, 132, 0.1)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
    marginTop: moderateScale(2),
  },
  bulletTextWrapper: {
    flex: 1,
  },
  bulletText: {
    fontSize: SIZES.fontSize.default,
    lineHeight: SIZES.fontSize.default * 1.5,
    color: COLORS.foreground,  
  },
});