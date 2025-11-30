import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { usuarioPorId } from '../../../api/profile';
import { RootStackParamList, SchemaProfileUser } from '../../../schemas/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from 'react-native-size-matters';
import axios from 'axios';
import { useMyAuth } from '../../../context/AuthContext';
import { useUser } from '@clerk/clerk-expo';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../../components/common/Loader';


type SectionItem = {
  label: string;
  icon: string;
  to: keyof RootStackParamList;
  params?: Record<string, any>;
};

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'ProfileUser'>;

export default function ProfileUser({ navigation }: { navigation: ProfileNavProp }) {
  const isFocused = useIsFocused();
  const { logout, userId, userRol } = useMyAuth();
  const { user } = useUser();
  const [usuario, setUsuario] = useState<SchemaProfileUser | null>(null);

  useEffect(() => {
    if (!isFocused) return;

    (async () => {

      try {
        if (userId && userRol) {
          const perfil = await usuarioPorId(parseInt(userId, 10));
          setUsuario(perfil);
          console.log('Rol del usuario:', userRol);
        } else {
          console.warn('⚠️ No se encontró userId en AuthContext');
        }
      } catch (error) {
        console.error('❌ Error al cargar el perfil:', error);
      }
    })();
  }, [isFocused]);

  
if (!usuario) {
  return <Loader message="Cargando tu perfil..." />;
}


  const handleSignOut = async () => {
    try {
      await logout();
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
      const response = await axios.delete(
        `http://${process.env.EXPO_PUBLIC_API_URL}/api/clerk/delete-user/${user.id}`
      );

      if (response.status === 200) {
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

  const sections: { title: string; items: SectionItem[] }[] = [
    {
      title: 'Cuenta',
      items: [
        { label: 'Mis compras', icon: 'shopping-bag', to: 'MisCompras' },
        { label: 'Mis cupones', icon: 'tag', to: 'MisCuponesScreen' },
      ],
    },
    {
      title: 'Información de pago',
      items: [
        { label: 'Mis direcciones', icon: 'map-pin', to: 'Direcciones' },
        { label: 'Mis tarjetas', icon: 'credit-card', to: 'MisTarjetasScreen' },
        { label: 'Mis pedidos', icon: 'truck', to: 'ListaPedidosScreen' },
        { label: 'Historial de Facturas', icon: 'file-text', to: 'HistorialDeFacturas' },
      ],
    },
    {
      title: 'Políticas',
      items: [
        { label: 'Términos y condiciones', icon: 'file-text', to: 'Politicas', params: { key: 'docs/politicas.docx' } },
      ],
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E6007A" translucent={false} />

      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => usuario && navigation.navigate('UserDetailsScreen', { user: usuario })}
          >
            <Image
              source={{
                uri:
                  usuario?.imagen?.startsWith('http')
                    ? usuario.imagen
                    : `${process.env.EXPO_PUBLIC_API_URL}/uploads/defaults/avatar-default.png`,
              }}
              style={styles.avatar}
            />
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

      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.contentSafe}>
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
                  onPress={() => {
                    if (item.params) {
                      navigation.navigate(item.to, item.params);
                    } else {
                      navigation.navigate(item.to);
                    }
                  }}
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
            <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={handleSignOut}>
              <View style={styles.itemLeft}>
                <Icon name="log-out" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Cerrar sesión</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={deleteAccount}>
              <View style={styles.itemLeft}>
                <Icon name="trash-2" size={20} color="red" />
                <Text style={[styles.itemText, { color: 'red' }]}>Eliminar cuenta</Text>
              </View>
              <Icon name="chevron-right" size={20} color="red" />
            </TouchableOpacity>

            {
              userRol !== 'vendedor' ? 
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('FormularioVendedor')}
              >
                <View style={styles.itemLeft}>
                  <Icon name="box" size={20} color="#E6007A" />
                  <Text style={[styles.itemText, { color: '#E6007A' }]}>Convierte en vendedor</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#E6007A" />
              </TouchableOpacity> 
              : 
              <TouchableOpacity
                style={styles.itemSeller}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('TabsVendedor' as never)}
              >
                <View style={styles.itemLeft}>
                  <Icon name="box" size={20} color="#fff" />
                  <Text style={[styles.itemText, { color: '#fff' }]}>Panel de vendedor</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#fff" />
              </TouchableOpacity>
            } 
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
  itemSeller: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6007A',
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