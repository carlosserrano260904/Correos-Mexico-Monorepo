// Politicas.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RouteParams = {
  Politicas: {
    fragment: string;  // '' | '#:~:text=...'
  };
};

export default function Politicas() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'Politicas'>>();
  const fragment = route.params?.fragment ?? '';
  const baseUrl =
    'https://www.correosclic.gob.mx/t%C3%A9rminos-y-condiciones-correosclic';
  const uri = `${baseUrl}${fragment}`;

 
    const handleBackHome = () => {
        navigation.navigate('ProfileUser');
    };
  return (
    <View style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackHome} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={28}
            color="#E6007A"
            style={styles.glowIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
      </View>

      {/* WebView */}
      <WebView
        source={{ uri }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#333',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 40, // para centrar respecto al back button
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
