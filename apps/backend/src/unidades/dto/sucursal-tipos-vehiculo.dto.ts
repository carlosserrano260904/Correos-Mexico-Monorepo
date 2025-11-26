import { ApiProperty } from '@nestjs/swagger';

export class SucursalTipoVehiculoDto {
  @ApiProperty({ example: '00304' })
  claveOficina: string;

  @ApiProperty({ example: 'Miravalle Aguascalientes, Ags.' })
  nombreOficina: string;

  @ApiProperty({ example: 'Centro de Atencion al Publico' })
  tipo: string;

  @ApiProperty({ example: 'Aguascalientes' })
  estado?: string;

  @ApiProperty({ example: 'Miravalle' })
  colonia?: string;

  @ApiProperty({ example: 'Aguascalientes' })
  municipio?: string;

  @ApiProperty({ example: '2025-06-26T17:58:12.098Z' })
  fechaCreacion?: Date;

  @ApiProperty({
    example: ['Automóvil 400 kg', 'Camionetas de pasajeros tipo VAN'],
    type: [String],
  })
  tiposVehiculo: string[];

  @ApiProperty({
    required: false,
    example: 'Esta sucursal no tiene tipos de vehículo asignados',
  })
  mensaje?: string;
}
