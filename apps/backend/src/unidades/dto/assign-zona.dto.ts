import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignZonaDto {
  @ApiProperty({ example: '20000' })
  @IsString()
  @IsNotEmpty()
  codigoPostal: string;
}