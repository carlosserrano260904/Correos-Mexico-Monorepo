// src/review/review.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';

import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

// 👇 ajusta estas rutas si tu árbol cambia (mantén coherencia: singular "review")
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Product } from '../products/entities/product.entity';

@ApiTags('reviews')
@ApiExtraModels(Review, ReviewImage, Profile, Product)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // =====================
  // POST /reviews
  // =====================
  @Post()
  @ApiBody({ type: CreateReviewDto })
  @ApiCreatedResponse({
    description: 'Reseña creada',
    schema: { $ref: getSchemaPath(Review) },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // =====================
  // POST /reviews/with-images  (multipart/form-data)
  // =====================
  @Post('with-images')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Crear reseña con imágenes',
    schema: {
      type: 'object',
      properties: {
        rating: { type: 'number', example: 5, description: '1-5' },
        comment: { type: 'string', example: 'Excelente producto.' },
        productId: { type: 'number', example: 1 },
        profileId: { type: 'number', example: 7 },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['rating', 'comment', 'productId', 'profileId'],
    },
  })
  @ApiCreatedResponse({
    description: 'Reseña creada con imágenes',
    schema: { $ref: getSchemaPath(Review) },
  })
  createWithImages(
    @Body() dto: CreateReviewDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewService.createWithImages(dto, files);
  }

  // =====================
  // POST /reviews/:id/images  (multipart/form-data)
  // =====================
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reseña' })
  @ApiBody({
    description: 'Agregar imágenes a una reseña existente',
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
      required: ['files'],
    },
  })
  @ApiOkResponse({
    description: 'Imágenes agregadas',
    schema: { type: 'array', items: { $ref: getSchemaPath(ReviewImage) } },
  })
  addImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reviewService.addImages(+id, files);
  }

  // =====================
  // GET /reviews/product/:productId
  // =====================
  @Get('product/:productId')
  @ApiParam({ name: 'productId', type: Number })
  @ApiOkResponse({
    description: 'Lista de reseñas del producto',
    schema: { type: 'array', items: { $ref: getSchemaPath(Review) } },
  })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewService.findByProduct(+productId);
  }

  // =====================
  // DELETE /reviews/:id
  // =====================
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Reseña eliminada' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }

  // =====================
  // DELETE /reviews/:reviewId/images/:imageId
  // =====================
  @Delete(':reviewId/images/:imageId')
  @ApiParam({ name: 'reviewId', type: Number, description: 'ID de la reseña' })
  @ApiParam({ name: 'imageId', type: Number, description: 'ID de la imagen' })
  @ApiOkResponse({ description: 'Imagen de reseña eliminada' })
  removeImage(
    @Param('reviewId') reviewId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.reviewService.removeImage(+reviewId, +imageId);
  }
}
