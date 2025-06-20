import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Headset, Mic, Search } from 'lucide-react-native';

import { ProductoCard } from '../../components/Products/ProductoCardCompleto';

type RootStackParamList = {
  productos: undefined;
  explore: undefined;
};

type ProductosScreenProp = NativeStackNavigationProp<RootStackParamList, 'productos'>;

export type Article = {
  id: number;
  nombre: string;
  precio: string;
  imagen: any;
  color: string[];
  like: boolean;
};

function dividirEnFilas<T>(array: T[], tamaño: number): T[][] {
  const resultado: T[][] = [];
  for (let i = 0; i < array.length; i += tamaño) {
    resultado.push(array.slice(i, i + tamaño));
  }
  return resultado;
}

export default function ProductsScreen() {
  const navigation = useNavigation<ProductosScreenProp>();
  const [articulos, setArticulos] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.1.69:3000/api/products')
      .then((res) => res.json())
      .then((data) => {
        const productosConExtras = data.map((item: any) => ({
          ...item,
          color: ['#000'],
          like: false,
        }));
        setArticulos(productosConExtras);
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const filas = dividirEnFilas(articulos, 2);

  return (
    <View style={styles.contenedor}>
      <View style={[styles.fila, styles.encabezado]}>
        <Pressable onPress={() => navigation.navigate('explore')}>
          <ArrowLeft size={28} color='gray' />
        </Pressable>

        <View style={[styles.fila, styles.buscador]}>
          <View style={styles.iconoBuscar}>
            <Search size={28} color="gray" />
          </View>
          <TextInput
            style={styles.entradaBuscar}
            placeholder="Buscar un producto..."
            placeholderTextColor="#999"
          />
          <View style={styles.iconoAudio}>
            <Mic size={28} color="gray" />
          </View>
        </View>
      </View>

      <View style={styles.fila}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Inicio', 'Ropa', 'Electronicos', 'Productos destacados'].map((filtro, index) => (
            <Pressable key={index} style={styles.botonFiltro}>
              <Text style={styles.textoFiltro}>{filtro}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.seccionProductos, styles.columna]}>
        <View style={[styles.columna, styles.encabezadoProductos]}>
          <Text style={styles.textoPrincipal}>Productos destacados</Text>
          <Text style={styles.textoSecundario}>{articulos.length} artículos</Text>
        </View>

        <View style={styles.contenedorPrincipal}>
          {loading ? (
            <ActivityIndicator size="large" color="#de1484" />
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContenido} showsVerticalScrollIndicator={false}>
              {filas.map((fila, filaIndex) => (
                <View key={filaIndex} style={[styles.fila, styles.filaProductos]}>
                  {fila.map((item) => (
                    <ProductoCard key={item.id} articulo={item} />
                  ))}
                  {fila.length < 2 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.botonSoporte}>
          <Headset size={30} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#fff',
    flex: 1,
    padding: '5%',
    marginTop: 40,
  },
  fila: {
    flexDirection: 'row',
  },
  columna: {
    flexDirection: 'column',
  },
  encabezado: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 25,
    marginBottom: 10,
  },
  buscador: {
    flex: 1,
    alignItems: 'center',
  },
  entradaBuscar: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    width: 200,
    height: 50,
    fontSize: 15,
    paddingHorizontal: 15,
    color: '#333',
  },
  iconoBuscar: {
    backgroundColor: '#f3f4f6',
    width: 40,
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  iconoAudio: {
    backgroundColor: '#f3f4f6',
    width: 40,
    height: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  botonFiltro: {
    backgroundColor: '#de1484',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 50,
    margin: 5,
    borderRadius: 8,
  },
  textoFiltro: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seccionProductos: {
    flex: 1,
    paddingTop: 10,
  },
  encabezadoProductos: {
    marginBottom: 20,
  },
  textoPrincipal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  textoSecundario: {
    fontSize: 14,
    color: '#666',
  },
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContenido: {
    flexGrow: 1,
    gap: 10,
    paddingBottom: '5%',
  },
  filaProductos: {
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  botonSoporte: {
    position: 'absolute',
    backgroundColor: '#de1484',
    width: 60,
    height: 60,
    borderRadius: 60,
    bottom: '5%',
    right: '0%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
