import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider } from '@clerk/clerk-expo';
import AuthNavigator from './navigation/authNavigator';
import AppNavigator from './navigation/appNavigatior';
import { AuthProvider, useMyAuth } from './context/AuthContext';
import VendedorNavigator from './navigation/vendedorNavigator';
import { StripeProvider } from '@stripe/stripe-react-native'; // 👈 Importar StripeProvider

function RootNavigation() {
  const { isAuthenticated, userRol } = useMyAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRol === 'vendedor' ? (
        <VendedorNavigator />
      ) : userRol === 'usuario' ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

if (!clerkKey || !stripeKey) {
  throw new Error('Missing API keys. Check your .env file');
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <AuthProvider>
        <StripeProvider
          publishableKey={stripeKey}
          merchantIdentifier="merchant.com.tuapp" // Requerido para Apple Pay (puedes dejarlo así si no usas Apple Pay)
        >
          <RootNavigation />
        </StripeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
