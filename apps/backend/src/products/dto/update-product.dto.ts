import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
        @ApiProperty({ example: 'Television', description: 'Producto' })
        @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
        @IsString({ message: 'Nombre no valido' })
        nombre: string
        @ApiProperty({ example: 'Television con excelente calidad', description: 'Descripcion del producto' })
        @IsNotEmpty({ message: 'La descripcion del producto es obligatorio' })
        @IsString({ message: 'Descripcion no valida' })
        descripcion: string

        @IsNotEmpty({ message: 'La imagen del producto es obligatoria' })
        imagen: string

        @ApiProperty({ example: '10', description: 'La cantidad del producto en stock' })
        @IsNotEmpty({ message: 'La cantidad del producto es obligatoria' })
        @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Cantidad no valida' })
        inventario: number

        @ApiProperty({ example: '1200', description: 'Precio costo del producto' })
        @IsNotEmpty({ message: 'El precion del producto es obligatorio' })
        @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no valido' })
        precio: number

        @ApiProperty({ example: 'Blancos', description: 'El tipo de producto que es' })
        @IsNotEmpty({ message: 'La categoria del producto es necesaria' })
        @IsString({ message: 'Categoria no valida' })
        categoria: string

        @ApiProperty({ example: '#000', description: 'El color es' })
        @IsNotEmpty({ message: 'El color del producto es necesaria' })
        @IsString({ message: 'Color no valido' })
        color: string
}
