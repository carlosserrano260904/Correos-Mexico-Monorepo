import {
    IsString,
    IsNumber,
    IsOptional,
    IsPositive,
    Min
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductVariantDto{
    @ApiPropertyOptional({example: 'Tenis Runner Pro - Rojo / Talla 9.5'})
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({example: 1349.99 })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({ example: 'SKU-RUN-RED-9.5' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiPropertyOptional({ example: 30 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    inventoryQuantity?: number;

    @ApiPropertyOptional({ example: 0.85 })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    weight?: number;
}