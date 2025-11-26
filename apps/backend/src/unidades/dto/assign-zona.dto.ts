import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignZonaDto {
  @ApiProperty({
    example: '00305',
    description: 'Clave CUO de la oficina destino',
  })
  @IsString()
  @IsNotEmpty()
  claveCuoDestino: string;
}
