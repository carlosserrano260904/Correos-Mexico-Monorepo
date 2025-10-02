import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PantallaEnvio from '../../../screens/usuario/detalles_pedido/PantallaEnvio';
import PantallaPago from '../../../screens/usuario/detalles_pedido/PantallaPago';
import PantallaResumen from '../../../screens/usuario/detalles_pedido/Pantalla.Resumen';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const CheckoutTabs = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ✅ Header arriba de las pestañas */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles de la compra</Text>
      </View>

      <View style={styles.wrapper}>
        <Tab.Navigator
          initialRouteName="Envio"
          screenOptions={{
            tabBarActiveTintColor: '#DE1484',
            tabBarInactiveTintColor: '#757575',
            tabBarIndicatorStyle: styles.indicator,
            tabBarLabelStyle: styles.label,
            tabBarStyle: styles.tabBar,
            swipeEnabled: false,
          }}
        >
          <Tab.Screen name="Envio" component={PantallaEnvio} />
          <Tab.Screen name="Pago" component={PantallaPago} />
          <Tab.Screen name="Resumen" component={PantallaResumen} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    zIndex: 100,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    zIndex: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: 14,
    textTransform: 'none',
  },
  indicator: {
    backgroundColor: '#DE1484',
    height: 3,
    borderRadius: 2,
  },
});

export default CheckoutTabs;
