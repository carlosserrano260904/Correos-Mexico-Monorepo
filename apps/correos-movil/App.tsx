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
import HomeTabs from './components/Tabs/HomeTabs';
import MainPageDistributor from './screens/repartidor/MainPageDistributor';
import QRScannerScreen from './screens/repartidor/QRScannerScreen';
import LoadPackages from './screens/repartidor/LoadPackages';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Product" component={ProductView} options={{headerShown: false}} />
        <Stack.Screen name="RoutesView" component={RoutesView} options={{headerShown: false}}/>
        <Stack.Screen name="Package" component={PackageScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ProfileUser" component={ProfileUser} options={{headerShown: false}}/>
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="MisCompras" component={MisCompras} options={{headerShown: false}}/>
        <Stack.Screen name="Tabs" component={HomeTabs} options={{headerShown: false}}/>
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{headerShown: false}} />
        <Stack.Screen name="DistributorPage" component={MainPageDistributor} options={{headerShown: false}} />
        <Stack.Screen name="LoadPackages" component={LoadPackages} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
