import { IsBoolean } from 'class-validator';

export class UpdateDisponibilidadDto {
  @IsBoolean()
  disponibilidad: boolean;
}
