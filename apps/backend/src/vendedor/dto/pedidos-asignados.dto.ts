import { ApiProperty } from '@nestjs/swagger';

export class ProductoPedidoDto {
  @ApiProperty({ example: 'SKU-ABC-001' })
  sku: string;

  @ApiProperty({ example: 'Tenis Runner Negro' })
  nombre: string;

  @ApiProperty({ example: 2 })
  cantidad: number;

  @ApiProperty({ example: 'En tránsito' })
  estado: string;
}

export class ClienteInfoDto {
  @ApiProperty({ example: 'Juan Carlos Pérez López' })
  nombre: string;

  @ApiProperty({
    example:
      'Calle Reforma 123, Depto 4B, Col. Centro, 06000, Ciudad de México, CDMX, México',
  })
  direccion: string;
}

export class PedidoAsignadoDto {
  @ApiProperty({ example: 123 })
  id: number;

  @ApiProperty({ example: '2025-01-15' })
  fecha: string;

  @ApiProperty({ type: ClienteInfoDto })
  cliente: ClienteInfoDto;

  @ApiProperty({ type: [ProductoPedidoDto] })
  productos: ProductoPedidoDto[];
}

export class PedidosAsignadosResponseDto {
  @ApiProperty({ type: [PedidoAsignadoDto] })
  data: PedidoAsignadoDto[];

  @ApiProperty({ example: 5 })
  total: number;

  @ApiProperty({ example: 'ok' })
  status: string;
}
