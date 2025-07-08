import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/signIn';
import SignUpScreen  from '../screens/auth/signUp';
import PswdResetScreen from '../screens/auth/pswdReset';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="PswdReset" component={PswdResetScreen} />
        </Stack.Navigator>
    );
}   

