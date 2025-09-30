// src/review/dto/create-review.dto.ts
import { IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Puntuación del producto (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Excelente producto, lo recomiendo mucho.',
    description: 'Comentario de la reseña',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    example: 1,
    description: 'ID del producto al que pertenece la reseña',
  })
  @Type(() => Number)
  @IsInt()
  productId: number;

  @ApiProperty({
    example: 7,
    description: 'ID del perfil del usuario que crea la reseña',
  })
  @Type(() => Number)
  @IsInt()
  profileId: number;
}
