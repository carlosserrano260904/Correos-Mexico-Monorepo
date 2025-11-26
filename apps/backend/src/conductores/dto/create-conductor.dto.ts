import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { IsCURP } from '../decorators/is-curp.decorator';
import { IsRFC } from '../decorators/is-rfc.decorator';
import { IsLicenciaConducir } from '../decorators/is-licencia.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConductorDto {
  @ApiProperty({
    example: 'José Luis Méndez Delgado',
    description: 'Nombre completo del conductor',
  })
  @IsNotEmpty()
  @IsString()
  nombreCompleto: string;

  @ApiProperty({
    example: 'MEDJ910101HDFRRN17',
    description: 'CURP válida del conductor',
  })
  @IsNotEmpty()
  @IsString()
  @IsCURP()
  curp: string;

  @ApiProperty({
    example: 'MEDJ910101TUV',
    description: 'RFC del conductor',
  })
  @IsNotEmpty()
  @IsString()
  @IsRFC()
  rfc: string;

  @ApiProperty({
    example: 'DL753951846',
    description: 'Número de licencia de conducir',
  })
  @IsNotEmpty()
  @IsString()
  @IsLicenciaConducir()
  licencia: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la licencia está vigente',
  })
  @IsBoolean()
  licenciaVigente: boolean;

  @ApiProperty({
    example: '5557893456',
    description: 'Número de teléfono del conductor',
  })
  @IsNotEmpty()
  @IsString()
  telefono: string;

  @ApiProperty({
    example: 'jose.mendez@example.com',
    description: 'Correo electrónico del conductor',
  })
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiProperty({
    example: '00304',
    description: 'Clave unica de la oficina asignada',
  })
  @IsNotEmpty()
  @IsString()
  claveOficina: string;
}
