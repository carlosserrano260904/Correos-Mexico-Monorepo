import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductView from './screens/usuario/e-commerce/ProductView';
import RoutesView from './screens/repartidor/RoutesView';
import PackageScreen from './screens/repartidor/PackageScreen';
import ProductsScreen from './screens/producto/productosColor';
import ProfileUser from './screens/usuario/profile/ProfileUser';
import UserDetailsScreen from './screens/usuario/profile/UserDetailsScreen';
import { RootStackParamList } from './schemas/schemas';
import MisCompras from './screens/usuario/mis-compras/MisCompras';
import HomeTabs from './components/Tabs/HomeTabs';
import MainPageDistributor from './screens/repartidor/MainPageDistributor';
import QRScannerScreen from './screens/repartidor/QRScannerScreen';
import LoadPackages from './screens/repartidor/LoadPackages';
import MisTarjetasScreen from './screens/usuario/MisTarjetas/MisTarjetasScreen';
import AgregarTarjetaScreen from './screens/usuario/MisTarjetas/AgregarTarjetaScreen';
import PackagesListDistributor from './screens/repartidor/PackagesListDistributor';
import HomeUser from './screens/usuario/HomePage/HomeUser';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="HomeUser" component={HomeUser} options={{headerShown: false}} />
        <Stack.Screen name="ProductView" component={ProductView}/>
        <Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{headerShown: false}} />
        <Stack.Screen name="RoutesView" component={RoutesView} options={{headerShown: false}}/>
        <Stack.Screen name="Package" component={PackageScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ProfileUser" component={ProfileUser} options={{headerShown: false}}/>
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="MisCompras" component={MisCompras} options={{headerShown: false}}/>
        <Stack.Screen name="Tabs" component={HomeTabs} options={{headerShown: false}}/>
        <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{headerShown: false}} />
        <Stack.Screen name="DistributorPage" component={MainPageDistributor} options={{headerShown: false}} />
        <Stack.Screen name="LoadPackages" component={LoadPackages} options={{headerShown: false}} />
        <Stack.Screen name="MisTarjetasScreen" component={MisTarjetasScreen}   options={{ headerShown: false }} />
        <Stack.Screen name="AgregarTarjetaScreen" component={AgregarTarjetaScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PackagesList" component={PackagesListDistributor} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
