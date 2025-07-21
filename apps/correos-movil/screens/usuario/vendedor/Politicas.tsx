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
  Linking
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
  const {title, body, subtitle, body2, link, subtitle2, body3, subtitle3, body4, link2, body5, subtitle4, body6, subtitle5, body7, subtitle6, body8, subtitle7, body9, subtitle8, body10, subtitle9, body11, subtitle10, body12, subtitle11, body13, link3, subtitle12, body14, subtitle13, body15, subtitle14, body16, subtitle15, body17, subtitle16, body18, subtitle17, body19, subtitle18, body20, link4, subtitle19, body21, subtitle20, body22, subtitle21, body23, subtitle22, body24, email, body25, email2, body26, list} = section;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.contentTitle}>{title}</Text>
      {body       && <Text style={styles.contentText}>{body}</Text>}
      {subtitle   && <Text style={styles.contentSubtitle}>{subtitle}</Text>}
      {body2      && <Text style={styles.contentText}>{body2}</Text>}
      {link && (
        <TouchableOpacity onPress={() => Linking.openURL(link)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {link}
          </Text>
        </TouchableOpacity>
      )}
      {subtitle2  && <Text style={styles.contentSubtitle}>{subtitle2}</Text>}
      {body3      && <Text style={styles.contentText}>{body3}</Text>}
      {subtitle3  && <Text style={styles.contentSubtitle}>{subtitle3}</Text>}
      {body4 && <Text style={styles.contentText}>{body4}</Text>}
      {link2 && (
        <TouchableOpacity onPress={() => Linking.openURL(link2)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {link2}
          </Text>
        </TouchableOpacity>
      )}
      {body5 && <Text style={styles.contentText}>{body5}</Text>}
      {subtitle4 && <Text style={styles.contentSubtitle}>{subtitle4}</Text>}
      {body6 && <Text style={styles.contentText}>{body6}</Text>}
      {subtitle5 && <Text style={styles.contentSubtitle}>{subtitle5}</Text>}
      {body7 && <Text style={styles.contentText}>{body7}</Text>}
      {subtitle6 && <Text style={styles.contentSubtitle}>{subtitle6}</Text>}
      {body8 && <Text style={styles.contentText}>{body8}</Text>}
      {subtitle7 && <Text style={styles.contentSubtitle}>{subtitle7}</Text>}
      {body9 && <Text style={styles.contentText}>{body9}</Text>}
      {subtitle8 && <Text style={styles.contentSubtitle}>{subtitle8}</Text>}
      {body10 && <Text style={styles.contentText}>{body10}</Text>}
      {subtitle9 && <Text style={styles.contentSubtitle}>{subtitle9}</Text>}
      {body11 && <Text style={styles.contentText}>{body11}</Text>}
      {subtitle10 && <Text style={styles.contentSubtitle}>{subtitle10}</Text>}
      {body12 && <Text style={styles.contentText}>{body12}</Text>}
      {subtitle11 && <Text style={styles.contentSubtitle}>{subtitle11}</Text>}
      {body13 && <Text style={styles.contentText}>{body13}</Text>}
      {link3 && (
        <TouchableOpacity onPress={() => Linking.openURL(link3)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {link3}
          </Text>
        </TouchableOpacity>
      )}
      {subtitle12 && <Text style={styles.contentSubtitle}>{subtitle12}</Text>}
      {body14 && <Text style={styles.contentText}>{body14}</Text>}
      {subtitle13 && <Text style={styles.contentSubtitle}>{subtitle13}</Text>}
      {body15 && <Text style={styles.contentText}>{body15}</Text>}
      {subtitle14 && <Text style={styles.contentSubtitle}>{subtitle14}</Text>}
      {body16 && <Text style={styles.contentText}>{body16}</Text>}
      {subtitle15 && <Text style={styles.contentSubtitle}>{subtitle15}</Text>}
      {body17 && <Text style={styles.contentText}>{body17}</Text>}
      {subtitle16 && <Text style={styles.contentSubtitle}>{subtitle16}</Text>}
      {body18 && <Text style={styles.contentText}>{body18}</Text>}
      {subtitle17 && <Text style={styles.contentSubtitle}>{subtitle17}</Text>}
      {body19 && <Text style={styles.contentText}>{body19}</Text>}
      {subtitle18 && <Text style={styles.contentSubtitle}>{subtitle18}</Text>}
      {body20 && <Text style={styles.contentText}>{body20}</Text>}
      {link4 && (
        <TouchableOpacity onPress={() => Linking.openURL(link4)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {link4}
          </Text>
        </TouchableOpacity>
      )}
      {subtitle19 && <Text style={styles.contentSubtitle}>{subtitle19}</Text>}
      {body21 && <Text style={styles.contentText}>{body21}</Text>}
      {subtitle20 && <Text style={styles.contentSubtitle}>{subtitle20}</Text>}
      {body22 && <Text style={styles.contentText}>{body22}</Text>}
      {subtitle21 && <Text style={styles.contentSubtitle}>{subtitle21}</Text>}
      {body23 && <Text style={styles.contentText}>{body23}</Text>}
      {subtitle22 && <Text style={styles.contentSubtitle}>{subtitle22}</Text>}
      {body24 && <Text style={styles.contentText}>{body24}</Text>}
      {email && (
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {email}
          </Text>
        </TouchableOpacity>
      )}
      {body25 && <Text style={styles.contentText}>{body25}</Text>}
      {email2 && (
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email2}`)}>
          <Text style={[styles.contentText, { color: '#E6007E', textDecorationLine: 'underline' }]}>
            {email2}
          </Text>
        </TouchableOpacity>
      )}
      {body26 && <Text style={styles.contentText}>{body26}</Text>}
      
      {/* Renderiza la lista numerada */}
      {Array.isArray(list) && list.map((item, i) => (
        <Text key={i} style={styles.listItem}>
          {`${i + 1}. ${item}`}
        </Text>
      ))}
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
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 32,
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
    paddingVertical: 12,
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
