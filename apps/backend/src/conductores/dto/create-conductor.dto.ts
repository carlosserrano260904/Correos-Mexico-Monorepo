import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConductorDto {
  @IsNotEmpty()
  @IsString()
  nombreCompleto: string;

  @IsNotEmpty()
  @IsString()
  curp: string;

  @IsNotEmpty()
  @IsString()
  rfc: string;

  @IsNotEmpty()
  @IsString()
  licencia: string;

  @IsBoolean()
  licenciaVigente: boolean;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsNumber()
  claveOficina: number;
}