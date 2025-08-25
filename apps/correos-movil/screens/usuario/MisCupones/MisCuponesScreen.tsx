import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CuponCard from '../../../components/CuponCard/CuponCard';
import { useNavigation } from '@react-navigation/native';

const CuponesScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'proximos' | 'lejanos'>('proximos');

  const cupones = [
    {
      titulo: '10% en HP',
      descripcion: 'En productos de tecnología',
      porcentaje: 10,
      compraMinima: 2500,
      vence: '18 de julio',
      categoria: 'Tecnología',
    },
    {
      titulo: '15% Belleza',
      descripcion: 'Productos seleccionados de belleza',
      porcentaje: 15,
      compraMinima: 1500,
      vence: '15 de julio',
      categoria: 'Belleza',
    },
    {
      titulo: '20% Hecho en México',
      descripcion: 'Aplica a productos locales',
      porcentaje: 20,
      compraMinima: 1800,
      vence: '22 de julio',
      categoria: 'Hecho en México',
    },
  ];

  const parseFecha = (str: string) => {
    const [dia, mes] = str.split(' de ');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return new Date(2025, meses.indexOf(mes), parseInt(dia));
  };

  const cuponesOrdenados = [...cupones].sort((a, b) => {
    const fechaA = parseFecha(a.vence);
    const fechaB = parseFecha(b.vence);
    return selectedFilter === 'proximos' ? fechaA.getTime() - fechaB.getTime() : fechaB.getTime() - fechaA.getTime();
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArea}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Cupones</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'proximos' && styles.filterActive]}
          onPress={() => setSelectedFilter('proximos')}
        >
          <Text style={[styles.filterText, selectedFilter === 'proximos' && styles.filterTextActive]}>
            Próximos a vencer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'lejanos' && styles.filterActive]}
          onPress={() => setSelectedFilter('lejanos')}
        >
          <Text style={[styles.filterText, selectedFilter === 'lejanos' && styles.filterTextActive]}>
            Lejanos a vencer
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {cuponesOrdenados.map((cupon, index) => (
          <CuponCard key={index} {...cupon} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC008C',
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  backArea: {
    padding: 8,
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderColor: '#EC008C',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    color: '#EC008C',
    fontWeight: 'bold',
  },
  filterActive: {
    backgroundColor: '#EC008C',
  },
  filterTextActive: {
    color: '#fff',
  },
});

export default CuponesScreen;
