import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../schemas/schemas';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { fetchDocumentHtml } from '../../../api/documents';
import AppHeader  from '../../../components/common/AppHeader';

type PoliticasRouteProp = RouteProp<RootStackParamList, 'Politicas'>;

export default function Politicas() {
  const navigation = useNavigation();
  const route = useRoute<PoliticasRouteProp>();
  const key = route.params?.key;

  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setError('No se especificó la clave del documento.');
      return;
    }
    fetchDocumentHtml(key)
      .then(setHtml)
      .catch(err => {
        console.error(err);
        setError(`Error cargando documento: ${err.message}`);
      });
  }, [key]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppHeader title="Términos y condiciones" onBack={() => navigation.goBack()} />
      {/* Contenido */}
      {error ? (
        <View style={styles.center}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : !html ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <WebView originWhitelist={['*']} source={{ html }} style={styles.webview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webview: { flex: 1 },
});
