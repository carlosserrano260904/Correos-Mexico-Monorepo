import { IsNotEmpty, IsString } from "class-validator";

/*
    ejemplo:
    {
        "numeroGuia": "1234567890",
        "idSucursal": "SUC001",
        "idRuta": "RUT001", 
        "estado": "En transito",
        "localizacion": "Centro de distribucion Ciudad de Durango"
    }
*/

export class RegistrarMovimientoDto {
    @IsString()
    numeroGuia: string

    @IsNotEmpty()
    @IsString()
    idSucursal: string;

    @IsNotEmpty()
    @IsString()
    idRuta: string;

    @IsNotEmpty()
    @IsString()
    estado: string;

    @IsNotEmpty()
    @IsString()
    localizacion: string;
}