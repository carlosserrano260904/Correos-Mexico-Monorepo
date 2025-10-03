import { DollarSign, Download, Eye, FileText, MoreHorizontal, Plus, RefreshCw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

type Invoice = {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: string;
  customer: string;
  dueDate: string;
  services: string[];
  paymentMethod: string;
};

const HistorialFacturasWeb = () => {
  // ... (todo tu código está aquí exactamente igual)

  // Estados para manejo de datos
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Datos de ejemplo expandidos para web
  const mockInvoices = [
    {
      id: 'INV-001',
      number: 'F-2024-001',
      date: '2024-07-28',
      amount: 1250.00,
      status: 'paid',
      customer: 'Empresa ABC S.A.',
      dueDate: '2024-08-28',
      services: ['Envío Express', 'Seguro'],
      paymentMethod: 'Transferencia'
    },
    {
      id: 'INV-002',
      number: 'F-2024-002',
      date: '2024-07-25',
      amount: 875.50,
      status: 'pending',
      customer: 'Comercial XYZ Ltda.',
      dueDate: '2024-08-25',
      services: ['Envío Estándar'],
      paymentMethod: 'Cheque'
    },
    {
      id: 'INV-003',
      number: 'F-2024-003',
      date: '2024-07-20',
      amount: 2100.75,
      status: 'overdue',
      customer: 'Distribuidora 123',
      dueDate: '2024-07-20',
      services: ['Envío Express', 'Embalaje Especial', 'Seguro'],
      paymentMethod: 'Efectivo'
    },
    {
      id: 'INV-004',
      number: 'F-2024-004',
      date: '2024-07-15',
      amount: 650.25,
      status: 'paid',
      customer: 'Tienda El Sol',
      dueDate: '2024-08-15',
      services: ['Envío Estándar', 'Embalaje'],
      paymentMethod: 'Tarjeta'
    },
    {
      id: 'INV-005',
      number: 'F-2024-005',
      date: '2024-07-10',
      amount: 1850.00,
      status: 'pending',
      customer: 'Corporativo Delta',
      dueDate: '2024-08-10',
      services: ['Envío Express', 'Seguro', 'Tracking Premium'],
      paymentMethod: 'Transferencia'
    },
    {
      id: 'INV-006',
      number: 'F-2024-006',
      date: '2024-07-05',
      amount: 425.75,
      status: 'paid',
      customer: 'MiniMarket Luna',
      dueDate: '2024-08-05',
      services: ['Envío Estándar'],
      paymentMethod: 'Efectivo'
    }
  ];

  // Hook para cargar datos iniciales
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Funciones para conexión con backend
  const fetchInvoices = async (filters = {}) => {
    setLoading(true);
    try {
      /*
      // CONEXIÓN BACKEND WEB - Implementar con tu API:
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/invoices`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error fetching invoices');
      }
      
      const data = await response.json();
      setInvoices(data.invoices || []);
      */
      
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      setInvoices(mockInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setLoading(false);
    }
  };

  interface DownloadInvoiceOptions {
    invoiceId: string;
  }

  const downloadInvoice = async (invoiceId: string): Promise<void> => {
    try {
      /*
      // DESCARGA DE FACTURA WEB:
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/invoices/${invoiceId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${invoiceId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      */
      
      console.log('Downloading invoice:', invoiceId);
      // Simulación de descarga
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = '#';
      link.download = `factura-${invoiceId}.pdf`;
      link.click();
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  interface SearchInvoicesParams {
    query: string;
  }

  const searchInvoices = (query: string): void => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination
    /*
    // BÚSQUEDA EN BACKEND:
    if (query.length > 2 || query.length === 0) {
      const searchParams: {
        search: string;
        status?: string;
        page: number;
        limit: number;
      } = {
        search: query,
        status: selectedFilter !== 'all' ? selectedFilter : undefined,
        page: 1,
        limit: itemsPerPage
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

  // Estadísticas para dashboard
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0)
  };

  // Filtros disponibles
  const filters = [
    { key: 'all', label: 'Todas', count: stats.total },
    { key: 'paid', label: 'Pagadas', count: stats.paid },
    { key: 'pending', label: 'Pendientes', count: stats.pending },
    { key: 'overdue', label: 'Vencidas', count: stats.overdue }
  ];

  // Función para obtener color del estado
  interface StatusColors {
    paid: string;
    pending: string;
    overdue: string;
    [key: string]: string;
  }

  type InvoiceStatus = 'paid' | 'pending' | 'overdue' | string;

  const getStatusColor = (status: InvoiceStatus): string => {
    const colors: StatusColors = {
      paid: '#10B981',
      pending: '#F59E0B', 
      overdue: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  // Función para obtener texto del estado
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

  // Facturas filtradas
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Paginación
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  interface FormatDateOptions {
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
  }

  const formatDate = (
    dateString: string,
    { locale = 'es-MX', options = { day: '2-digit', month: '2-digit', year: 'numeric' } }: FormatDateOptions = {}
  ): string => {
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  interface FormatCurrencyOptions {
    locale?: string;
    currency?: string;
  }

  const formatCurrency = (
    amount: number,
    { locale = 'es-MX', currency = 'MXN' }: FormatCurrencyOptions = {}
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Historial de Facturas
              </h1>
              <p className="text-gray-600">
                Correos Móvil - Panel Web
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span className="font-medium">
                  {refreshing ? 'Actualizando...' : 'Actualizar'}
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors">
                <Plus size={18} />
                <span className="font-medium">Nueva Factura</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Facturas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-pink-600">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Buscador */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none"
                    placeholder="Buscar por número de factura o cliente..."
                    value={searchQuery}
                    onChange={(e) => searchInvoices(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => {
                      setSelectedFilter(filter.key);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      selectedFilter === filter.key
                        ? 'bg-pink-50 border-pink-300 text-pink-700'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{filter.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedFilter === filter.key
                        ? 'bg-pink-700 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabla de facturas */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Cargando facturas...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <FileText size={64} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hay facturas
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchQuery ? 'No se encontraron facturas que coincidan con tu búsqueda' : 'Aún no tienes facturas registradas en el sistema'}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Factura
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vencimiento
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicios
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {invoice.number}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {invoice.customer}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: getStatusColor(invoice.status) }}
                          >
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {invoice.services.slice(0, 2).map((service, index) => (
                              <span
                                key={index}
                                className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {service}
                              </span>
                            ))}
                            {invoice.services.length > 2 && (
                              <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                +{invoice.services.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                /*
                                // NAVEGACIÓN A DETALLE WEB:
                                // window.location.href = `/invoices/${invoice.id}`;
                                // O con React Router: navigate(`/invoices/${invoice.id}`);
                                */
                                console.log('View invoice:', invoice.id);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Ver detalle"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => downloadInvoice(invoice.id)}
                              className="p-2 text-pink-400 hover:text-pink-600 transition-colors"
                              title="Descargar"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Más opciones"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} de {filteredInvoices.length} facturas
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      {getPaginationRange().map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border rounded text-sm ${
                            currentPage === page
                              ? 'bg-pink-600 text-white border-pink-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialFacturasWeb;