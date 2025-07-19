import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignZonaDto {
  @ApiProperty({ example: '00304' })
  @IsString()
  @IsNotEmpty()
    claveCuoDestino: string;
}