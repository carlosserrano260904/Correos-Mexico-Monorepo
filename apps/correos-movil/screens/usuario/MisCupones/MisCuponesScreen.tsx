import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CuponCard from '../../../components/CuponCard/CuponCard';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/common/AppHeader';
import Loader from '../../../components/common/Loader';

const CuponesScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<'proximos' | 'lejanos'>('proximos');
  const [loading, setLoading] = useState(true);
  const [cupones, setCupones] = useState<any[]>([]);

  // 🔹 Simulación de carga (aquí podrías hacer fetch a tu API real)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Simulación: espera 1.5s para "cargar"
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Datos cargados
        setCupones([
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
        ]);
      } catch (err) {
        console.error("❌ Error cargando cupones:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Loader message="Cargando tus cupones..." />;
  }

  const parseFecha = (str: string) => {
    const [dia, mes] = str.split(' de ');
    const meses = [
      'enero','febrero','marzo','abril','mayo','junio','julio',
      'agosto','septiembre','octubre','noviembre','diciembre'
    ];
    return new Date(2025, meses.indexOf(mes), parseInt(dia));
  };

  const cuponesOrdenados = [...cupones].sort((a, b) => {
    const fechaA = parseFecha(a.vence);
    const fechaB = parseFecha(b.vence);
    return selectedFilter === 'proximos'
      ? fechaA.getTime() - fechaB.getTime()
      : fechaB.getTime() - fechaA.getTime();
  });

  return (
    <View style={styles.container}>
      <AppHeader title="Mis Cupones" onBack={() => navigation.goBack()} />

      {/* Filtros */}
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

      {/* Lista de cupones */}
      <ScrollView>
        {cuponesOrdenados.length === 0 ? (
          <Text style={styles.emptyText}>No tienes cupones disponibles.</Text>
        ) : (
          cuponesOrdenados.map((cupon, index) => (
            <CuponCard key={index} {...cupon} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default CuponesScreen;
