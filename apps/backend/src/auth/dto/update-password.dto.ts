import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    contrasena: string;
}