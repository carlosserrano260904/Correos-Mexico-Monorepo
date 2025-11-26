import { ApiProperty } from '@nestjs/swagger';

export class ConductorResponseDto {
  @ApiProperty({ example: 'Juan Pérez García' })
  nombreCompleto: string;

  @ApiProperty({ example: 'GOMA920511HDFLRN01' })
  CURP: string;

  @ApiProperty({ example: 'GOMA920511ABC' })
  RFC: string;

  @ApiProperty({ example: '1234567890' })
  licencia: string;

  @ApiProperty({ example: '5512345678' })
  telefono: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  correo: string;

  @ApiProperty({ example: 'CUO01' })
  sucursal: string;

  @ApiProperty({
    description: 'Indica si el conductor está disponible para asignar viajes',
    example: true,
  })
  disponibilidad: boolean;

  @ApiProperty({
    description: 'Indica si la licencia del conductor está vigente',
    example: true,
  })
  licenciaVigente: boolean;
}
