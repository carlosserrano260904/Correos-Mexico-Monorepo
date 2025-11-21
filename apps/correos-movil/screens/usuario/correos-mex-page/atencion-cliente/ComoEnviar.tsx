import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const articulos = [
  {
    icon: 'bomb',
    text: 'Los que contengan materias corrosivas, inflamables, explosivas o cualquier otra que puedan causar daños.',
  },
  {
    icon: 'hamburger',
    text: 'Los que contienen materias corrosivas, inflamables, explosivos o cualquiera que puedan causar daños.',
  },
  {
    icon: 'shield-alt',
    text: 'Los que presumiblemente puedan ser utilizados en la comisión de un delito.',
  },
  {
    icon: 'flag',
    text: 'Los que sean ofensivos o denigrantes para la Nación.',
  },
  {
    icon: 'ticket-alt',
    text: 'Los que contengan billetes o anuncios de loterías extranjeras y, en general, de juegos prohibidos como texto principal. Si se trata de envíos o correspondencia internacional, se estará a lo dispuesto por el Artículo 29.',
  },
  {
    icon: 'cat',
    text: 'Los que contengan animales vivos.',
  },
  {
    icon: 'prescription-bottle',
    text: 'Los que contengan sustancias ilegales, psicotrópicas o estupefacientes.',
  },
];

interface ArticleItemProps {
  text: string;
  iconName: string;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ text, iconName }) => (
  <View style={styles.articleTextContainer}>
    <View style={styles.articleIconCircle}>
      <FontAwesome5 name={iconName as any} size={16} color="#FF4F87" />
    </View>
    <Text style={styles.articleText}>{text}</Text>
  </View>
);

const HeaderCard = () => (
  <View style={styles.headerCard}>
    <View style={styles.headerIconCircle}>
      <Ionicons name="cube-outline" size={24} color="#fff" />
    </View>
    <Text style={styles.headerTitle}>Artículos Prohibidos</Text>
  </View>
);

const bodyIntroText =
  'De conformidad con lo establecido en el Artículo 15 de la Ley del Servicio Postal Mexicano, queda prohibida la circulación por correo de los siguientes envíos y correspondencia de los siguientes productos:';

interface AppProps {
  navigation?: {
    goBack: () => void;
  };
}

const App: React.FC<AppProps> = ({ navigation }) => {
  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        {/* Header superior */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Artículos Prohibidos</Text>
        </View>

        {/* Tarjeta principal */}
        <View style={styles.whiteContainer}>
          <LinearGradient
            colors={['#FF4F87', '#F9E2EC']} // Degradado rosa (bordes + fondo)
            style={styles.gradientBorder}
          >
            <View style={styles.gradientInner}>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <HeaderCard />
                <Text style={styles.bodyText}>{bodyIntroText}</Text>

                <View style={styles.listContainer}>
                  {articulos.map((articulo, index) => (
                    <ArticleItem
                      key={index.toString()}
                      text={articulo.text}
                      iconName={articulo.icon}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 16,
  },

  topHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },

  whiteContainer: {
    marginTop: 16,
    marginBottom: 16,
    flex: 1,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2,
    flex: 1,
  },
  gradientInner: {
    borderRadius: 14,
    backgroundColor: 'transparent', // ← dejamos ver el degradado también adentro
    paddingHorizontal: 20,
    paddingVertical: 24,
    flex: 1,
    position: 'relative',
  },

  scrollContent: {
    paddingBottom: 100,
  },

  headerCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF007A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#000000ff',
  },

  bodyText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 45,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    marginTop: 6,
  },
  articleTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  articleIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    flexShrink: 0,
  },
  articleText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    lineHeight: 21,
  },

  bottomNavContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 8,
    alignItems: 'center',
  },
  bottomNav: {
    backgroundColor: 'white',
    borderRadius: 999,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  bottomNavItem: {
    padding: 4,
  },
});

export default App;
