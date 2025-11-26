import { IsString, IsEmail } from 'class-validator';

export class OAuthDto {
  @IsString()
  proveedor: string;

  @IsString()
  sub: string;

  @IsEmail()
  correo: string;

  @IsString()
  nombre: string;
}
