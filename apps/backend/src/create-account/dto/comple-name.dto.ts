import { IsNotEmpty } from "class-validator"


export class CompleteNameDto{
    @IsNotEmpty({message:'El nombre es obligatorio'})
    nombre:string
    @IsNotEmpty({message:'El apellido es obligatorio'})
    apellido:string
}