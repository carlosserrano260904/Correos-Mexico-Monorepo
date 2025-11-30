// schemas/auth.ts
import { z } from 'zod';

export const DireccionesSchema = z.object({
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
    numero: z.string().nullable(),
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
