import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RetornoOrigenDto {
  @ApiProperty({ example: 'MEDJ970101HDFRRN17' })
  @IsString()
  @IsNotEmpty()
  curp: string;

  @ApiProperty({ example: 'ABC5554' })
  @IsString()
  @IsNotEmpty()
  placas: string;
}
