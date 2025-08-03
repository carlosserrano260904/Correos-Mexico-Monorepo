import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  Calendar,
  ChevronRight,
  DollarSign,
  Download,
  FileText,
  RefreshCw,
  Search
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Colors = {
  primary: '#E91E63',
  white: '#FFFFFF',
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  background: '#F5F5F5',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const InvoiceHistoryScreen = () => {
  const navigation = useNavigation();
  
  // Estados para manejo de datos
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Datos de ejemplo (reemplazar con llamadas reales al backend)
  const mockInvoices = [
    {
      id: 'INV-001',
      number: 'F-2024-001',
      date: '2024-07-28',
      amount: 1250.00,
      status: 'paid',
      customer: 'Empresa ABC S.A.',
      dueDate: '2024-08-28',
      services: ['Envío Express', 'Seguro']
    },
    {
      id: 'INV-002',
      number: 'F-2024-002',
      date: '2024-07-25',
      amount: 875.50,
      status: 'pending',
      customer: 'Comercial XYZ Ltda.',
      dueDate: '2024-08-25',
      services: ['Envío Estándar']
    },
    {
      id: 'INV-003',
      number: 'F-2024-003',
      date: '2024-07-20',
      amount: 2100.75,
      status: 'overdue',
      customer: 'Distribuidora 123',
      dueDate: '2024-07-20',
      services: ['Envío Express', 'Embalaje Especial', 'Seguro']
    },
    {
      id: 'INV-004',
      number: 'F-2024-004',
      date: '2024-07-15',
      amount: 650.25,
      status: 'paid',
      customer: 'Tienda El Sol',
      dueDate: '2024-08-15',
      services: ['Envío Estándar', 'Embalaje']
    }
  ];

  // Hook para cargar datos iniciales
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Funciones para conexión con backend (a implementar con tu API)
  const fetchInvoices = async (filters = {}) => {
    setLoading(true);
    try {
      /*
      // CONEXIÓN BACKEND - Reemplazar esta sección con tu lógica real:
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/invoices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error fetching invoices');
      }
      
      const data = await response.json();
      setInvoices(data.invoices);
      */
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Alert.alert('Error', 'No se pudieron cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId) => {
    try {
      /*
      // DESCARGA DE FACTURA - Implementar con tu backend:
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/invoices/${invoiceId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        // Lógica para descargar el archivo en dispositivo móvil
      }
      */
      
      console.log('Downloading invoice:', invoiceId);
      Alert.alert('Descarga', `Descargando factura ${invoiceId}`);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Error', 'No se pudo descargar la factura');
    }
  };

  const searchInvoices = (query) => {
    setSearchQuery(query);
    /*
    // BÚSQUEDA EN BACKEND - Implementar debounce para optimizar:
    if (query.length > 2 || query.length === 0) {
      const searchParams = {
        search: query,
        status: selectedFilter !== 'all' ? selectedFilter : undefined
      };
      fetchInvoices(searchParams);
    }
    */
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  };

  // Filtros disponibles
  const filters = [
    { key: 'all', label: 'Todas', count: invoices.length },
    { key: 'paid', label: 'Pagadas', count: invoices.filter(inv => inv.status === 'paid').length },
    { key: 'pending', label: 'Pendientes', count: invoices.filter(inv => inv.status === 'pending').length },
    { key: 'overdue', label: 'Vencidas', count: invoices.filter(inv => inv.status === 'overdue').length }
  ];

  // Función para obtener color del estado
  const getStatusColor = (status) => {
    const colors = {
      paid: Colors.success,
      pending: Colors.warning,
      overdue: Colors.error
    };
    return colors[status] || Colors.gray;
  };

  // Función para obtener texto del estado
  const getStatusText = (status) => {
    const texts = {
      paid: 'Pagada',
      pending: 'Pendiente',
      overdue: 'Vencida'
    };
    return texts[status] || 'Desconocido';
  };

  // Facturas filtradas
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const CustomHeader = () => (
    <View style={headerStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Regresar"
          accessibilityHint="Regresa a la pantalla anterior"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View>
          <Text style={headerStyles.headerTitle}>Historial de Facturas</Text>
          <Text style={headerStyles.headerSubtitle}>Correos Móvil</Text>
        </View>
      </View>
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Search size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por número o cliente..."
          placeholderTextColor={Colors.gray}
          value={searchQuery}
          onChangeText={searchInvoices}
        />
      </View>
    </View>
  );

  const FilterButtons = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={[
              styles.filterButton,
              selectedFilter === filter.key ? styles.filterButtonActive : styles.filterButtonInactive
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.key ? styles.filterButtonTextActive : styles.filterButtonTextInactive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              selectedFilter === filter.key ? styles.filterBadgeActive : styles.filterBadgeInactive
            ]}>
              <Text style={[
                styles.filterBadgeText,
                selectedFilter === filter.key ? styles.filterBadgeTextActive : styles.filterBadgeTextInactive
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const RefreshButton = () => (
    <View style={styles.refreshContainer}>
      <TouchableOpacity
        onPress={onRefresh}
        disabled={refreshing}
        style={styles.refreshButton}
      >
        <RefreshCw size={16} color={Colors.primary} />
        <Text style={styles.refreshButtonText}>
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderInvoiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.invoiceCard}
      onPress={() => {
        /*
        // NAVEGACIÓN A DETALLE - Implementar con tu navegación:
        // Para Expo Router: router.push(`/invoices/${item.id}`);
        // Para React Navigation: navigation.navigate('InvoiceDetail', { invoiceId: item.id });
        */
        console.log('Navigate to invoice detail:', item.id);
      }}
    >
      {/* Header de la factura */}
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceHeaderLeft}>
          <Text style={styles.invoiceNumber}>{item.number}</Text>
          <Text style={styles.invoiceCustomer}>{item.customer}</Text>
        </View>
        <View style={styles.invoiceHeaderRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.invoiceMainInfo}>
        <View style={styles.amountContainer}>
          <DollarSign size={18} color={Colors.primary} />
          <Text style={styles.invoiceAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={Colors.gray} />
          <Text style={styles.invoiceDate}>{formatDate(item.date)}</Text>
        </View>
      </View>

      {/* Servicios */}
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesLabel}>SERVICIOS:</Text>
        <View style={styles.servicesTagsContainer}>
          {item.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.invoiceFooter}>
        <Text style={styles.dueDateText}>
          Vence: {formatDate(item.dueDate)}
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            downloadInvoice(item.id);
          }}
          style={styles.downloadButton}
        >
          <Download size={16} color={Colors.primary} />
          <Text style={styles.downloadButtonText}>Descargar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <FileText size={48} color={Colors.lightGray} />
      <Text style={styles.emptyStateTitle}>No hay facturas</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery ? 'No se encontraron facturas con esos criterios' : 'Aún no tienes facturas registradas'}
      </Text>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Cargando facturas...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <CustomHeader />
      
      <View style={styles.content}>
        <SearchBar />
        <FilterButtons />
        <RefreshButton />
        
        {loading ? (
          <LoadingState />
        ) : filteredInvoices.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredInvoices}
            keyExtractor={(item) => item.id}
            renderItem={renderInvoiceItem}
            contentContainerStyle={styles.invoicesList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
              />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    paddingTop: height * 0.06,
    backgroundColor: Colors.white,
    minHeight: height * 0.12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: width * 0.02,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.dark,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingVertical: 12,
  },
  filtersScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#fdf2f8',
    borderColor: '#f9a8d4',
  },
  filterButtonInactive: {
    backgroundColor: Colors.background,
    borderColor: Colors.lightGray,
  },
  filterButtonText: {
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#be185d',
  },
  filterButtonTextInactive: {
    color: Colors.gray,
  },
  filterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterBadgeActive: {
    backgroundColor: '#be185d',
  },
  filterBadgeInactive: {
    backgroundColor: Colors.gray,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterBadgeTextActive: {
    color: Colors.white,
  },
  filterBadgeTextInactive: {
    color: Colors.white,
  },
  refreshContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  invoicesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  invoiceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  invoiceHeaderLeft: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  invoiceCustomer: {
    fontSize: 14,
    color: Colors.gray,
  },
  invoiceHeaderRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  invoiceMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceDate: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 8,
  },
  servicesContainer: {
    marginBottom: 16,
  },
  servicesLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 8,
  },
  servicesTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  dueDateText: {
    fontSize: 12,
    color: Colors.gray,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    borderWidth: 1,
    borderColor: '#f9a8d4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 16,
  },
});

export default InvoiceHistoryScreen;