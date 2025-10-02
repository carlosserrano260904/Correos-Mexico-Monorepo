import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EliminarClaveZonaDto {
  @ApiProperty({
    example: '00304',
    description: 'Clave de la zona a eliminar de la oficina',
  })
  @IsString()
  @IsNotEmpty()
  claveZona: string;
}
