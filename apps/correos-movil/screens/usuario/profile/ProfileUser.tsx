import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { idUser, usuarioPorId } from '../../../api/profile';
import { RootStackParamList, SchemaProfileUser } from '../../../schemas/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'ProfileUser'>;

export default function ProfileUser() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<ProfileNavProp>();
  const [usuario, setUsuario] = useState<SchemaProfileUser | null>(null);

  useEffect(() => {
    if (!isFocused) return;  
    (async () => {
      try {
        const perfil = await usuarioPorId(idUser);
        setUsuario(perfil);
      } catch {
        console.log('No se ha podido cargar el perfil aqui componente ');
      }
    })();
  }, [isFocused]); // <-- mejor dejar el array vacío para que no itere constantemente

  const sections = [
    {
      title: 'Cuenta',
      items: [
        { label: 'Mis pedidos', icon: 'box', to: 'Pedidos' },
        { label: 'Mis compras', icon: 'shopping-bag', to: 'MisCompras' },
      ],
    },
    {
      title: 'Información de pago',
      items: [
        { label: 'Mis direcciones', icon: 'map-pin', to: 'Direcciones' },
        { label: 'Mis tarjetas', icon: 'credit-card', to: 'Tarjetas' },
      ],
    },
    {
      title: 'Políticas',
      items: [
        { label: 'Uso', icon: 'file-text', to: 'Uso' },
        { label: 'Privacidad', icon: 'file-text', to: 'Privacidad' },
        { label: 'Devoluciones', icon: 'file-text', to: 'Devoluciones' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        {/* Cabecera "Mi perfil" */}
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            if (usuario) {
              navigation.navigate('UserDetailsScreen', { user: usuario });
              console.log(usuario)
            }
          }}
        >
          <Image source={{ uri: usuario?.imagen }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>
              {usuario?.nombre} {usuario?.apellido}
            </Text>
            <View style={styles.subtitleRow}>
              <Text style={styles.subtitle}>Mi perfil</Text>
              <Icon name="chevron-right" size={16} style={styles.chevron} />
            </View>
          </View>
        </TouchableOpacity>

        {sections.map((sec, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            {sec.items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.item}
                onPress={() => navigation.navigate(item.to)} // ← aquí
              >
                <View style={styles.itemLeft}>
                  <Icon name={item.icon} size={20} />
                  <Text style={styles.itemText}>{item.label}</Text>
                </View>
                <Icon name="chevron-right" size={20} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#E6007A',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
  },
  chevron: {
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
