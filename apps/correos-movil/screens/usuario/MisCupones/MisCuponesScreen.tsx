// apps/correos-movil/screens/usuario/MisCupones/MisCuponesScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../../components/common/AppHeader';
import Loader from '../../../components/common/Loader';
import CuponCard from '../../../components/CuponCard/CuponCard';

const MisCuponesScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [cupones, setCupones] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await new Promise(r => setTimeout(r, 300));
      // Cupones genéricos por compra mínima
      setCupones([
        { titulo: '10% en compras mayores a $1000', descripcion: 'Aplica al superar $1000', porcentaje: 10, compraMinima: 1000, vence: '30 de agosto', codigo: 'DESC10' },
        { titulo: '15% en compras mayores a $2000', descripcion: 'Aplica al superar $2000', porcentaje: 15, compraMinima: 2000, vence: '15 de septiembre', codigo: 'DESC15' },
        { titulo: '20% en compras mayores a $3000', descripcion: 'Aplica al superar $3000', porcentaje: 20, compraMinima: 3000, vence: '30 de septiembre', codigo: 'DESC20' },
      ]);
      setLoading(false);
    })();
  }, []);

  // Enviar cupón al Carrito por params (sin AsyncStorage)
  const sendCouponToCart = (coupon: any) => {
    // @ts-ignore  (ajusta si tienes tipado del stack)
    navigation.navigate('Carrito', {
      coupon: {
        titulo: coupon.titulo,
        porcentaje: Number(coupon.porcentaje || 0),
        compraMinima: Number(coupon.compraMinima || 0),
        codigo: coupon.codigo || null,
      },
    });
    Alert.alert('Cupón aplicado', `Se aplicó "${coupon.titulo}".`);
  };

  if (loading) return <Loader message="Cargando tus cupones..." />;

  return (
    <View style={styles.container}>
      <AppHeader title="Mis Cupones" onBack={() => navigation.goBack()} backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollPad}>
        {cupones.length === 0 ? (
          <Text style={styles.emptyText}>No tienes cupones disponibles.</Text>
        ) : (
          cupones.map((cupon, i) => (
            <Pressable
              key={i}
              onPress={() => sendCouponToCart(cupon)}
              android_ripple={{ color: '#e5e7eb' }}
              style={styles.cardWrap}
            >
              {/* 👇 Ocultamos el botón interno de la card */}
              <CuponCard {...cupon} hideApplyButton />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  scrollPad: { paddingBottom: 16 },
  cardWrap: { marginHorizontal: 12, marginBottom: 10, borderRadius: 10, overflow: 'hidden' },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
});

export default MisCuponesScreen;
