import { IsNotEmpty } from "class-validator"

export class LoginDto {
     @IsNotEmpty({message:'El correo es obligatorio'})
        correo:string
        @IsNotEmpty({message:'El pasword es obligatorio'})
        password:string
}
