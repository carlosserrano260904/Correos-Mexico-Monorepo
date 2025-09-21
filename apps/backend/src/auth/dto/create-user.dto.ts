import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    contrasena: string;

    @IsOptional()
    @IsNotEmpty()
    nombre?: string;

    @IsOptional()
    apellido?: string;

}