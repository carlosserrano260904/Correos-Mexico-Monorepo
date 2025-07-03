import { ApiProperty } from '@nestjs/swagger';

export class SucursalTiposVehiculoDto {
  @ApiProperty({ example: '20041' })
  sucursal: number;

  @ApiProperty({ example: 'Miravalle Aguascalientes, Ags.' })
  nombreOficina: string;

  @ApiProperty({ example: 'Centro de Atencion al Publico' })
  tipoSucursal: string;

  @ApiProperty({ 
    example: ['Automóvil 400 kg', 'Camionetas de pasajeros tipo VAN'],
    type: [String] 
  })
  tiposVehiculo: string[];
}