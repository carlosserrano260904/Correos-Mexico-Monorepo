'use client'
import React, { useState, useEffect } from 'react';
import { Plantilla } from '@/components/plantilla';
import { 
  IoCubeOutline, 
  IoBusOutline, 
  IoCardOutline 
} from "react-icons/io5";
import BotonRegresar from '@/components/BotonRegresar';

// --- 1. DEFINICIÓN DE TIPOS (CONTRATO DE DATOS) ---
// NOTE FOR BACKEND: Esta es la estructura JSON que el Frontend espera recibir.

interface ProductItem {
  id: string | number;
  name: string;        // Ej: "Audífonos Bluetooth"
  quantity: number;    // Ej: 1
  price: number;       // Precio unitario o total por linea (según lógica de negocio)
  imageUrl?: string;   // URL de la imagen (opcional)
}

interface ShippingInfo {
  name: string;
  address: string;
  phone: string;
}

interface OrderDetails {
  id: string;          // Ej: "#ORD-2045"
  date: string;        // Formato ISO o texto formateado "15 Oct 2025"
  paymentMethod: string; // Ej: "Tarjeta **** 2345"
  status: 'Enviado' | 'Pendiente' | 'Entregado' | 'Cancelado'; 
  products: ProductItem[];
  shipping: ShippingInfo;
  costs: {
    subtotal: number;
    shippingCost: number;
    total: number;
  }
}

export default function DetallesPedidoPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // --- 2. FETCH DE DATOS ---
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        
        // NOTE FOR BACKEND: Aquí conectar su endpoint.
        // const res = await fetch('/api/orders/ORD-2045');
        // const data = await res.json();

        // Simulación de delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // DATOS MOCK (Idénticos al diseño)
        const mockData: OrderDetails = {
          id: "#ORD-2045",
          date: "15 Oct 2025",
          paymentMethod: "Tarjeta **** 2345",
          status: "Enviado",
          products: [
            { id: 1, name: "Audífonos Bluetooth", quantity: 1, price: 899 },
            { id: 2, name: "Cargador USB-C", quantity: 2, price: 499 },
          ],
          shipping: {
            name: "Juan Pérez",
            address: "Av. Reforma 123, Durango",
            phone: "+52 618 123 4567"
          },
          costs: {
            subtotal: 1398,
            shippingCost: 99,
            total: 1497
          }
        };

        setOrder(mockData);

      } catch (error) {
        console.error("Error cargando pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  // Helpers visuales
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(val);

  // Lógica de color según estado
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Enviado': return 'text-[#6BC146]'; // Verde (Diseño)
      case 'Pendiente': return 'text-[#D4AF37]';
      case 'Cancelado': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Plantilla>
      <div className="w-full min-h-screen bg-white font-sans text-slate-800 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">

            <BotonRegresar />
          
          <h1 className="text-3xl font-bold text-black mb-8">
            Detalles del pedido
          </h1>

          {loading ? (
             <div className="space-y-6 animate-pulse">
                <div className="h-40 bg-gray-100 rounded-2xl"></div>
                <div className="h-40 bg-gray-100 rounded-2xl"></div>
             </div>
          ) : order ? (
            <div className="space-y-6">
              
              {/* --- SECCIÓN 1: INFO GENERAL (ID, Fecha, Estado) --- */}
              <div className="w-full bg-[#F9F9F9] rounded-[20px] p-6 md:p-8">
                <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                  <span className="text-xl font-bold text-gray-700">ID:</span>
                  <span className="text-xl font-bold text-gray-700">{order.id}</span>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Fecha</p>
                    <p className="text-gray-800 font-medium text-lg">{order.date}</p>
                    
                    <p className="text-gray-500 text-sm mt-3">Pago</p>
                    <p className="text-gray-800 font-medium text-lg">{order.paymentMethod}</p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-gray-500 text-sm">Estado</p>
                    <p className={`font-medium text-xl ${getStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- SECCIÓN 2: PRODUCTOS --- */}
              <div className="w-full bg-[#F9F9F9] rounded-[20px] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                   <IoCubeOutline className="text-[#E91E63]" size={24} />
                   <h2 className="text-lg font-bold text-gray-800">Productos</h2>
                </div>

                <div className="space-y-6">
                  {order.products.map((prod, index) => (
                    <div key={prod.id}>
                      <div className="flex items-center gap-4">
                        {/* Placeholder de imagen (Gris como en el diseño) */}
                        <div className="w-20 h-14 bg-[#D9D9D9] rounded-md shrink-0">
                          {/* NOTE FOR BACKEND: Si envían 'imageUrl', aquí pondríamos una etiqueta <img /> */}
                        </div>

                        <div className="flex-1">
                          <p className="text-gray-800 font-medium text-lg">{prod.name}</p>
                          <p className="text-gray-500 text-sm">Cantidad: {prod.quantity}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-gray-900 font-bold text-lg">
                            {formatCurrency(prod.price)}
                          </p>
                        </div>
                      </div>
                      {/* Divisor (solo si no es el último elemento) */}
                      {index < order.products.length - 1 && (
                        <hr className="border-gray-300 mt-6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* --- SECCIÓN 3: ENVÍO --- */}
              <div className="w-full bg-[#F9F9F9] rounded-[20px] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                   <IoBusOutline className="text-[#E91E63]" size={24} />
                   <h2 className="text-lg font-bold text-gray-800">Envío</h2>
                </div>
                
                <div className="space-y-2 text-lg">
                  <div className="flex flex-col md:flex-row">
                     <span className="font-bold text-gray-700 w-28">Nombre:</span>
                     <span className="text-gray-600">{order.shipping.name}</span>
                  </div>
                  <div className="flex flex-col md:flex-row">
                     <span className="font-bold text-gray-700 w-28">Dirección:</span>
                     <span className="text-gray-600">{order.shipping.address}</span>
                  </div>
                  <div className="flex flex-col md:flex-row">
                     <span className="font-bold text-gray-700 w-28">Teléfono:</span>
                     <span className="text-gray-600">{order.shipping.phone}</span>
                  </div>
                </div>
              </div>

              {/* --- SECCIÓN 4: RESUMEN (Totales) --- */}
              <div className="w-full bg-[#F9F9F9] rounded-[20px] p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                   <IoCardOutline className="text-[#E91E63]" size={24} />
                   <h2 className="text-lg font-bold text-gray-800">Resumen</h2>
                </div>

                <div className="space-y-3 text-lg">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.costs.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>{formatCurrency(order.costs.shippingCost)}</span>
                  </div>

                  <hr className="border-gray-300 my-2" />

                  <div className="flex justify-between text-gray-900 font-bold text-xl">
                    <span>Total</span>
                    <span>{formatCurrency(order.costs.total)}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <p className="text-center text-red-500">No se pudo cargar el pedido.</p>
          )}

        </div>
      </div>
    </Plantilla>
  );
}