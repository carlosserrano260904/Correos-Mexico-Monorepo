import { PartialType } from '@nestjs/mapped-types';
import {  IsNotEmpty, IsString, Matches } from "class-validator"
import { CreateProfileDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
        @ApiProperty({example:'Diego',description:'Nombre del usuario'})
        @IsNotEmpty({message:'El nombre del usuario es obligatorio'})
        @IsString()
        nombre:string
        @ApiProperty({example:'Trejo',description:'Apellido del usuario'})
        @IsNotEmpty({message:'El apellido del usuario es obligatorio'})
        @IsString()
        apellido:string
        @ApiProperty({example:'6182583019',description:'Numero telefonico del usuario'})
        @IsNotEmpty({message:'El numero del usuario es obligatorio'})
        @Matches(/^\d{10}$/,{message:'El numero debe de contener 10 digitos'})
        numero:string
        @ApiProperty({example:'Durango',description:'Estado de origen del usuario'})
        @IsString()
        estado:string
        @ApiProperty({example:'Durango',description:'Ciudad de origen del usuario'})
        @IsString()
        ciudad:string
        @ApiProperty({example:'Los encinos',description:'Fraccionamiento del usuario'})
        @IsString()
        fraccionamiento:string
        @ApiProperty({example:'Calle-Ejemplo',description:'Calle del usuario'})
        @IsString()
        calle:string
        @ApiProperty({example:'34227',description:'Codigo postal del usuario'})
        @Matches(/^\d{5}$/,{message:'El codigo postal debe de contener 5 digitos'})
        codigoPostal:string
}
