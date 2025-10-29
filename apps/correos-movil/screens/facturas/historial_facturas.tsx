import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  Calendar,
  ChevronRight,
  DollarSign,
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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface Factura {
  id: number;
  precio: number;
  status: string;
  sucursal: string;
  numero_factura: string;
  fecha_creacion: string;
  fecha_vencimiento: string;
  productos: string[];
  profileId: number;
}

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <Search size={20} color={Colors.gray} />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por número o sucursal..."
        placeholderTextColor={Colors.gray}
        value={searchQuery}
        onChangeText={onSearch}
      />
    </View>
  </View>
);

import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ProfileUser: undefined;
  Tabs: undefined;
  // ...other routes if needed
};

const InvoiceHistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [userId, setUserId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const init = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        fetchInvoices(storedUserId);
      } else {
        console.warn('No se encontró userId en AsyncStorage');
      }
    };
    init();
  }, []);

  const fetchInvoices = async (profileId: string) => {
  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('token:', token);
    console.log('profileId usado:', profileId);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/facturas/profile/${profileId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // 👈 mensaje del backend
      console.error('❌ Error HTTP:', response.status);
      console.error('❌ Respuesta del backend:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Facturas obtenidas:', data);
    setInvoices(data);
  } catch (error) {
    console.error('❌ Error fetching invoices:', error);
    Alert.alert('Error', 'No se pudieron cargar las facturas');
  } finally {
    setLoading(false);
  }
};



const onRefresh = async () => {
  if (!userId) return;
  setRefreshing(true);
  await fetchInvoices(userId);
  setRefreshing(false);
};


  const filters = [
    { key: 'all', label: 'Todas', count: invoices.length },
    { key: 'paid', label: 'Pagadas', count: invoices.filter(inv => inv.status === 'paid').length },
    { key: 'pending', label: 'Pendientes', count: invoices.filter(inv => inv.status === 'pending').length },
    { key: 'overdue', label: 'Vencidas', count: invoices.filter(inv => inv.status === 'overdue').length }
  ];

  interface StatusColors {
    paid: string;
    pending: string;
    overdue: string;
    [key: string]: string;
  }

  type InvoiceStatus = 'paid' | 'pending' | 'overdue' | string;

  const getStatusColor = (status: InvoiceStatus): string => {
    const colors: StatusColors = {
      paid: Colors.success,
      pending: Colors.warning,
      overdue: Colors.error
    };
    return colors[status] || Colors.gray;
  };

  interface StatusTexts {
    paid: string;
    pending: string;
    overdue: string;
    [key: string]: string;
  }

  const getStatusText = (status: InvoiceStatus): string => {
    const texts: StatusTexts = {
      paid: 'Pagada',
      pending: 'Pendiente',
      overdue: 'Vencida'
    };
    return texts[status] || 'Desconocido';
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.numero_factura.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.sucursal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  interface FormatDateOptions {
    day: '2-digit' | 'numeric';
    month: '2-digit' | 'numeric' | 'long' | 'short' | 'narrow';
    year: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string): string => {
    const options: FormatDateOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  interface FormatCurrencyOptions {
    style: 'currency';
    currency: string;
  }

  const formatCurrency = (amount: number): string => {
    const options: FormatCurrencyOptions = {
      style: 'currency',
      currency: 'MXN'
    };
    return new Intl.NumberFormat('es-MX', options).format(amount);
  };

  const CustomHeader = () => (
    <View style={headerStyles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            navigation.navigate("Tabs")
          }}
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

  const renderInvoiceItem = ({ item }: { item: Factura }) => (
    <TouchableOpacity
      style={styles.invoiceCard}
      onPress={() => {
        console.log('Navigate to invoice detail:', item.id);
      }}
    >
      <View style={styles.invoiceHeader}>
        <View style={styles.invoiceHeaderLeft}>
          <Text style={styles.invoiceNumber}>{item.numero_factura}</Text>
          <Text style={styles.invoiceCustomer}>{item.sucursal}</Text>
        </View>
        <View style={styles.invoiceHeaderRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          <ChevronRight size={20} color={Colors.lightGray} />
        </View>
      </View>

      <View style={styles.invoiceMainInfo}>
        <View style={styles.amountContainer}>
          <DollarSign size={18} color={Colors.primary} />
          <Text style={styles.invoiceAmount}>{formatCurrency(item.precio)}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={Colors.gray} />
          <Text style={styles.invoiceDate}>{formatDate(item.fecha_creacion)}</Text>
        </View>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={styles.servicesLabel}>PRODUCTOS:</Text>
        <View style={styles.servicesTagsContainer}>
          {item.productos.map((producto, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{producto}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.invoiceFooter}>
        <Text style={styles.dueDateText}>
          Vence: {formatDate(item.fecha_vencimiento)}
        </Text>
        
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
    <>
      <CustomHeader />
      
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
  
        <View style={styles.content}>
          <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
          <FilterButtons />
          <RefreshButton />
  
          {loading ? (
            <LoadingState />
          ) : filteredInvoices.length === 0 ? (
            <EmptyState />
          ) : (
            <FlatList
              data={filteredInvoices}
              keyExtractor={(item) => item.id.toString()}
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
    </>
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