import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator"
class DireccionDto {
    @ApiProperty({ example: 'Av. Reforma', description: 'El nombre de la calle' })
    @IsString({ message: 'El campo calle debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo calle es requerido' })
    calle: string;
    @ApiProperty({ example: '456', description: 'El numero de la vivienda' })
    @IsString({ message: 'El campo numero debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo numero es requerido' })
    numero: string;
    @ApiProperty({ example: 'Ciudad de Mexico', description: 'La ciudad de la direccion' })
    @IsString({ message: 'El campo ciudad debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo ciudad es requerido' })
    ciudad: string;
    @ApiProperty({ example: 'Mexico', description: 'El pais de la direccion' })
    @IsString({ message: 'El campo pais debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo pais es requerido' })
    pais: string;
    @ApiProperty({ example: '06600', description: 'El codigo postal de la direccion' })
    @IsString({ message: 'El campo codigoPostal debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo codigoPostal es requerido' })
    codigoPostal: string;
    @ApiProperty({ example: 'CDMX', description: 'El estado de la direccion' })
    @IsString({ message: 'El campo estado debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo estado es requerido' })
    estado: string;
    @ApiProperty({ example: 'Cuauhtemoc', description: 'La delegacion de la direccion' })
    @IsString({ message: 'El campo municipio o delegacion debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo municipio o delegacion es requerido' })
    municipioDelegacion: string;
    @ApiProperty({ example: 'Juarez', required: false, nullable: true, description: 'El fraccionamiento, colonia, barrio, etc, de la direccion' })
    @IsString({ message: 'El campo asentamiento (fraccionamiento, colonia, barrio, etc) debe ser una cadena de texto' })
    @IsOptional()
    asentamiento?: string;
    @ApiProperty({ example: 'Entre Niza y Florencia, edificio azul', required: false, nullable: true, description: 'La referencia de la direccion' })
    @IsString({ message: 'El campo referencia debe ser una cadena de texto' })
    @IsOptional()
    referencia?: string;
    @ApiProperty({ example: 'Depto 3B', required: false, nullable: true, description: 'El numero interior de la direccion' })
    @IsString({ message: 'El campo numeroInterior debe ser una cadena de texto' })
    @IsOptional()
    numeroInterior?: string;
}

class DimensionesDto {
    @ApiProperty({ example: 25, description: 'El alto de la caja en centimetros' })
    @IsNumber({}, { message: 'El campo alto debe ser un numero' })
    @IsPositive({ message: 'El campo alto debe ser un numero positivo' })
    @IsNotEmpty({ message: 'El campo alto es requerido' })
    alto_cm: number;
    @ApiProperty({ example: 30, description: 'El ancho de la caja en centimetros' })
    @IsNumber({}, { message: 'El campo ancho debe ser un numero' })
    @IsPositive({ message: 'El campo ancho debe ser un numero positivo' })
    @IsNotEmpty({ message: 'El campo ancho es requerido' })
    ancho_cm: number;
    @ApiProperty({ example: 40, description: 'El largo de la caja en centimetros' })
    @IsNumber({}, { message: 'El campo largo debe ser un numero' })
    @IsPositive({ message: 'El campo largo debe ser un numero positivo' })
    @IsNotEmpty({ message: 'El campo largo es requerido' })
    largo_cm: number;
}

class ContactoDto {
    @ApiProperty({ example: 'Juan Carlos', description: 'Los nombres del contacto' })
    @IsString({ message: 'El campo nombres debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo nombres es requerido' })
    nombres: string;
    @ApiProperty({ example: 'Garcia Lopez', description: 'Los apellidos del contacto' })
    @IsString({ message: 'El campo apellidos debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo apellidos es requerido' })
    apellidos: string;
    @ApiProperty({ example: '+525512345678', description: 'El telefono del contacto (sin espacios)' })
    @IsString({ message: 'El campo telefono debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo telefono es requerido' })
    telefono: string;
    @ApiProperty({ example: { calle: 'Av. Reforma', numero: '456', numeroInterior: 'Depto 3B', ciudad: 'Ciudad de Mexico', pais: 'Mexico', codigoPostal: '06600', estado: 'CDMX', municipioDelegacion: 'Cuauhtemoc', asentamiento: 'Juarez', referencia: 'Entre Niza y Florencia, edificio azul' }, description: 'La direccion del contacto' })
    @ValidateNested({ message: 'El campo direccion debe ser un objeto' })
    @Type(() => DireccionDto)
    direccion: DireccionDto;
}

export class CrearGuiaDto {
    @ApiProperty({
        example: {
            nombres: 'Juan Carlos',
            apellidos: 'Garcia Lopez',
            telefono: '+525512345678',
            direccion: {
                calle: 'Av. Reforma',
                numero: '456',
                numeroInterior: 'Depto 3B',
                ciudad: 'Ciudad de Mexico',
                pais: 'Mexico',
                codigoPostal: '06600',
                estado: 'CDMX',
                municipioDelegacion: 'Cuauhtemoc',
                asentamiento: 'Juarez',
                referencia: 'Entre Niza y Florencia, edificio azul'
            }
        },
        description: 'El remitente de la guia'
    })
    @ValidateNested({ message: 'El campo remitente debe ser un objeto' })
    @Type(() => ContactoDto)
    remitente: ContactoDto;
    @ApiProperty({
        example: {
            nombres: 'Maria Elena',
            apellidos: 'Rodriguez Martinez',
            telefono: '+523398765432',
            direccion: {
                calle: 'Calle Independencia',
                numero: '789',
                ciudad: 'Guadalajara',
                pais: 'Mexico',
                codigoPostal: '44100',
                estado: 'Jalisco',
                municipioDelegacion: 'Guadalajara',
                asentamiento: 'Centro Historico',
                referencia: 'Frente a la Catedral'
            }
        },
        description: 'El destinatario de la guia'
    })
    @ValidateNested({ message: 'El campo destinatario debe ser un objeto' })
    @Type(() => ContactoDto)
    destinatario: ContactoDto;
    @ApiProperty({ example: { alto_cm: 25, ancho_cm: 30, largo_cm: 40 }, description: 'Las dimensiones de la caja' })
    @ValidateNested({ message: 'El campo dimensiones debe ser un objeto' })
    @Type(() => DimensionesDto)
    dimensiones: DimensionesDto;
    @ApiProperty({ example: 2.5, description: 'El peso de la caja en kilogramos' })
    @IsNumber({}, { message: 'El campo peso debe ser un numero' })
    @IsNotEmpty({ message: 'El campo peso es requerido' })
    @IsPositive({ message: 'El campo peso debe ser un numero positivo' })
    peso: number;
    @ApiProperty({ example: 1500.00, description: 'El valor declarado de la guia en pesos mexicanos' })
    @IsNumber({}, { message: 'El campo valorDeclarado debe ser un numero' })
    @IsNotEmpty({ message: 'El campo valorDeclarado es requerido' })
    @IsPositive({ message: 'El campo valorDeclarado debe ser un numero positivo' })
    valorDeclarado: number;
}