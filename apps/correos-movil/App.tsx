import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductView from './screens/usuario/e-commerce/ProductView';
import example from './screens/usuario/example';
import RoutesView from './screens/repartidor/RoutesView';
import PackageScreen from './screens/repartidor/PackageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Example'>
        <Stack.Screen name="Example" component={example} />
        <Stack.Screen name="Product" component={ProductView} options={{headerShown: false}} />
        <Stack.Screen name="RoutesView" component={RoutesView} />
        <Stack.Screen name="Package" component={PackageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
