// add-images.dto.ts
import{
  IsArray,
  IsUrl,
  IsNumber,
  IsOptional,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VariantImagesDto {
  @ApiPropertyOptional({example: ''})
  @IsUrl()
  url: string;

  @ApiPropertyOptional({example: 3})
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class AddImageToVariantDto {
  @ApiPropertyOptional({type: [VariantImagesDto]})
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => VariantImagesDto)
  images: VariantImagesDto[];
}
