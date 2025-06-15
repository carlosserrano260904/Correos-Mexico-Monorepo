import {z} from 'zod'

export const ProfileUserSchema = z.object({
    nombre : z.string(),
    apellido:z.string(),
    numero:z.string(),
    estado:z.string(),
    ciudad:z.string(),
    fraccionamiento:z.string(),
    calle:z.string(),
    codigoPostal:z.string()
})

export const ProfilesSchema=z.array(ProfileUserSchema)

export type SchemaProfileUser = z.infer<typeof ProfileUserSchema>

export type RootStackParamList = {
  HomeUser: undefined;
  Product: undefined;
  RoutesView: undefined;
  Package: undefined;
  ProfileUser: undefined;
  UserDetailsScreen: { user: SchemaProfileUser };
};