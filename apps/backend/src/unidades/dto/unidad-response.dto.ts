import { ApiProperty } from '@nestjs/swagger';

export class UnidadResponseDto {
  @ApiProperty({ example: 'Camión de 10 ton' })
  tipoVehiculo: string;

  @ApiProperty({ example: 'ABC1234' })
  placas: string;

  @ApiProperty({ example: 120.5 })
  volumenCarga: number;

  @ApiProperty({ example: 3 })
  numEjes: number;

  @ApiProperty({ example: 10 })
  numLlantas: number;

  @ApiProperty({ example: '2024-01-10T08:00:00.000Z' })
  fechaAlta: Date;

  @ApiProperty({ example: 'TC-10001' })
  tarjetaCirculacion: string;

  @ApiProperty({ example: 'PEGJ800101HDFRRN01' })
  conductor: string;

  @ApiProperty({ example: '00304' })
  claveOficina: string;

  @ApiProperty({ example: 'disponible' })
  estado: string;

  @ApiProperty({ example: '00304', required: false })
  zonaAsignada?: string;
}
