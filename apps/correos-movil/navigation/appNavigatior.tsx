import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductView from '../screens/usuario/e-commerce/ProductView';
import HistorialFacturasScreen from '../screens/facturas/historial_facturas';
import ProductsScreen from '../screens/producto/productosColor';
import ProfileUser from '../screens/usuario/profile/ProfileUser';
import UserDetailsScreen from '../screens/usuario/profile/UserDetailsScreen';
import { RootStackParamList } from '../schemas/schemas';
import MisCompras from '../screens/usuario/mis-compras/MisCompras';
import MisCuponesScreen  from '../screens/usuario/MisCupones/MisCuponesScreen';
import HomeTabs from '../components/Tabs/HomeTabs';
import MisTarjetasScreen from '../screens/usuario/MisTarjetas/MisTarjetasScreen';
import Direcciones from '../screens/usuario/Direcciones/Direcciones';
import AgregarTarjetaScreen from '../screens/usuario/MisTarjetas/AgregarTarjetaScreen';
import HomeUser from '../screens/usuario/HomePage/HomeUser';
import PrublicarProducto from '../screens/usuario/vendedor/PublicarProducto';
import Productos from '../screens/usuario/vendedor/Productos';
import DetalleProducto from '../screens/usuario/mis-compras/DetalleProducto';
import Politicas from '../screens/usuario/vendedor/Politicas';
import PantallaEnvio from '../screens/usuario/detalles_pedido/PantallaEnvio';
import PantallaPago from '../screens/usuario/detalles_pedido/PantallaPago';
import PantallaResumen from '../screens/usuario/detalles_pedido/Pantalla.Resumen';
import MapaPuntosRecogida from '../screens/usuario/detalles_pedido/MapaPuntosRecogida';
import MisPedidosScreen from '../screens/usuario/Mispedidos/MisPedidosScreen';
import BarraProgresoEnvio from '../screens/usuario/Mispedidos/BarraProgresoEnvio';
import SeguimientoEnvioSimulado from '../screens/usuario/Mispedidos/SeguimientoEnvioSimulado';
import ListaPedidosScreen from '../screens/usuario/Mispedidos/ListaPedidosScreen';
import tarifador from '../screens/usuario/tarifador/tarifador';
import chat_bot from '../screens/usuario/chat-bot/chat_bot';
import ubi_oficnas from '../screens/usuario/ubicaciones-oficinas/ubicaciones';
import Correomex from '../screens/usuario/correos-mex-page/correos-principal';
import PagoExitosoScreen from '../screens/usuario/detalles_pedido/PagoExitosoScreen';
import CarritoScreen from '../screens/carrito/Carrito';
import FavoritosScreen from '../screens/favorito/Favorito';
import FormularioVendedor from '../screens/vendedor/FormularioVendedor';
import CheckoutTabs from '../screens/usuario/detalles_pedido/CheckoutTabs';
import HistorialFacturas from '../screens/facturas/historial_facturas';
import GuiaFormulario from '../screens/usuario/tarifador/GuiaFormulario';
import ComoEnviar from '../screens/usuario/correos-mex-page/Como-enviar/ComoEnviar';
import ComoEnviarPaquetes from '../screens/usuario/correos-mex-page/Como-enviar/ComoEnviarPaquetes';
import ComoEnviarCartas from '../screens/usuario/correos-mex-page/Como-enviar//ComoEnviarCarta';
import ComoEnviarPaquetesyEmbalajes from '../screens/usuario/correos-mex-page/Como-enviar/ComoEnviarPaquetesyEmbalajes';
import ComoEnviarArticulosProhibidos from '../screens/usuario/correos-mex-page/Como-enviar/ComoEnviarArticulosProhibidos';
import HomeTabsVendedor from '../components/Tabs/HomeTabsVendedor'; 
import TarificadorNacional from '../screens/usuario/correos-mex-page/Cotizar-envio/tarifador';
import ServiciosEmpresas from '../screens/usuario/correos-mex-page/serviciosParaEmpresas/serviciosParaEmpresas';
import tarifasParaEnviosDeCartas from '../screens/usuario/correos-mex-page/serviciosParaEmpresas/tarifasParaEnviosDeCartas';
import tarifasParaEnviosDePaquetes from '../screens/usuario/correos-mex-page/serviciosParaEmpresas/tarifasParaEnviosDePaquetes';
import tarificadorParaImpresos from '../screens/usuario/correos-mex-page/serviciosParaEmpresas/tarifasParaEnviosImpresos';
import correspondencia from '../screens/usuario/correos-mex-page/envios-internacionales/correspondencia';
import EnviosInternacionales from '../screens/usuario/correos-mex-page/envios-internacionales/envios_internacionales';
import impresos from '../screens/usuario/correos-mex-page/envios-internacionales/impresos';
import paqueteria from '../screens/usuario/correos-mex-page/envios-internacionales/paqueteria';
import servicios_adicionales from '../screens/usuario/correos-mex-page/envios-internacionales/servicios_adicionales';
import AtencionClientePrincipal from '../screens/usuario/correos-mex-page/atencion-cliente/AtencionClientePrincipal';
import ComoEnviarAtencion from '../screens/usuario/correos-mex-page/atencion-cliente/ComoEnviar';
import Contacto from '../screens/usuario/correos-mex-page/atencion-cliente/Contacto';
import PreguntasFrecuentes from '../screens/usuario/correos-mex-page/atencion-cliente/PreguntasFrecuentes';
// Esta cosa da error <Stack.Screen name="TabsVendedor" component={HomeTabsVendedor} options={{ headerShown: false }} />


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="HomeUser" component={HomeUser} options={{ headerShown: false }} />
            <Stack.Screen name="ProductView" component={ProductView} options={{ headerShown: false }} />
            <Stack.Screen name="ProductsScreen" component={ProductsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileUser" component={ProfileUser} options={{ headerShown: false }} />
            <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} options={{ headerShown: false }} /> 
            <Stack.Screen name="MisCompras" component={MisCompras} options={{ headerShown: false }} />
            <Stack.Screen name="MisCuponesScreen" component={MisCuponesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HistorialFacturas" component={HistorialFacturasScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PagoExitosoScreen" component={PagoExitosoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Direcciones" component={Direcciones} options={{ headerShown: false }}/>
            <Stack.Screen name="MisTarjetasScreen" component={MisTarjetasScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AgregarTarjetaScreen" component={AgregarTarjetaScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PublicarProducto" component={PrublicarProducto} options={{ headerShown: false }} />
            <Stack.Screen name="Productos" component={Productos} options={{ headerShown: false }} />
            <Stack.Screen name="DetalleProducto" component={DetalleProducto} options={{ headerShown: false }} />
            <Stack.Screen name="Politicas" component={Politicas} options={{ headerShown: false }} />
            <Stack.Screen name="Envio" component={PantallaEnvio} options={{ headerShown: false }} />
            <Stack.Screen name="Pago" component={PantallaPago} options={{ headerShown: false }} />
            <Stack.Screen name="Resumen" component={PantallaResumen} options={{ headerShown: false }} />
            <Stack.Screen name="MapaPuntosRecogida" component={MapaPuntosRecogida} />
            <Stack.Screen name="MisPedidosScreen" component={MisPedidosScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BarraProgresoEnvio" component={BarraProgresoEnvio} options={{ headerShown: false }} />
            <Stack.Screen name="SeguimientoEnvioSimulado" component={SeguimientoEnvioSimulado} options={{ headerShown: false }} />
            <Stack.Screen name="ListaPedidosScreen" component={ListaPedidosScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Tarifador" component={tarifador} options={{headerShown: false}} />
            <Stack.Screen name="ChatBot" component={chat_bot} options={{headerShown: false}} />
            <Stack.Screen name="Mapa-ubicaciones" component={ubi_oficnas} options={{headerShown: false}} />
            <Stack.Screen name="Correo-mex" component={Correomex} options={{headerShown: false}} />
            <Stack.Screen name="Carrito" component={CarritoScreen} options={{headerShown: false}} />
            <Stack.Screen name="Favorito" component={FavoritosScreen} options={{headerShown: false}} />
            <Stack.Screen name="FormularioVendedor" component={FormularioVendedor} options={{headerShown: false}} />
            <Stack.Screen name="Checkout" component={CheckoutTabs} options={{headerShown: false}}/>
            <Stack.Screen name="GuiaFormulario" component ={GuiaFormulario} options={{ title: 'Datos para la guia'}} />
            <Stack.Screen name="HistorialDeFacturas" component={HistorialFacturas}/>
            <Stack.Screen name="ComoEnviar" component={ComoEnviar} />
            <Stack.Screen name="ComoEnviarCartas" component={ComoEnviarCartas} />
            <Stack.Screen name="ComoEnviarPaquetes" component={ComoEnviarPaquetes} />
            <Stack.Screen name="ComoEnviarPaquetesyEmbalajes" component={ComoEnviarPaquetesyEmbalajes} />
            <Stack.Screen name="ComoEnviarArticulosProhibidos" component={ComoEnviarArticulosProhibidos} />
            <Stack.Screen name="TarificadorNacional" component={TarificadorNacional} />
            <Stack.Screen name="ServiciosEmpresas" component={ServiciosEmpresas} />
            <Stack.Screen name="tarifasParaEnviosDeCartas" component={tarifasParaEnviosDeCartas} />
            <Stack.Screen name="tarifasParaEnviosDePaquetes" component={tarifasParaEnviosDePaquetes} />
            <Stack.Screen name="tarifasParaEnviosImpresos" component={tarificadorParaImpresos} />
            <Stack.Screen name="impresos" component={impresos} />
            <Stack.Screen name="tarifasParaEnviosPaqueteria" component={paqueteria} />
            <Stack.Screen name="correspondencia" component={correspondencia} />
            <Stack.Screen name="EnviosInternacionales" component={EnviosInternacionales} />
            <Stack.Screen name="servicios_adicionales" component={servicios_adicionales} />
            <Stack.Screen name="AtencionClientePrincipal" component={AtencionClientePrincipal} />
            <Stack.Screen name="ComoEnviarAtencion" component={ComoEnviarAtencion} />
            <Stack.Screen name="Contacto" component={Contacto} />
            <Stack.Screen name="PreguntasFrecuentes" component={PreguntasFrecuentes} />

        </Stack.Navigator>
    );
}
