import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importar tipo
import type { RootStackParamList } from '../../../../schemas/schemas'; // Importar ParamList
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  Text,
  IconButton,
  Card,
  CardContent,
} from '../../../../components/ui';
import { COLORS, SIZES } from '../../../../utils/theme';
import { moderateScale } from 'react-native-size-matters';

// Datos para las tarjetas (links se mantienen, screens actualizados)
const guideItems = [
  {
    title: 'Cómo enviar una carta',
    description: 'Pasos a seguir para enviar correspondencia.',
    image:
      'https://scontent.cdninstagram.com/v/t51.82787-15/564354493_18295934026266752_3395425023507993379_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=Mzc0MTk2ODI2ODI3MDYxNjI0MQ%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEzNDl4MTY4NS5zZHIuQzMifQ%3D%3D&_nc_ohc=Sa4uUxKPGPYQ7kNvwEPiSK0&_nc_oc=Admfqn0sIqWBAOFtFHEJbmLINj-BpHU4DRj6TdYaFDEei5hZnb9udPomG4Ij2Y0DOLlClvikuvHpNl3BzA-P3iGN&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=UiQhFnQ6RXYF_icLfJ91nA&oh=00_Afhgaow3gXs-xRDwMAs4cVajLUHWRhOmEGDDGV6Z57hHLw&oe=6911F581',
    screen: 'ComoEnviarCartas', // Corregido
  },
  {
    title: 'Cómo enviar un paquete',
    description: 'Pasos a seguir para enviar paquetería.',
    image:
      'https://www.cbiz.com/wp-content/uploads/insights-outlook-into-the-manufacturing-insurance.jpg',
    screen: 'ComoEnviarPaquetes', // Corregido
  },
  {
    title: 'Cómo enviar empaques y embalajes',
    description: '¿Cómo empaquetar correctamente?',
    image:
      'https://http2.mlstatic.com/D_NQ_NP_2X_649609-MLM85172650015_052025-F.webp',
    screen: 'ComoEnviarPaquetesyEmbalajes', // Corregido
  },
  {
    title: 'Artículos prohibidos',
    description:
      'Conoce la lista completa de artículos que no está permitido enviar.',
    image:
      'https://media.istockphoto.com/id/997946456/es/foto/cerrar-vista-de-copa-de-sambuca-de-alcohol-en-vidrio-sobre-fondo-negro.jpg?s=170667a&w=0&k=20&c=Kk3yla0YFDv2J2-AnYMJQiYnL_RK72eGJvRvuQFN88o=',
    screen: 'ComoEnviarArticulosProhibidos', // Corregido
  },
];

/**
 * Componente de tarjeta reutilizable para la guía
 */
const GuideCard = ({
  item,
  onPress,
}: {
  item: typeof guideItems[0];
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card type="secondary" style={styles.guideCard}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <CardContent style={styles.cardContent}>
          <Text
            size="large"
            fontWeight="bold"
            color="title"
            style={styles.cardTitle}
          >
            {item.title}
          </Text>
          <View style={styles.bottomRow}>
            <Text
              size="default"
              color="muted"
              style={styles.descriptionText}
            >
              {item.description}
            </Text>
            <IconButton
              type="default"
              size="small"
              round={true}
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                size={moderateScale(16)}
                color={COLORS.white}
              />
            </IconButton>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

// Definir el tipo de navegación
type ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Pantalla: Cómo Enviar y Recibir Paquetes
 */
export default function ComoEnviar() {
  const navigation = useNavigation<ScreenNavigationProp>();

  const handleCardPress = (screenName: keyof RootStackParamList) => {
    console.log(`Navegando a: ${screenName}`);
    navigation.navigate(screenName as any); // Usamos 'as any' para compatibilidad
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.header}>
            <IconButton
              type="secondary"
              size="default"
              round={true}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                size={moderateScale(18)}
                color={COLORS.foreground}
              />
            </IconButton>

            <Text
              size="xl"
              fontWeight="bold"
              color="title"
              style={styles.headerTitle}
            >
              Cómo{'\n'}enviar{'\n'}y recibir{'\n'}paquetes
            </Text>
          </View>

          {guideItems.map((item, index) => (
            <GuideCard
              item={item}
              key={index}
              onPress={() => handleCardPress(item.screen as keyof RootStackParamList)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop:
      Platform.OS === 'android' ? moderateScale(24) : moderateScale(8),
    paddingBottom: moderateScale(8),
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(34),
    lineHeight: moderateScale(40),
    marginLeft: moderateScale(16),
  },
  scrollContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(16),
  },
  guideCard: {
    marginBottom: moderateScale(16),
    padding: 0,
    overflow: 'hidden',
    borderRadius: 25,
  },
  cardImage: {
    width: '100%',
    height: moderateScale(150),
    backgroundColor: COLORS.border,
  },
  cardContent: {
    marginTop: 0,
    padding: moderateScale(16),
  },
  cardTitle: {
    marginBottom: moderateScale(8),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: moderateScale(4),
  },
  descriptionText: {
    flex: 1,
    paddingRight: moderateScale(16),
  },
});