import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"

/*
    ejemplo:
    {
    "remitente": {
        "nombres": "Kitaro Jemmen",
        "apellidos": "Cortes Herrera",
        "telefono": "1234567890",
        "direccion": {
            "calle": "Calle 123",
            "numero": "123",
            "ciudad": "Durango",
            "pais": "Mexico",
            "codigoPostal": "12345",
            "estado": "Durango",
            "municipio": "Victoria de Durango",
            "colonia": "Joyas del Valle"
        }
    },
    "destinatario": {
        "nombres": "Francisco Alejandro",
        "apellidos": "Rivera Saucedo",
        "telefono": "1234567890",
        "direccion": {
            "calle": "Calle 123",
            "numero": "123",
            "ciudad": "Monterrey",
            "pais": "Mexico",
            "codigoPostal": "12345",
            "estado": "Nuevo Leon",
            "municipio": "San Nicolas de los Garza",
            "fraccionamiento": "Fraccionamiento los Alpes"
        }
    },
    "dimensiones": {
        "alto_cm": 10,
        "ancho_cm": 10,
        "largo_cm": 10
    },
  "peso": 10,
  "valorDeclarado": 100
}
*/
class DireccionDto {
    @IsString()
    @IsNotEmpty()
    calle: string;
    @IsString()
    @IsNotEmpty()
    numero: string;
    @IsString()
    @IsNotEmpty()
    ciudad: string;
    @IsString()
    @IsNotEmpty()
    pais: string;
    @IsString()
    @IsNotEmpty()
    codigoPostal: string;
    @IsString()
    @IsNotEmpty()
    estado: string;
    @IsString()
    @IsOptional()
    municipio?: string;
    @IsString()
    @IsOptional()
    delegacion?: string;
    @IsString()
    @IsOptional()
    colonia?: string;
    @IsString()
    @IsOptional()
    fraccionamiento?: string;
}

class DimensionesDto {
    @IsNumber()
    @IsNotEmpty()
    alto_cm: number;
    @IsNumber()
    @IsNotEmpty()
    ancho_cm: number;
    @IsNumber()
    @IsNotEmpty()
    largo_cm: number;
}

class ContactoDto {
    @IsString()
    @IsNotEmpty()
    nombres: string;
    @IsString()
    @IsNotEmpty()
    apellidos: string;
    @IsString()
    @IsNotEmpty()
    telefono: string;
    @ValidateNested()
    @Type(() => DireccionDto)
    direccion: DireccionDto;
}

export class CrearGuiaDto {
    @ValidateNested()
    @Type(() => ContactoDto)
    remitente: ContactoDto;
    @ValidateNested()
    @Type(() => ContactoDto)
    destinatario: ContactoDto;
    @ValidateNested()
    @Type(() => DimensionesDto)
    dimensiones: DimensionesDto;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    peso: number;
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    valorDeclarado: number;
}