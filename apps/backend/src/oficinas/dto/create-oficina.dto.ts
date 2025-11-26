import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDecimal,
  IsBoolean,
} from 'class-validator';

export class CreateOficinaDto {
  @IsString()
  clave_oficina_postal: string;

  @IsString()
  clave_cuo: string;

  @IsString()
  clave_inmueble: string;

  @IsString()
  clave_inegi: string;

  @IsString()
  clave_entidad: string;

  @IsString()
  nombre_entidad: string;

  @IsString()
  nombre_municipio: string;

  @IsEnum([
    'Centro Operativo Mexpost',
    'Centro de Distribución',
    'Administración Postal',
    'Gerencia Postal Estatal',
    'Oficina de Servicios Directos',
    'Sucursal',
    'Módulo de Depósitos Masivos',
    'Centro Operativo de Reparto',
    'Gerencia',
    'Centro de Atención al Público',
    'Oficina de Transbordo',
    'Coordinación Operativa',
    'Oficina Operativa',
    'Consol. de Ingresos y Egresos',
    'Coordinación Mexpost',
    'Puerto Maritimo',
    'Agencia Municipal',
    'Centro de Atención Integral',
    'Aeropuerto',
    'Subdirección',
    'Dirección',
    'Otros',
    'Módulo de Servicios',
    'Coordinación Administrativa',
    'Almacen',
    'Dirección General',
    'Tienda Filatélica',
    'Oficina de Cambio',
    'Of. Sindicato',
    'Centro de Depósitos Masivos',
  ])
  tipo_cuo: string;

  @IsString()
  nombre_cuo: string;

  @IsString()
  domicilio: string;

  @IsString()
  codigo_postal: string;

  @IsString()
  telefono: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsString()
  horario_atencion?: string;
}
