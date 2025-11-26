import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class IniciarRutaDto {
  @ApiProperty({
    description:
      'Fecha de entrega programada para los envíos que se pondrán en ruta. Formato YYYY-MM-DD.',
    example: '2024-05-21',
  })
  @IsDateString()
  fecha_entrega_programada: Date;
}
