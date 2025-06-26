import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../schemas/schemas';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { moderateScale } from 'react-native-size-matters';

interface Package {
  id: string;
  sku: string;
  numero_guia: string;
  estatus: string;
  latitud: number;
  longitud: number;
  fecha_creacion: string;
  indicaciones: string;
  calle: string;
  colonia: string;
  cp: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'PackageScreen'> & {
  route: {
    params: {
      package: Package;
    };
  };
};

const PackageScreen: React.FC<Props> = ({ route, navigation }) => {
  const { package: packageData } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOpenMap = () => {
    // Lógica para abrir el mapa
    console.log('Abrir mapa con coordenadas:', packageData.latitud, packageData.longitud);
  };

  const handleDelivery = () => {
    // Lógica para confirmar entrega
    console.log('Confirmar entrega del paquete:', packageData.id);
  };

  type StatusType = 'entregado' | 'fallido' | 'pendiente' | 'en_ruta';

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return '#4CAF50';
      case 'fallido':
        return '#F44336';
      case 'pendiente':
        return '#FF9800';
      case 'en_ruta':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'entregado':
        return 'Entregado';
      case 'fallido':
        return 'Entrega Fallida';
      case 'pendiente':
        return 'Pendiente';
      case 'en_ruta':
        return 'En Ruta';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Paquete</Text>
        <TouchableOpacity onPress={handleOpenMap} style={styles.mapButton}>
          <Ionicons name="map" size={24} color="#DE1484" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mapa */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: packageData.latitud,
              longitude: packageData.longitud,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: packageData.latitud,
                longitude: packageData.longitud,
              }}
              title={`SKU: ${packageData.sku}`}
              description={`${packageData.calle}, ${packageData.colonia}`}
            />
          </MapView>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(packageData.estatus) }]}>
            <Text style={styles.statusText}>{getStatusText(packageData.estatus)}</Text>
          </View>
        </View>

        {/* Información Principal */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>SKU:</Text>
            <Text style={styles.value}>{packageData.sku}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Número de Guía:</Text>
            <Text style={styles.value}>{packageData.numero_guia}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID del Paquete:</Text>
            <Text style={styles.value}>{packageData.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fecha de Creación:</Text>
            <Text style={styles.value}>{formatDate(packageData.fecha_creacion)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Estatus:</Text>
            <Text style={styles.value}>{getStatusText(packageData.estatus)}</Text>
          </View>
        </View>

        {/* Indicaciones */}
        {packageData.indicaciones && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Indicaciones Especiales</Text>
            <Text style={styles.instructions}>{packageData.indicaciones}</Text>
          </View>
        )}

        {/* Dirección */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
          
          <View style={styles.addressGrid}>
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Calle</Text>
                <Text style={styles.addressValue}>{packageData.calle}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Colonia</Text>
                <Text style={styles.addressValue}>{packageData.colonia}</Text>
              </View>
            </View>
            
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Código Postal</Text>
                <Text style={styles.addressValue}>{packageData.cp}</Text>
              </View>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Latitud</Text>
                <Text style={styles.addressValue}>{packageData.latitud.toFixed(6)}</Text>
              </View>
            </View>
            
            <View style={styles.addressRow}>
              <View style={styles.addressItem}>
                <Text style={styles.addressLabel}>Longitud</Text>
                <Text style={styles.addressValue}>{packageData.longitud.toFixed(6)}</Text>
              </View>
              <View style={styles.addressItem}>
                {/* Espacio vacío para mantener el grid */}
                <Text style={styles.addressLabel}></Text>
                <Text style={styles.addressValue}></Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón de Entrega */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deliveryButton} onPress={handleDelivery}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          <Text style={styles.deliveryButtonText}>Confirmar Entrega</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoItemHeader}>
      {icon}
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  mapButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addressGrid: {
    gap: 12,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressItem: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 6,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  deliveryButton: {
    backgroundColor: '#DE1484',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  deliveryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PackageScreen;