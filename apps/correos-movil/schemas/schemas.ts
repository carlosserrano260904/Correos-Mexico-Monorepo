 // schemas/schemas.ts
import { z } from 'zod';

// Perfil de usuario
export const ProfileUserSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  numero: z.string().nullable().optional,
  estado: z.string(),
  ciudad: z.string(),
  fraccionamiento: z.string(),
  calle: z.string(),
  codigoPostal: z.string(),
  imagen: z.string(),
});
export const ProfilesSchema = z.array(ProfileUserSchema);
export type SchemaProfileUser = z.infer<typeof ProfileUserSchema>;

export type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  author: { name: string; avatar: string };
  images: string[];
};

// Tipos de navegación (Stack Params)
export type RootStackParamList = {
   ReviewDetail: { review: Review; startIndex?: number };
  Carrito: undefined;
  Favorito : undefined;
  Politicas:undefined
  Productos:undefined
  AgregarTarjetaScreen:undefined
  MisTarjetasScreen:undefined
  Direcciones:undefined
  ListaPedidosScreen:undefined
  SeguimientoEnvioSimulado:undefined
  BarraProgresoEnvio:undefined
  MisPedidosScreen:undefined
  Resumen:undefined
  MapaPuntosRecogida:undefined
  Envio:undefined
  Pago:undefined
  Tarifador:undefined
  ChatBot:undefined
  LoadPackages:undefined
  DistributorPage:undefined
  QRScanner:undefined
  ProductView:undefined
  Tabs:undefined
  HomeUser: undefined;
  Product: undefined;
  ProductsScreen: { categoria?: string, searchText?: string; };
  RoutesView: undefined;
  Package: undefined;
  ProfileUser: undefined;
  PublicarProducto:undefined
  PackagesList:undefined
  ProductUploadScreen: undefined;
  UserDetailsScreen: { user: SchemaProfileUser };
  MisCompras: undefined;
  PackagesListDistributor: undefined;
  PackageScreen: { package: any };
  DetalleProducto: {
    pedidoId: string;
    fecha: string;
    totalPedido: number;
    producto: {
      nombre: string; descripcion?: string; categoria?: string;
      imagen?: string; precio: number;
    };
    cantidad: number;
    direccion?: { /* opcional */ };
    pago?: { brand?: string; last4?: string };
  };
  RecibirPaquete: { package: any };
  TomarEvidencia: { package: any };
  FormularioVendedor: undefined;
  HistorialFacturas: undefined;
};

// Producto y contenidos
export const ProductoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  imagen: z.string().nullable().optional(),
  categoria: z.string().nullable(),
  inventario: z.number(),
  precio: z.string(),
});