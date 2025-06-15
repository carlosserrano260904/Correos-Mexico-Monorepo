import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, ValidateNested } from "class-validator"

export class TransactionsContentsDto{
    
    @IsNotEmpty({message:'El ID del producto no puede ir vacio'})
    @IsInt({message:'Producto no valido'})
    productId:number
    @IsNotEmpty({message:'La cantidad no puede ir vacia'})
    cantidad:number
    @IsNotEmpty({message:'El precio no puede ir vacio'})
    @IsNumber({},{message:'Precio no valido'})
    precio:number
}

export class CreateTransactionDto {
    profileId: number;  
    @IsNotEmpty({message:'El total no puede ir vacio'})
    @IsNumber({},{message:'Cantidad no valida'})
    total:number
    @IsArray()
    @ArrayNotEmpty({message:'Los contenidos no pueden ir vacios'})
    @ValidateNested()
    @Type(()=>TransactionsContentsDto)
    contenidos:TransactionsContentsDto[]
}
