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
import PrublicarProducto from './screens/usuario/vendedor/PublicarProducto';
import Productos from './screens/usuario/vendedor/Productos';
import DetalleProducto from './screens/usuario/mis-compras/DetalleProducto';
import Politicas from './screens/usuario/vendedor/Politicas';
import ReceivePackage from './screens/repartidor/ReceivePackage';
import TakeEvidenceScreen from './screens/repartidor/TakeEvidenceScreen';
import PantallaEnvio from './screens/usuario/detallesCompra/PantallaEnvio';
import PantallaPago from './screens/usuario/detallesCompra/PantallaPago';
import PantallaResumen from './screens/usuario/detallesCompra/PantallaResumen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={HomeTabs} options={{headerShown: false}}/>
        <Stack.Screen name="PackageScreen" component={PackageScreen} />
        <Stack.Screen name="HomeUser" component={HomeUser} />
        <Stack.Screen name="ProductView" component={ProductView} />
        <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
        <Stack.Screen name="RoutesView" component={RoutesView} />
        <Stack.Screen name="Package" component={PackageScreen} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} />
        <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
        <Stack.Screen name="MisCompras" component={MisCompras} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="DistributorPage" component={MainPageDistributor} />
        <Stack.Screen name="LoadPackages" component={LoadPackages} />
        <Stack.Screen name="MisTarjetasScreen" component={MisTarjetasScreen} />
        <Stack.Screen name="AgregarTarjetaScreen" component={AgregarTarjetaScreen} />
        <Stack.Screen name="PackagesList" component={PackagesListDistributor} />
        <Stack.Screen name="PublicarProducto" component={PrublicarProducto} />
        <Stack.Screen name="Productos" component={Productos} />
        <Stack.Screen name="DetalleProducto" component={DetalleProducto} />
        <Stack.Screen name="Politicas" component={Politicas} />
        <Stack.Screen name="RecibirPaquete" component={ReceivePackage} />
        <Stack.Screen name="TomarEvidencia" component={TakeEvidenceScreen} />
        <Stack.Screen name="Envio" component={PantallaEnvio} />
        <Stack.Screen name="Pago" component={PantallaPago} />
        <Stack.Screen name="Resumen" component={PantallaResumen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
