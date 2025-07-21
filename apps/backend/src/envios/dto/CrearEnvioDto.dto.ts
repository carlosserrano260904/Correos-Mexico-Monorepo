import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { 
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
} from 'class-validator';

import { EstadoEnvio } from './estado-envio.enum';

export class CrearEnvioDto {
  @ApiProperty({ description: 'ID de la guía asociada', format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  id_guia: string;

  @ApiPropertyOptional({ description: 'ID del vehículo asignado', format: 'uuid' })
  @IsOptional()
  @IsUUID()
  id_unidad?: string;

  @ApiProperty({ enum: EstadoEnvio, description: 'Estado actual del envío' })
  @IsEnum(EstadoEnvio)
  estado_envio: EstadoEnvio;

  @ApiPropertyOptional({ description: 'Nombre de la persona que recibió el paquete' })
  @IsOptional()
  @IsString()
  nombre_receptor?: string;

  @ApiPropertyOptional({ description: 'URL o base64 de la foto como evidencia de entrega' })
  @IsOptional()
  @IsString()
  evidencia_entrega?: string;

  @ApiPropertyOptional({ description: 'Motivo del fallo en caso de entrega fallida' })
  @IsOptional()
  @IsString()
  motivo_fallo?: string;

  @ApiPropertyOptional({ description: 'Fecha efectiva de entrega', format: 'date' })
  @IsOptional()
  @IsDateString()
  fecha_entregado?: string;

  @ApiPropertyOptional({ description: 'Fecha en que se registró el fallo de entrega', format: 'date' })
  @IsOptional()
  @IsDateString()
  fecha_fallido?: string;
}
