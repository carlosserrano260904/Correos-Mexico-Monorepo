import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LlegadaDestinoDto {
  @ApiProperty({ example: 'MEDJ970101HDFRRN17' })
  @IsString()
  @IsNotEmpty()
  curp: string;

  @ApiProperty({ example: 'ABC5554' })
  @IsString()
  @IsNotEmpty()
  placas: string;

  @ApiProperty({ example: '02888' })
  @IsString()
  @IsNotEmpty()
  oficinaActual: string;
}
