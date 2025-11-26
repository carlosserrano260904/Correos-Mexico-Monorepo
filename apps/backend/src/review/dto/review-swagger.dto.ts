// src/reviews/dto/review-swagger.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ProfilePublicDto } from '../../profile/dto/profile-public.dto';
import { ReviewImage } from '../entities/review-image.entity';

export class ReviewSwaggerDto {
  @ApiProperty({ example: 1 }) id: number;
  @ApiProperty({ example: 5 }) rating: number;
  @ApiProperty({ example: 'Excelente producto, lo recomiendo mucho.' })
  comment: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  @ApiProperty({ example: 1 }) productId: number; // 👈 aquí Swagger verá siempre la FK
  @ApiProperty({ example: 3 }) profileId: number; // 👈 y aquí también

  @ApiProperty({ type: () => ProfilePublicDto })
  profile: ProfilePublicDto;

  @ApiProperty({ type: () => [ReviewImage] })
  images: ReviewImage[];
}
