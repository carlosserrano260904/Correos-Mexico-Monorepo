import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Link } from '@react-navigation/native';

interface SectionItem {
  label: string;
  icon: string;
  to: string; // nombre de la ruta
}

function ProfileUser() {
  const sections: { title: string; items: SectionItem[] }[] = [
    {
      title: 'Cuenta',
      items: [
        { label: 'Perfil', icon: 'user', to: 'Perfil' },
        { label: 'Mis pedidos', icon: 'box', to: 'Pedidos' },
        { label: 'Mis compras', icon: 'shopping-bag', to: 'MisCompras' },
      ],
    },
    {
      title: 'Información de pago',
      items: [
        { label: 'Mis direcciones', icon: 'map-pin', to: 'Direcciones' },
        { label: 'Mis tarjetas', icon: 'credit-card', to: 'Tarjetas' },
      ],
    },
    {
      title: 'Políticas',
      items: [
        { label: 'Uso', icon: 'file-text', to: 'Uso' },
        { label: 'Privacidad', icon: 'file-text', to: 'Privacidad' },
        { label: 'Devoluciones', icon: 'file-text', to: 'Devoluciones' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {sections.map(({ title, items }, si) => (
        <View key={si} style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {items.map(({ label, icon, to }, i) => (
            <Link
              key={i}
              to={{ screen: to }}
              style={styles.item}
            >
              <View style={styles.itemLeft}>
                <Icon name={icon} size={20} />
                <Text style={styles.itemText}>{label}</Text>
              </View>
              <Icon name="chevron-right" size={20} />
            </Link>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemText: { fontSize: 16, marginLeft: 10 },
});


export default ProfileUser