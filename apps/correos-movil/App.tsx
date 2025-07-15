import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider } from '@clerk/clerk-expo';
import AuthNavigator from './navigation/authNavigator';
import AppNavigator from './navigation/appNavigatior';
import { AuthProvider, useMyAuth } from './context/AuthContext';

function RootNavigation() {
  const { isAuthenticated } = useMyAuth();

  // Show loading while Clerk is initializing
  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
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
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ClerkProvider>  
  );
}