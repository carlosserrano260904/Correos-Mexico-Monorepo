export interface ProductoPedido {
  sku: string;
  nombre: string;
  cantidad: number;
  estado: string;
}

export interface ClienteInfo {
  nombre: string;
  direccion: string;
}

export interface PedidoAsignado {
  id: number;
  fecha: string;
  cliente: ClienteInfo;
  productos: ProductoPedido[];
}

export interface PedidosAsignadosResponse {
  data: PedidoAsignado[];
  total: number;
  status: string;
}
