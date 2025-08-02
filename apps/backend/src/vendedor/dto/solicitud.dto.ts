import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SolicitudDto {
    @IsString()
    @IsNotEmpty()
    nombre_tienda: string;

    @IsString()
    @IsNotEmpty()
    categoria_tienda: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsNotEmpty()
    direccion_fiscal: string;

    @IsString()
    @IsNotEmpty()
    rfc: string;

    @IsString()
    @IsNotEmpty()
    curp: string;

    @IsString()
    @IsOptional()
    img_uri: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}