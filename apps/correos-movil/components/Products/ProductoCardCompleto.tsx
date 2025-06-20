// components/ProductoCard.tsx

import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { Heart, ShoppingBag } from 'lucide-react-native';

export type Articulo = {
  id: number;
  nombre: string;
  precio: string;
  imagen: any;
  color: string[];
  like: boolean;
};

interface Props {
  articulo: Articulo;
}

// Componente para mostrar los colores disponibles de forma responsiva
const ColorDisplay: React.FC<{
  colores: string[];
  maxColores?: number;
  tamañoCirculo?: number;
}> = ({ colores, maxColores = 3, tamañoCirculo = 14 }) => {
  const anchoPantalla = Dimensions.get('window').width;
  const anchoDisponible = anchoPantalla * 0.25;
  const espacioCirculo = tamañoCirculo + 4;
  const maxVisibles = Math.floor(anchoDisponible / espacioCirculo);

  const cantidadAMostrar = colores.length <= maxVisibles
    ? colores.length
    : Math.min(maxColores, maxVisibles);

  const coloresRestantes = colores.length - cantidadAMostrar;

  return (
    <View style={styles.contenedorColores}>
      {colores.slice(0, cantidadAMostrar).map((color, index) => (
        <View
          key={index}
          style={[
            styles.circuloColor,
            {
              backgroundColor: color,
              width: tamañoCirculo,
              height: tamañoCirculo,
              borderRadius: tamañoCirculo / 2,
              marginRight: index < cantidadAMostrar - 1 ? 4 : 0,
              borderWidth: color === '#fff' || color === '#ffffff' ? 1 : 0,
              borderColor: '#e0e0e0',
            },
          ]}
        />
      ))}

      {coloresRestantes > 0 && (
        <View style={styles.contadorRestante}>
          <Text style={styles.textoContador}>+{coloresRestantes}</Text>
        </View>
      )}
    </View>
  );
};

export const ProductoCard: React.FC<Props> = ({ articulo }) => {
  return (
    <View style={styles.tarjetaProducto}>

        <Image
          source={{uri: articulo.imagen}}
          style={[styles.imagenFondo, { borderRadius: 8 }]}
          resizeMode="contain"
        />


      <View style={styles.estadoProducto}>
        <ColorDisplay colores={articulo.color} maxColores={3} tamañoCirculo={14} />
        <View style={styles.iconosAccion}>
          <Heart size={24} color="gray" />
          <ShoppingBag size={24} color="gray" />
        </View>
      </View>

      <View style={styles.datosProducto}>
        <Text style={styles.textoNombre} numberOfLines={1} ellipsizeMode="tail">
          {articulo.nombre}
        </Text>
        <Text style={styles.textoPrecio}>MXN {articulo.precio}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjetaProducto: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '48%',
    overflow: 'hidden',
    marginBottom: 10,
  },
  imagenFondo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 5,
  },
  imagenProducto: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  estadoProducto: {
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconosAccion: {
    flexDirection: 'row',
    gap: 8,
  },
  datosProducto: {
    width: '100%',
    padding: 8,
    paddingTop: 0,
  },
  textoNombre: {
    color: '#000',
    fontSize: 14,
    marginBottom: 4,
  },
  textoPrecio: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contenedorColores: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flex: 1,
    marginRight: 8,
  },
  circuloColor: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  contadorRestante: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  textoContador: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
});
