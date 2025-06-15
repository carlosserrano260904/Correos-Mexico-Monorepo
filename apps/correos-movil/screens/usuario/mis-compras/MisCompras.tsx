import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { idUser } from '../../../api/profile';
import { obtenerMisCompras } from '../../../api/miscompras';
import { MisComprasType } from '../../../schemas/schemas';

export default function MisCompras() {
  const [misCompras, setMisCompras] = useState<MisComprasType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerMisCompras(idUser);
        setMisCompras(data);
      } catch (err) {
        console.log('No se ha podido cargar mis compras', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {misCompras.map(tx => (
        <View key={tx.id} style={styles.transactionCard}>
          <Text style={styles.txHeader}>
            Compra #{tx.id} — {new Date(tx.diaTransaccion).toLocaleString()}
          </Text>
          <Text style={styles.txTotal}>Total: ${tx.total}</Text>
          <View style={styles.itemsContainer}>
            {tx.contenidos.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.producto.nombre}</Text>
                <Text style={styles.itemDetail}>
                  Cantidad: {item.cantidad}
                </Text>
                <Text style={styles.itemDetail}>
                  Precio: ${item.precio}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      {misCompras.length === 0 && (
        <Text style={styles.empty}>Aún no tienes compras.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    // sombra en iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // sombra en Android
    elevation: 2,
  },
  txHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  txTotal: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  itemRow: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 12,
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 32,
  },
});
