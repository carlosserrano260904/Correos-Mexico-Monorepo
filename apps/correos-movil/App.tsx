import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider } from '@clerk/clerk-expo';
import AuthNavigator from './navigation/authNavigator';
import AppNavigator from './navigation/appNavigatior';
import VendedorNavigator from './navigation/vendedorNavigator';
import DistributorNavigator from './navigation/distributorNavigator';
import { AuthProvider, useMyAuth } from './context/AuthContext';
import { StripeProvider } from '@stripe/stripe-react-native';

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

if (!clerkKey || !stripeKey) {
  throw new Error('Missing API keys. Check your .env file');
}

function RootNavigation() {
  const { isAuthenticated, userRol } = useMyAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRol === 'usuario' || userRol === 'vendedor' ? (
        <AppNavigator />
      ) : userRol === 'repartidor' ? (
        <DistributorNavigator />
      ) : (
        <AuthNavigator />
      )
      }
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <AuthProvider>
        <StripeProvider
          publishableKey={stripeKey}
          merchantIdentifier="merchant.com.tuapp"
        >
          <RootNavigation />
        </StripeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
