import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { idUser, usuarioPorId } from '../../../api/profile';
import { RootStackParamList, SchemaProfileUser } from '../../../schemas/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from 'react-native-size-matters';
import { useClerk, useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { myIp } from '../../../api/miscompras';

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'ProfileUser'>;

export default function ProfileUser() {
  const isFocused = useIsFocused();
  const navigation = useNavigation<ProfileNavProp>();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [usuario, setUsuario] = useState<SchemaProfileUser | null>(null);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
  try {
    const storedId = await AsyncStorage.getItem('userId');
    if (storedId) {
      const perfil = await usuarioPorId(parseInt(storedId));
      setUsuario(perfil);
    } else {
      console.warn('No se encontró userId en AsyncStorage');
    }
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  }
})();

  }, [isFocused]);

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await signOut();
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', JSON.stringify(err, null, 2));
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user?.id) {
        console.error('No se pudo obtener el ID del usuario');
        return;
      }
      console.log(`Eliminando: http://${myIp}:3000/api/clerk/delete-user/${user.id}`);
      const response = await axios.delete(`http://${myIp}:3000/api/clerk/delete-user/${user.id}`);

      if (response.status === 200) {
        console.log('Cuenta eliminada correctamente.');
        await handleSignOut();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error eliminando la cuenta:', error.response?.data || error.message);
      } else {
        console.error('Error desconocido al eliminar la cuenta:', error);
      }
    }
  };

  const sections = [
    {
      title: 'Cuenta',
      items: [
        { label: 'Publicar producto', icon: 'box', to: 'PublicarProducto' },
        { label: 'Mis compras', icon: 'shopping-bag', to: 'MisCompras' },
      ],
    },
    {
      title: 'Información de pago',
      items: [
        { label: 'Mis direcciones', icon: 'map-pin', to: 'Direcciones' },
        { label: 'Mis tarjetas', icon: 'credit-card', to: 'MisTarjetasScreen' },
        { label: 'Mis pedidos', icon: 'truck', to: 'ListaPedidosScreen' },
      ],
    },
    {
      title: 'Políticas',
      items: [
        { label: 'Prueba productos', icon: 'file-text', to: 'Productos' },
        { label: 'Terminos y condiciones', icon: 'file-text', to: 'Politicas' },
      ],
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E6007A" />
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => usuario && navigation.navigate('UserDetailsScreen', { user: usuario })}
          >
            <Image source={{ uri: usuario?.imagen }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {usuario?.nombre} {usuario?.apellido}
              </Text>
              <View style={styles.subtitleRow}>
                <Text style={styles.subtitle}>Mi perfil</Text>
                <Icon
                  name="chevron-right"
                  size={16}
                  color="#fff"
                  style={{ marginLeft: moderateScale(4) }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.contentSafe}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          {sections.map((sec, si) => (
            <View key={si} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.item}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate(item.to)}
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

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={handleSignOut}
            >
              <View style={styles.itemLeft}>
                <Icon name="log-out" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Cerrar sesión</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={deleteAccount}
            >
              <View style={styles.itemLeft}>
                <Icon name="trash-2" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Eliminar cuenta</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: '#E6007A',
  },
  contentSafe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: moderateScale(16),
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#fff',
  },
  textContainer: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: moderateScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(24),
    paddingBottom: moderateScale(120),
  },
  section: {
    marginBottom: moderateScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: moderateScale(12),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: moderateScale(14),
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: moderateScale(16),
    marginLeft: moderateScale(10),
  },
});