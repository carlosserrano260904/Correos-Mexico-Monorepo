import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../schemas/schemas';
import { moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Feather';
import { fetchDocumentHtml } from '../../../api/documents';

type PoliticasRouteProp = RouteProp<RootStackParamList, 'Politicas'>;

export default function Politicas() {
  const navigation = useNavigation();
  const route = useRoute<PoliticasRouteProp>();
  const key = route.params?.key;
  const title =
    // si envías title desde navigate(..., { title: '...' })
    (route.params as any)?.title || 'Términos y condiciones';

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
    <View style={{ flex: 1, backgroundColor: 'fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#E6007A" />
      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          
          <View style={{ width: moderateScale(22) }} />
        </View>
      </SafeAreaView>

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
  headerContainer: {
    backgroundColor: '#E6007A',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: moderateScale(12),
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#fff',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webview: { flex: 1 },
});
