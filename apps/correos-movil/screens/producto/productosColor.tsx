// productosColor.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Headset, Search } from 'lucide-react-native';
import ProductListScreen, { Articulo } from '../../components/Products/ProductListScreen';
import { RootStackParamList } from '../../schemas/schemas';
import { moderateScale } from 'react-native-size-matters';
import { StatusBar } from 'react-native';

const IP = process.env.EXPO_PUBLIC_API_URL;

export const formatPrice = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
};


export default function ProductsScreen() {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const [productos, setProductos] = useState<Articulo[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${IP}/api/products`);
        const data = await response.json();
        // Asegurarse de que la respuesta es un array antes de actualizar el estado
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error('La respuesta de la API no es un arreglo:', data);
          setProductos([]); // Establecer un array vacío para evitar errores
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProductos([]); // También en caso de error de red/fetch
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const categorias = ['Todos', ...new Set(productos.map(p => p.categoria).filter(Boolean))];
  const [searchText, setSearchText] = useState('');

  const productosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? productos
      : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <SafeAreaView style={styles.contenedor}>
    <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"  // color del texto (light-content o dark-content)
        translucent
      />
      <View style={[styles.fila, styles.encabezado]}>
        <View style={[{display: 'flex', flexDirection: 'column'  ,alignItems: 'center', justifyContent: 'center' }]}>
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color="gray" />
          </Pressable>
        </View>


        <View style={[styles.buscador]}>
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

      <View style={[styles.filtrosContainer]}>

        {/* Solo muestra la barra si hay categorías para filtrar (además de "Todos") */}
        {categorias && categorias.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categorias.map((categoria, index) => (
              <Pressable
                key={index}
                style={[
                  styles.botonFiltro,
                  categoria === categoriaSeleccionada && styles.botonFiltroActivo,
                ]}
                onPress={() => setCategoriaSeleccionada(categoria)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.textoFiltro,
                    categoria === categoriaSeleccionada && styles.textoFiltroActivo,
                  ]}
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
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <ProductListScreen productos={productosFiltrados} search={searchText} />
        )}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('DistributorPage')} style={styles.customerServiceContainer}>
        <Headset color={"#fff"} size={moderateScale(24)} />
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
  filtrosContainer: {
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  fila: { display: 'flex', flexDirection: 'row' },
  botonFiltro: {
    marginRight: 6,
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100,
    height: 50,
  },
  botonFiltroActivo: { backgroundColor: '#DE1484' },
  textoFiltro: { fontSize: 13, color: '#333' },
  textoFiltroActivo: { color: 'white', fontWeight: 'bold' },
  listContainer: { flex: 1, paddingTop: 10, marginBottom: 0, },
  customerServiceContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    backgroundColor: "#DE1484",
    position: "absolute",
    bottom: '5%',
    right: '5%',
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  buscador: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    height: 40,
    alignItems: 'center',
    marginLeft: 16,
  },
  entradaBuscar: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    color: '#333',
  },
  iconoBuscar: { paddingHorizontal: 8 },
});
