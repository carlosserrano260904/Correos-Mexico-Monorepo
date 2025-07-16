import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMisdireccioneDto {
  @IsString()
  nombre: string;

  @IsString()
  calle: string;

  @IsString()
  colonia_fraccionamiento: string;

  @IsOptional()
  @IsNumber()
  numero_interior: number | null;

  @IsOptional()
  @IsNumber()
  numero_exterior: number | null;

  @IsString()
  numero_celular: string;

  @IsString()
  codigo_postal: string;

  @IsString()
  estado: string;

  @IsString()
  municipio: string;

  @IsOptional()
  @IsString()
  mas_info: string;

  @IsNumber()
  usuarioId: number;

}
