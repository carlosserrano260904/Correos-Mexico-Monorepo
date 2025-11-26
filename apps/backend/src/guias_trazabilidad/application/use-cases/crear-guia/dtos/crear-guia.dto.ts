import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TipoServicio } from './tipo-servicio.enum';

class DireccionDto {
  @ApiProperty({ example: 'Av. Reforma', description: 'El nombre de la calle' })
  @IsString()
  @IsNotEmpty({ message: 'El campo calle es requerido' })
  calle: string;
  @ApiProperty({ example: '456', description: 'El numero de la vivienda' })
  @IsString()
  @IsNotEmpty({ message: 'El campo numero es requerido' })
  numero: string;
  @ApiProperty({
    example: 'Depto 3B',
    required: false,
    nullable: true,
    description: 'El numero interior de la direccion',
  })
  @IsString()
  @IsOptional()
  numeroInterior?: string;
  @ApiProperty({
    example: 'Juarez',
    required: false,
    nullable: true,
    description: 'El fraccionamiento, colonia, barrio, ejido, rancho, etc.',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo asentamiento es requerido' })
  asentamiento: string;
  @ApiProperty({
    example: '06600',
    description: 'El codigo postal de la direccion',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo codigoPostal es requerido' })
  codigoPostal: string;
  @ApiProperty({
    example: 'Ciudad de Mexico',
    description:
      'La localidad de la direccion, el correo no usa municipios ni alcaldias, solo usa la localidad asociada directamente al codigo postal',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo localidad es requerido' })
  localidad: string;
  @ApiProperty({ example: 'CDMX', description: 'El estado de la direccion' })
  @IsString()
  @IsNotEmpty({ message: 'El campo estado es requerido' })
  estado: string;
  @ApiProperty({ example: 'Mexico', description: 'El pais de la direccion' })
  @IsString()
  @IsNotEmpty({ message: 'El campo pais es requerido' })
  pais: string;
  @ApiProperty({
    example: 'Entre Niza y Florencia, edificio azul',
    required: false,
    nullable: true,
    description: 'La referencia de la direccion',
  })
  @IsString()
  @IsOptional()
  referencia?: string;
}

class DimensionesDto {
  @ApiProperty({
    example: 25,
    description: 'El alto de la caja en centimetros',
  })
  @IsNumber({}, { message: 'El campo alto debe ser un numero' })
  @IsPositive({ message: 'El campo alto debe ser un numero positivo' })
  @IsNotEmpty({ message: 'El campo alto es requerido' })
  alto_cm: number;
  @ApiProperty({
    example: 30,
    description: 'El ancho de la caja en centimetros',
  })
  @IsNumber({}, { message: 'El campo ancho debe ser un numero' })
  @IsPositive({ message: 'El campo ancho debe ser un numero positivo' })
  @IsNotEmpty({ message: 'El campo ancho es requerido' })
  ancho_cm: number;
  @ApiProperty({
    example: 40,
    description: 'El largo de la caja en centimetros',
  })
  @IsNumber({}, { message: 'El campo largo debe ser un numero' })
  @IsPositive({ message: 'El campo largo debe ser un numero positivo' })
  @IsNotEmpty({ message: 'El campo largo es requerido' })
  largo_cm: number;
}

class ContactoDto {
  @ApiProperty({
    example: 'Juan Carlos',
    description: 'Los nombres del contacto',
  })
  @IsString({ message: 'El campo nombres debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo nombres es requerido' })
  nombres: string;
  @ApiProperty({
    example: 'Garcia Lopez',
    description: 'Los apellidos del contacto',
  })
  @IsString({ message: 'El campo apellidos debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo apellidos es requerido' })
  apellidos: string;
  @ApiProperty({
    example: '+525512345678',
    description: 'El telefono del contacto (sin espacios)',
  })
  @IsString({ message: 'El campo telefono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo telefono es requerido' })
  telefono: string;
  @ApiProperty({
    example: {
      calle: 'Av. Reforma',
      numero: '456',
      numeroInterior: 'Depto 3B',
      asentamiento: 'Juarez',
      codigoPostal: '06600',
      localidad: 'Ciudad de Mexico',
      estado: 'CDMX',
      pais: 'Mexico',
      referencia: 'Entre Niza y Florencia, edificio azul',
    },
    description: 'La direccion del contacto',
  })
  @ValidateNested({ message: 'El campo direccion debe ser un objeto' })
  @Type(() => DireccionDto)
  direccion: DireccionDto;
}

export class CrearGuiaDto {
  @ApiProperty({
    example: {
      nombres: 'Juan Carlos',
      apellidos: 'Garcia Lopez',
      telefono: '+525512345678',
      direccion: {
        calle: 'Diamante',
        numero: '328',
        asentamiento: 'Joyas del Valle',
        codigoPostal: '34237',
        localidad: 'Durango',
        estado: 'Durango',
        pais: 'Mexico',
        referencia: 'Casa roja',
      },
    },
    description: 'El remitente de la guia',
  })
  @ValidateNested({ message: 'El campo remitente debe ser un objeto' })
  @Type(() => ContactoDto)
  remitente: ContactoDto;
  @ApiProperty({
    example: {
      nombres: 'Maria Elena',
      apellidos: 'Rodriguez Martinez',
      telefono: '+523398765432',
      direccion: {
        calle: 'Invierno',
        numero: '112',
        asentamiento: 'Villas del Sol',
        codigoPostal: '34237',
        localidad: 'Durango',
        estado: 'Durango',
        pais: 'Mexico',
        referencia: 'Casa verde',
      },
    },
    description: 'El destinatario de la guia',
  })
  @ValidateNested({ message: 'El campo destinatario debe ser un objeto' })
  @Type(() => ContactoDto)
  destinatario: ContactoDto;
  @ApiProperty({
    example: { alto_cm: 25, ancho_cm: 30, largo_cm: 40 },
    description: 'Las dimensiones de la caja',
  })
  @ValidateNested({ message: 'El campo dimensiones debe ser un objeto' })
  @Type(() => DimensionesDto)
  dimensiones: DimensionesDto;
  @ApiProperty({
    example: 2.5,
    description: 'El peso de la caja en kilogramos',
  })
  @IsNumber({}, { message: 'El campo peso debe ser un numero' })
  @IsNotEmpty({ message: 'El campo peso es requerido' })
  @IsPositive({ message: 'El campo peso debe ser un numero positivo' })
  peso: number;
  @ApiProperty({
    example: 1500.0,
    description: 'El valor declarado de la guia en pesos mexicanos',
  })
  @IsNumber({}, { message: 'El campo valorDeclarado debe ser un numero' })
  @IsNotEmpty({ message: 'El campo valorDeclarado es requerido' })
  @IsPositive({
    message: 'El campo valorDeclarado debe ser un numero positivo',
  })
  valorDeclarado: number;
  @ApiProperty({
    enum: TipoServicio,
    description: 'Tipo de servicio: NACIONAL o INTERNACIONAL',
    example: TipoServicio.NACIONAL,
  })
  @IsEnum(TipoServicio, {
    message: 'Este campo solo puede ser "nacional" o "internacional"',
  })
  tipoServicio: TipoServicio;
}
