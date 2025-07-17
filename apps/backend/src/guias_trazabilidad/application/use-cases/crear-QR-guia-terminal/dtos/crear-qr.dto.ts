import { IsString } from "class-validator"

export class CrearQRDto {
    @IsString()
    numeroDeRastreo: string
}