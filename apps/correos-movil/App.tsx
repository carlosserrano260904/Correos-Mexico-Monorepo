import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductView from './screens/usuario/e-commerce/ProductView';
import RoutesView from './screens/repartidor/RoutesView';
import PackageScreen from './screens/repartidor/PackageScreen';
import HomeUser from './screens/usuario/HomePage/HomeUser';
import ProfileUser from './screens/usuario/profile/ProfileUser';
import UserDetailsScreen from './screens/usuario/profile/UserDetailsScreen';
import { RootStackParamList } from './schemas/schemas';
import MisCompras from './screens/usuario/mis-compras/MisCompras';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HomeUser'>
        <Stack.Screen name="HomeUser" component={HomeUser} options={{headerShown: false}}/>
        <Stack.Screen name="Product" component={ProductView} options={{headerShown: false}} />
        <Stack.Screen name="RoutesView" component={RoutesView} />
        <Stack.Screen name="Package" component={PackageScreen} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="MisCompras" component={MisCompras} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
