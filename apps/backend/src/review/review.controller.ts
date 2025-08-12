// src/review/review.controller.ts
import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // NUEVO: crear reseña con imágenes (multipart: files[])
  @Post('with-images')
  @UseInterceptors(FilesInterceptor('files'))
  createWithImages(@Body() dto: CreateReviewDto, @UploadedFiles() files: Express.Multer.File[]) {
    return this.reviewService.createWithImages(dto, files);
  }

  // NUEVO: agregar imágenes a reseña existente
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files'))
  addImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.reviewService.addImages(+id, files);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewService.findByProduct(+productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }

  // NUEVO: eliminar imagen concreta
  @Delete(':reviewId/images/:imageId')
  removeImage(@Param('reviewId') reviewId: string, @Param('imageId') imageId: string) {
    return this.reviewService.removeImage(+reviewId, +imageId);
  }
}
