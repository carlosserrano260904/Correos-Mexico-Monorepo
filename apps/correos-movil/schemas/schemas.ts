import {z} from 'zod'

export const ProfileUserSchema = z.object({
    nombre : z.string(),
    apellido:z.string(),
    numero:z.string(),
    estado:z.string(),
    ciudad:z.string(),
    fraccionamiento:z.string(),
    calle:z.string(),
    codigoPostal:z.string(),
    imagen:z.string()
})

export const ProfilesSchema=z.array(ProfileUserSchema)

export type SchemaProfileUser = z.infer<typeof ProfileUserSchema>

export type RootStackParamList = {
  HomeUser: undefined;
  Product: undefined;
  ProductsScreen: undefined;
  RoutesView: undefined;
  Package: undefined;
  ProfileUser: undefined;
  UserDetailsScreen: { user: SchemaProfileUser };
  MisCompras:undefined
};

export const ProductoSchema = z.object({
  id:z.number(),
  nombre:z.string(),
  descripcion:z.string(),
  imagen:z.string(),
  inventario:z.number(),
  precio:z.string()
})

export const ContenidoSchema = z.object({
  id:z.number(),
  precio:z.string(),
  cantidad:z.number(),
  producto:ProductoSchema
})

export const MisComprasSchema=z.object({
  id:z.number(),
  total:z.string(),
  diaTransaccion:z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), { message: 'Debe ser fecha ISO válida' })
    .transform((s) => new Date(s)),
  profileId:z.number(),
  contenidos:z.array(ContenidoSchema)
})

export const MisComprasSchemaDB = z.array(MisComprasSchema) 
export type MisComprasType = z.infer<typeof MisComprasSchemaDB>
