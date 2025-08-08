// CircularProgressAvatar.tsx
import React, { useMemo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';

// Definición de constantes para el círculo de progreso
const RADIUS = 67; // Radio del círculo de fondo y progreso
const STROKE_WIDTH = 5; // Grosor del trazo del círculo
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // Longitud total del perímetro del círculo

type Props = {
  userData: any;      // Datos del usuario con campos para calcular completitud
  imageUri: string;   // URI de la imagen de avatar
  size?: number;      // Tamaño del SVG y el avatar (opcional, por defecto 140)
};

export default function CircularProgressAvatar({ userData, imageUri, size = 140 }: Props) {
  // Agrupamos los campos relevantes del perfil para calcular cuántos están completados
  const campos = useMemo(() => [
    userData.nombre,
    userData.apellido,
    userData.imagen,
    userData.numero,
    userData.codigoPostal,
    userData.calle,
    userData.fraccionamiento,
    userData.ciudad,
    userData.estado,
  ], [userData]);

  // Contamos cuántos campos no están vacíos o solo contienen espacios
  const completados = campos.reduce((acc, campo) => acc + (campo?.trim() ? 1 : 0), 0);
  // Calculamos el porcentaje de campos completados
  const porcentaje = Math.round((completados / campos.length) * 100);
  // Convertimos el porcentaje en desplazamiento para strokeDashoffset
  const progress = CIRCUMFERENCE - (porcentaje / 100) * CIRCUMFERENCE;

  return (
      <View style={styles.wrapper}>
          <View style={styles.svgWrapper}>
              {/* Círculo de fondo en gris */}
              <Svg width={size} height={size}>
                  <Circle
                      stroke="#E0E0E0" // Color de fondo
                      fill="none"
                      cx={size / 2}     // Centro X
                      cy={size / 2}     // Centro Y
                      r={RADIUS}        // Radio
                      strokeWidth={STROKE_WIDTH}
                  />
                  {/* Círculo de progreso en rosa, rotado -90° para que comience arriba */}
                  <Circle
                      stroke="#E6007E" // Color del progreso
                      fill="none"
                      cx={size / 2}
                      cy={size / 2}
                      r={RADIUS}
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={progress} // Desplazamiento según porcentaje
                      strokeLinecap="round"      // Bordes redondeados
                      strokeWidth={STROKE_WIDTH}
                      transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  />
              </Svg>
              {/* Avatar centrado sobre el SVG */}
              <Image
                  source={{ uri: imageUri }}
                  style={[
                      styles.image,
                      {
                          width: size - STROKE_WIDTH * 2,
                          height: size - STROKE_WIDTH * 2,
                          borderRadius: (size - STROKE_WIDTH * 2) / 2,
                      },
                  ]}
              />
          </View>
          {/* Texto que muestra el porcentaje */}
          <Text style={styles.percentageText}>{porcentaje}%</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',       // Centrar contenido horizontal
    justifyContent: 'center',   // Centrar contenido vertical
    marginBottom: 16,           // Margen inferior
  },
  svgWrapper: {
    justifyContent: 'center',   // Centrar SVG
    alignItems: 'center',
    position: 'relative',       // Para posicionar el Image absolut
  },
  image: {
    position: 'absolute',       // Avatar encima del SVG
  },
  percentageText: {
    marginTop: 7,               // Separación respecto al SVG
    color: '#E6007E',           // Color del texto
    fontWeight: 'bold',         // Negrita
  },
});


// ProfileUser.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';
import { usuarioPorId } from '../../../api/profile';
import { RootStackParamList, SchemaProfileUser } from '../../../schemas/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { moderateScale } from 'react-native-size-matters';
import axios from 'axios';
import { useMyAuth } from '../../../context/AuthContext';
import { useUser } from '@clerk/clerk-expo';

// Tipo para los items de navegación en la sección de perfil
type SectionItem = {
  label: string;              // Texto a mostrar
  icon: string;               // Icono de Feather
  to: keyof RootStackParamList; // Pantalla a la que navega
  params?: Record<string, any>; // Parámetros opcionales
};

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList, 'ProfileUser'>;

export default function ProfileUser({ navigation }: { navigation: ProfileNavProp }) {
  const isFocused = useIsFocused(); // Saber si la pantalla está activa
  const { logout, userId } = useMyAuth(); // Contexto de autenticación
  const { user } = useUser();          // Usuario de Clerk
  const [usuario, setUsuario] = useState<SchemaProfileUser | null>(null); // Estado del perfil

  // Efecto para cargar perfil cuando la pantalla está en foco
  useEffect(() => {
    if (!isFocused) return; // No hacer nada si no está activa

    (async () => {
      try {
        if (userId) {
          // Llamada API para obtener datos del usuario
          const perfil = await usuarioPorId(parseInt(userId, 10));
          setUsuario(perfil);
        } else {
          console.warn('⚠️ No se encontró userId en AuthContext');
        }
      } catch (error) {
        console.error('❌ Error al cargar el perfil:', error);
      }
    })();
  }, [isFocused]);

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', JSON.stringify(err, null, 2));
    }
  };

  // Función para eliminar la cuenta en el backend y luego cerrar sesión
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

  // Configuración de secciones y items para navegación
  const sections: { title: string; items: SectionItem[] }[] = [
    {
      title: 'Cuenta',
      items: [
        { label: 'Publicar producto', icon: 'box', to: 'PublicarProducto' },
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
      {/* Barra de estado con fondo rosa */}
      <StatusBar barStyle="light-content" backgroundColor="#E6007A" />
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          {/* Botón para navegar a detalles del usuario */}
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => usuario && navigation.navigate('UserDetailsScreen', { user: usuario })}
          >
            {/* Avatar del usuario */}
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
              {/* Nombre del usuario */}
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
          {/* Renderizado de secciones y items */}
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
            {/* Botón para cerrar sesión */}
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

            {/* Botón para eliminar cuenta */}
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

            {/* Botón para convertirse en vendedor */}
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerSafe: {
    backgroundColor: '#E6007A', // Fondo rosa del header
  },
  contentSafe: {
    flex: 1,
    backgroundColor: '#fff',      // Fondo blanco del contenido
  },
  header: {
    flexDirection: 'row',         // Layout horizontal
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
    width: moderateScale(48),     // Tamaño del avatar
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: '#fff',
  },
  textContainer: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  name: {
    fontSize: moderateScale(18),  // Tamaño de fuente del nombre
    fontWeight: 'bold',
    color: '#fff',                // Color de texto blanco
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
