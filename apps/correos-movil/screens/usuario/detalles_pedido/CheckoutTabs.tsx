import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PantallaEnvio from '../../../screens/usuario/detalles_pedido/PantallaEnvio';
import PantallaPago from '../../../screens/usuario/detalles_pedido/PantallaPago';
import PantallaResumen from '../../../screens/usuario/detalles_pedido/Pantalla.Resumen';
import { SafeAreaView, StyleSheet, View, Platform, StatusBar } from 'react-native';

const Tab = createMaterialTopTabNavigator();

const CheckoutTabs = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
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
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    zIndex: 10,
    marginTop: 16, //  Ahora el tab está más abajo visualmente
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
