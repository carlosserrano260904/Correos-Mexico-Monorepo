  // schemas/schemas.ts
import { z } from 'zod';

// Perfil de usuario
export const ProfileUserSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  numero: z.string().nullable().optional(),
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
  ProductsScreen: undefined;
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

export const ContenidoSchema = z.object({
  id: z.number(),
  precio: z.string(),
  cantidad: z.number(),
  producto: ProductoSchema,
});

// --------------------------------------------------
// Compra (una transacción)
export const MisComprasSchema = z.object({
  id: z.number(),
  total: z.string(),
  diaTransaccion: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Debe ser fecha ISO válida' })
    .transform((s) => new Date(s)),
  profileId: z.number(),
  contenidos: z.array(ContenidoSchema),
});

// --------------------------------------------------
// Schema para la respuesta (array de compras)
export const MisComprasSchemaDB = z.array(MisComprasSchema);

// --------------------------------------------------
// Tipos TS
// 1) Tipo para una sola compra
export type MisComprasType = z.infer<typeof MisComprasSchema>;
// 2) Tipo para el array de compras
export type MisComprasResponse = z.infer<typeof MisComprasSchemaDB>;

//---------------------------------------------------
// Direcciones

export const DireccionesSchema=z.object({
  id: z.number(),
    nombre: z.string(),
    calle: z.string(),
    colonia_fraccionamiento: z.string(),
    numero_interior: z.number().nullable(),
    numero_exterior: z.number().nullable(), 
    numero_celular: z.string(),
    codigo_postal: z.string(),
    estado: z.string(),
    municipio: z.string(),
    mas_info: z.string().optional(),
    usuario: z.object({
      id: z.number(),
      nombre: z.string(),
      apellido: z.string(),
      numero: z.string(),
      estado: z.string(),
      ciudad: z.string(),
      fraccionamiento: z.string(),
      calle: z.string(),
      codigoPostal: z.string(),
      imagen: z.string(),
    }),
})

export const DireccionesSchemaDB = z.array(DireccionesSchema) 
export type DireccionesType = z.infer<typeof DireccionesSchemaDB>


//pedidosss


export const MisPedidosSchemaDB = z.array(
  z.object({
    id: z.number(),
    fecha: z.string(), // o z.date() si ya es tipo Date
    status: z.string(),
    total: z.number(),
    productos: z.array(
      z.object({
        producto_id: z.number(),
        cantidad: z.number(),
      })
    ),
  })
);

export type MisPedidosType = z.infer<typeof MisPedidosSchemaDB>[number];