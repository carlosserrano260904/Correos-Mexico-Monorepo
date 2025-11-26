import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadDto {
  @ApiProperty({ example: 'Camión de 10 ton' })
  @IsString()
  @IsNotEmpty()
  tipoVehiculo: string;

  @ApiProperty({ example: 'ABC1234' })
  @IsString()
  @IsNotEmpty()
  placas: string;

  @ApiProperty({ example: 120.5 })
  @IsNumber()
  @IsPositive()
  volumenCarga: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsPositive()
  numEjes: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  numLlantas: number;

  @ApiProperty({ example: '00304' })
  @IsString()
  @IsNotEmpty()
  claveOficina: string;

  @ApiProperty({ example: 'TC-10001' })
  @IsString()
  @IsNotEmpty()
  tarjetaCirculacion: string;
}
