import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum TipoIncidenciaEnum {
  Extravio = 'Extravio',
  Retraso = 'Retraso',
}

export class CrearIncidenciaDto {
  @ApiProperty({
    example: '17a84017-d931-4f8a-9766-462422a78a38',
    description: 'El numero de la guia',
  })
  @IsString({ message: 'El campo numeroRastreo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo numeroRastreo es requerido' })
  numeroRastreo: string;

  @ApiProperty({
    example: 'Extravio',
    description: 'El tipo de incidencia',
    enum: TipoIncidenciaEnum,
    enumName: 'TipoIncidenciaEnum',
  })
  @IsString({ message: 'El campo tipoIncidencia debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo tipoIncidencia es requerido' })
  @IsEnum(TipoIncidenciaEnum)
  tipoIncidencia: TipoIncidenciaEnum;

  @ApiProperty({
    example: 'El paquete se extravio en el camino',
    description: 'La descripcion de la incidencia',
  })
  @IsString({ message: 'El campo descripcion debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo descripcion es requerido' })
  descripcion: string;

  @ApiProperty({
    example: '1234567890',
    description: 'El id del responsable de la incidencia',
  })
  @IsString({ message: 'El campo idResponsable debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El campo idResponsable es requerido' })
  idResponsable: string;
}
