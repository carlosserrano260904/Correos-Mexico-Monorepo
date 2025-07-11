// Politicas.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import politicasData from '../../../assets/politicas.json'; 

// Dinámicamente obtenemos claves y títulos desde el JSON
enum SectionKey {
  general = 'general',
  condiciones = 'condiciones',
  devoluciones = 'devoluciones',
  acceso = 'acceso',
}

const sections = Object.keys(politicasData).map(key => ({
  key,
  label: politicasData[key].title,
}));

export default function PoliticasDeUso({ navigation }) {
  const [selected, setSelected] = useState<string>(sections[0].key);

  const renderContent = () => {
  // Carga la sección completa
  const section = politicasData[selected];

  // Desestructura sólo los campos que realmente existan
  const {title, subtitle, body, subtitle2, body2, subtitle3, body3, list, body4, subtitle4, body5, subtitle5, body6 } = section;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.contentTitle}>{title}</Text>

      {subtitle   && <Text style={styles.contentSubtitle}>{subtitle}</Text>}
      {body       && <Text style={styles.contentText}>{body}</Text>}
      {subtitle2  && <Text style={styles.contentSubtitle}>{subtitle2}</Text>}
      {body2      && <Text style={styles.contentText}>{body2}</Text>}
      {subtitle3  && <Text style={styles.contentSubtitle}>{subtitle3}</Text>}
      {body3      && <Text style={styles.contentText}>{body3}</Text>}
      {/* Renderiza la lista numerada */}
      {Array.isArray(list) && list.map((item, i) => (
        <Text key={i} style={styles.listItem}>
          {`${i + 1}. ${item}`}
        </Text>
      ))}
      {body4 && <Text style={styles.contentText}>{body4}</Text>}
      {subtitle4 && <Text style={styles.contentSubtitle}>{subtitle4}</Text>}
      {body5 && <Text style={styles.contentText}>{body5}</Text>}
      {subtitle5 && <Text style={styles.contentSubtitle}>{subtitle5}</Text>}
      {body6 && <Text style={styles.contentText}>{body6}</Text>}

      {/* Si hay más contenido, puedes agregarlo aquí */}
    </View>
  );
};


  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#E6007E" />
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Políticas de Uso</Text>
        <View style={styles.backButton} />
      </SafeAreaView>

      <View style={styles.navWrapper}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.navContainer}
          showsHorizontalScrollIndicator={false}
        >
          {sections.map(sec => (
            <TouchableOpacity
              key={sec.key}
              style={[
                styles.navItem,
                selected === sec.key && styles.navItemActive,
              ]}
              onPress={() => setSelected(sec.key)}
            >
              <Text
                style={[
                  styles.navText,
                  selected === sec.key && styles.navTextActive,
                ]}
              >
                {sec.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6007E',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  listItem: {
  lineHeight: 20,
  marginBottom: 8,
  color: '#444',
},
  navWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navItem: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  navItemActive: {
    borderColor: '#E6007E',
  },
  navText: {
    fontSize: 14,
    color: '#333',
  },
  navTextActive: {
    color: '#E6007E',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  contentSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
});
