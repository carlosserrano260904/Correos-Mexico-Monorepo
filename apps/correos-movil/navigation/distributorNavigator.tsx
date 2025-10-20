import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../schemas/schemas';

import FailedDeliveryScreen from '../screens/repartidor/FailedDeliveryScreen';
import LoadPackages from '../screens/repartidor/LoadPackages';
import LoadPackagesCarrier from '../screens/repartidor/LoadPackagesCarrier';
import MainPageDistributor from '../screens/repartidor/MainPageDistributor';
import NameOfReceivePerson from '../screens/repartidor/NameOfReceivePerson';
import PackageScreen from '../screens/repartidor/PackageScreen';
import PackagesListCarrier from '../screens/repartidor/PackagesListCarrier';
import PackagesListDistributor from '../screens/repartidor/PackagesListDistributor';
import QRScannerScreen from '../screens/repartidor/QRScannerScreen';
import ReceivePackage from '../screens/repartidor/ReceivePackage';
import RoutesView from '../screens/repartidor/RoutesView';
import TakeEvidenceScreen from '../screens/repartidor/TakeEvidenceScreen';
import MainLoadPackagesDistributor from '../screens/repartidor/MainLoadPackagesDistributor';
import MapRouteView from '../screens/repartidor/MapRouteView';
import ListViewDistributor from '../screens/repartidor/ListViewDistributor';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function DistributorNavigator() {
    return (
        <Stack.Navigator initialRouteName='DistributorPage' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FailedDelivery" component={FailedDeliveryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LoadPackages" component={LoadPackages} options={{ headerShown: false }} />
            <Stack.Screen name="LoadPackagesCarrier" component={LoadPackagesCarrier} options={{headerShown: false}} />
            <Stack.Screen name="DistributorPage" component={MainPageDistributor} options={{ headerShown: false }} />
            <Stack.Screen name="NombreQuienRecibe" component={NameOfReceivePerson} options={{headerShown: false}} />
            <Stack.Screen name="PackageScreen" component={PackageScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PackagesListCarrier" component={PackagesListCarrier} options={{headerShown: false}} />
            <Stack.Screen name="PackagesList" component={PackagesListDistributor} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RecibirPaquete" component={ReceivePackage} options={{ headerShown: false }} />
            <Stack.Screen name="RoutesView" component={RoutesView} options={{ headerShown: false }} />
            <Stack.Screen name="TomarEvidencia" component={TakeEvidenceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainLoadPackagesDistributor" component={MainLoadPackagesDistributor} options={{ headerShown: false }} />
            <Stack.Screen name="MapRouteView" component={MapRouteView} options={{ headerShown: false }} />
            <Stack.Screen name="ListViewDistributor" component={ListViewDistributor} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}   
