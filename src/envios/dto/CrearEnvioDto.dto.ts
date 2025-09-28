import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnvioDto {
  @ApiProperty({ description: 'ID de la guía' })
  @IsUUID()
  guiaId: string;

  @ApiProperty({ description: 'ID de la unidad' })
  @IsUUID()
  unidadId: string;
}
