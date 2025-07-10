import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductView from '../screens/usuario/e-commerce/ProductView';
import RoutesView from '../screens/repartidor/RoutesView';
import PackageScreen from '../screens/repartidor/PackageScreen';
import ProductsScreen from '../screens/producto/productosColor';
import ProfileUser from '../screens/usuario/profile/ProfileUser';
import UserDetailsScreen from '../screens/usuario/profile/UserDetailsScreen';
import { RootStackParamList } from '../schemas/schemas';
import MisCompras from '../screens/usuario/mis-compras/MisCompras';
import HomeTabs from '../components/Tabs/HomeTabs';
import MainPageDistributor from '../screens/repartidor/MainPageDistributor';
import QRScannerScreen from '../screens/repartidor/QRScannerScreen';
import LoadPackages from '../screens/repartidor/LoadPackages';
import MisTarjetasScreen from '../screens/usuario/MisTarjetas/MisTarjetasScreen';
import Direcciones from '../screens/usuario/Direcciones/Direcciones';
import AgregarTarjetaScreen from '../screens/usuario/MisTarjetas/AgregarTarjetaScreen';
import PackagesListDistributor from '../screens/repartidor/PackagesListDistributor';
import HomeUser from '../screens/usuario/HomePage/HomeUser';
import PrublicarProducto from '../screens/usuario/vendedor/PublicarProducto';
import Productos from '../screens/usuario/vendedor/Productos';
import DetalleProducto from '../screens/usuario/mis-compras/DetalleProducto';
import Politicas from '../screens/usuario/vendedor/Politicas';
import ReceivePackage from '../screens/repartidor/ReceivePackage';
import TakeEvidenceScreen from '../screens/repartidor/TakeEvidenceScreen';
import PantallaEnvio from '../screens/usuario/detalles_pedido/PantallaEnvio';
import PantallaPago from '../screens/usuario/detalles_pedido/PantallaPago';
import PantallaResumen from '../screens/usuario/detalles_pedido/Pantalla.Resumen';
import MisPedidosScreen from '../screens/usuario/Mispedidos/MisPedidosScreen';
import BarraProgresoEnvio from '../screens/usuario/Mispedidos/BarraProgresoEnvio';
import SeguimientoEnvioSimulado from '../screens/usuario/Mispedidos/SeguimientoEnvioSimulado';
import ListaPedidosScreen from '../screens/usuario/Mispedidos/ListaPedidosScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="PackageScreen" component={PackageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeUser" component={HomeUser} options={{ headerShown: false }} />
            <Stack.Screen name="ProductView" component={ProductView} options={{ headerShown: false }} />
            <Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RoutesView" component={RoutesView} options={{ headerShown: false }} />
            <Stack.Screen name="Package" component={PackageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileUser" component={ProfileUser} options={{ headerShown: false }} />
            <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ headerShown: false }} /> 
            <Stack.Screen name="MisCompras" component={MisCompras} options={{ headerShown: false }} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DistributorPage" component={MainPageDistributor} options={{ headerShown: false }} />
            <Stack.Screen name="LoadPackages" component={LoadPackages} options={{ headerShown: false }} />
            <Stack.Screen name="Direcciones" component={Direcciones} options={{ headerShown: false }}/>
            <Stack.Screen name="MisTarjetasScreen" component={MisTarjetasScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AgregarTarjetaScreen" component={AgregarTarjetaScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PackagesList" component={PackagesListDistributor} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="PublicarProducto" component={PrublicarProducto} options={{ headerShown: false }} />
            <Stack.Screen name="Productos" component={Productos} options={{ headerShown: false }} />
            <Stack.Screen name="DetalleProducto" component={DetalleProducto} options={{ headerShown: false }} />
            <Stack.Screen name="Politicas" component={Politicas} options={{ headerShown: false }} />
            <Stack.Screen name="RecibirPaquete" component={ReceivePackage} options={{ headerShown: false }} />
            <Stack.Screen name="TomarEvidencia" component={TakeEvidenceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Envio" component={PantallaEnvio} options={{ headerShown: false }} />
            <Stack.Screen name="Pago" component={PantallaPago} options={{ headerShown: false }} />
            <Stack.Screen name="Resumen" component={PantallaResumen} options={{ headerShown: false }} />
            <Stack.Screen name="MisPedidosScreen" component={MisPedidosScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BarraProgresoEnvio" component={BarraProgresoEnvio} options={{ headerShown: false }} />
            <Stack.Screen name="SeguimientoEnvioSimulado" component={SeguimientoEnvioSimulado} options={{ headerShown: false }} />
            <Stack.Screen name="ListaPedidosScreen" component={ListaPedidosScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}