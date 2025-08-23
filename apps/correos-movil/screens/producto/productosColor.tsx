// screens/productosColor.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Text, View, Platform,
  ActivityIndicator, TextInput, SafeAreaView, TouchableOpacity
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Headset, Search } from 'lucide-react-native';
import ProductListScreen, { Articulo } from '../../components/Products/ProductListScreen';
import { RootStackParamList } from '../../schemas/schemas';
import { moderateScale } from 'react-native-size-matters';
import { StatusBar } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';

// ==== Tipos que refleja tu API ====
type BackendImage = {
  id: number;
  url: string;
  orden: number | null;
  productId: number;
};
type BackendProduct = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;            // string en tu API
  categoria: string | null;
  images?: BackendImage[];   // arreglo de objetos
};

// Elige imagen principal por "orden"
const pickMainImage = (images?: BackendImage[]) => {
  if (!images || images.length === 0) return DEFAULT_IMAGE;
  const sorted = [...images].sort((a, b) => {
    const ao = Number.isFinite(a.orden as any) ? (a.orden as number) : 0;
    const bo = Number.isFinite(b.orden as any) ? (b.orden as number) : 0;
    return ao - bo;
  });
  return sorted[0]?.url || DEFAULT_IMAGE;
};

// Mapea Backend -> Articulo (expone imagen, image e images[])
const mapToArticulo = (p: BackendProduct): Articulo => {
  const allUrls = (p.images || []).map(img => img.url).filter(Boolean);
  const main = allUrls.length ? pickMainImage(p.images) : DEFAULT_IMAGE;

  return {
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: Number.parseFloat(p.precio),
    categoria: p.categoria || 'Sin categoría',

    // claves compatibles con distintas UIs
    imagen: main,                 // ES
    image: main,                  // EN
    images: allUrls.length ? allUrls : [DEFAULT_IMAGE],
  } as Articulo;
};

export const formatPrice = (price: number) => {
  if (typeof price !== 'number' || Number.isNaN(price)) return '';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
};

export default function ProductsScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const [productos, setProductos] = useState<Articulo[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/products`);
        const data: unknown = await resp.json();

        if (Array.isArray(data)) {
          const mapped = (data as BackendProduct[]).map(mapToArticulo);
          setProductos(mapped);
        } else {
          console.error('La respuesta de la API no es un arreglo:', data);
          setProductos([]);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];

  const productosFiltrados =
    (categoriaSeleccionada === 'Todos'
      ? productos
      : productos.filter(p => p.categoria === categoriaSeleccionada)
    ).filter(p => {
      const q = searchText.toLowerCase().trim();
      return p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q);
    });

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
      <View style={[styles.fila, styles.encabezado]}>
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={28} color="gray" />
        </Pressable>

        <View style={styles.buscador}>
          <View style={styles.iconoBuscar}>
            <Search size={20} color="gray" />
          </View>
          <TextInput
            style={styles.entradaBuscar}
            placeholder="Buscar un producto..."
            placeholderTextColor="#999"
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <Text style={styles.titulo}>Productos</Text>

      <View style={styles.filtrosContainer}>
        {categorias.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categorias.map((categoria, i) => (
              <Pressable
                key={`${categoria}-${i}`}
                style={[styles.botonFiltro, categoria === categoriaSeleccionada && styles.botonFiltroActivo]}
                onPress={() => setCategoriaSeleccionada(categoria)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[styles.textoFiltro, categoria === categoriaSeleccionada && styles.textoFiltroActivo]}
                >
                  {categoria}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ProductListScreen productos={productosFiltrados} search={searchText} />
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ChatBot')} style={styles.customerServiceContainer}>
        <Headset color="#fff" size={moderateScale(24)} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingTop: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 5,
  },
  fila: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  encabezado: { marginBottom: 10, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 16, marginVertical: 8 },
  filtrosContainer: { paddingHorizontal: 15, paddingVertical: 4 },
  botonFiltro: {
    marginRight: 6, backgroundColor: '#eee', paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', maxWidth: 100, height: 50,
  },
  botonFiltroActivo: { backgroundColor: '#DE1484' },
  textoFiltro: { fontSize: 13, color: '#333' },
  textoFiltroActivo: { color: 'white', fontWeight: 'bold' },
  listContainer: { flex: 1, paddingTop: 10, marginBottom: 0 },
  customerServiceContainer: {
    width: moderateScale(60), height: moderateScale(60), backgroundColor: '#DE1484',
    position: 'absolute', bottom: '5%', right: '5%', borderRadius: 100, alignItems: 'center', justifyContent: 'center',
  },
  buscador: {
    flex: 1, flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 20,
    height: 40, alignItems: 'center', marginLeft: 16,
  },
  entradaBuscar: { flex: 1, fontSize: 14, paddingHorizontal: 12, color: '#333' },
  iconoBuscar: { paddingHorizontal: 8 },
});
