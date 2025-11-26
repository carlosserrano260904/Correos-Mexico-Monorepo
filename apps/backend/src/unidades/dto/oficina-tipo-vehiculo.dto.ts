// src/unidades/dto/oficina-tipo-vehiculo.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class OficinaTipoVehiculoDto {
  @ApiProperty({ example: '00304' })
  claveOficina: string;

  @ApiProperty({ example: 'Centro de Atención Postal Aguascalientes' })
  nombreOficina: string;

  @ApiProperty({ example: 'CP' })
  tipo: string;

  @ApiProperty({
    example: ['Automóvil 400 kg', 'Camionetas de pasajeros tipo VAN'],
    type: [String],
  })
  tiposVehiculo: string[];

  @ApiProperty({
    required: false,
    example: 'Esta oficina no tiene tipos de vehículo asignados',
  })
  mensaje?: string;
}
