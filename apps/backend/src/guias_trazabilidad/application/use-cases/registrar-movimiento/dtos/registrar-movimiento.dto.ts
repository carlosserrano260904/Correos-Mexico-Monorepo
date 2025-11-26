import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum EstadoMovimientoEnum {
  Creado = 'Creado',
  En_Proceso = 'En proceso',
  En_Recoleccion = 'En recoleccion',
  Recolectado = 'Recolectado',
  En_Transito = 'En transito',
  En_Aduana = 'En aduana',
  En_Entrega = 'En entrega',
  Entregado = 'Entregado',
  Reprogramado = 'Reprogramado',
  Cancelado = 'Cancelado',
  Devuelto = 'Devuelto',
  Rechazado = 'Rechazado',
  Investigacion_En_Curso = 'Investigacion en curso',
  Perdida_Confirmada = 'Perdida confirmada',
  Retrasado = 'Retrasado',
}

export class RegistrarMovimientoDto {
  @ApiProperty({
    example: '17a84017-d931-4f8a-9766-462422a78a38',
    description: 'El numero UUID de la guia generado al crearla',
  })
  @IsString({ message: 'El campo numeroGuia debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo numeroGuia es requerido' })
  numeroGuia: string;

  @ApiProperty({
    example: 'SUC002MTY',
    description:
      'El identificador de la sucursal donde se registra el movimiento',
  })
  @IsNotEmpty({ message: 'El campo idSucursal es requerido' })
  @IsString({ message: 'El campo idSucursal debe ser una cadena de texto' })
  idSucursal: string;

  @ApiProperty({
    example: 'RUT002CDMX',
    description: 'El identificador de la ruta de transporte o entrega',
  })
  @IsNotEmpty({ message: 'El campo idRuta es requerido' })
  @IsString({ message: 'El campo idRuta debe ser una cadena de texto' })
  idRuta: string;

  @ApiProperty({
    example: 'Recolectado',
    description: 'El estado actual del movimiento del paquete',
    enum: EstadoMovimientoEnum,
    enumName: 'EstadoMovimientoEnum',
  })
  @IsNotEmpty({ message: 'El campo estado es requerido' })
  @IsEnum(EstadoMovimientoEnum)
  estado: EstadoMovimientoEnum;

  @ApiProperty({
    example: 'Sucursal Monterrey Centro, Nuevo Leon, Mexico',
    description: 'La ubicacion geografica donde se registra el movimiento',
  })
  @IsNotEmpty({ message: 'El campo localizacion es requerido' })
  @IsString({ message: 'El campo localizacion debe ser una cadena de texto' })
  localizacion: string;
}
