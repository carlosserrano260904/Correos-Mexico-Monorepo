import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCreateAccountDto {
    @IsNotEmpty({message:'El correo electronico es obligatorio'})
    @IsEmail()
    correo:string
}
