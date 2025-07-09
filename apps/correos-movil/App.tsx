import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { View, Text, ActivityIndicator } from 'react-native';
import AuthNavigator from './navigation/authNavigator';
import AppNavigator from './navigation/appNavigatior';

function RootNavigation() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <RootNavigation />
    </ClerkProvider>
  );
}