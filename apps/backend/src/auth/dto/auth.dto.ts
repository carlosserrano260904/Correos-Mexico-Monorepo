import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  contrasena: string;
}
