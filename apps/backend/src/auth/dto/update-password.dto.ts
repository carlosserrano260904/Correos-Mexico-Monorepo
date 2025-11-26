import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsNotEmpty()
  contrasena: string;
}

export class EmailOtpDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsNotEmpty()
  token: string;
}
