// src/review/review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UploadImageService } from '../upload-image/upload-image.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(ReviewImage)
    private readonly reviewImageRepo: Repository<ReviewImage>,
    private readonly uploadImageService: UploadImageService,
  ) {}

  async create(dto: CreateReviewDto) {
    return this.reviewRepo.save(this.reviewRepo.create(dto));
  }

  // NUEVO: crear con imágenes (multipart)
  async createWithImages(dto: CreateReviewDto, files?: Express.Multer.File[]) {
    const review = await this.create(dto);
    if (files?.length) {
      const imgs = await Promise.all(
        files.map(async (file, idx) => {
          const url = await this.uploadImageService.uploadFileImage(file);
          return this.reviewImageRepo.save(
            this.reviewImageRepo.create({
              url,
              orden: idx,
              reviewId: review.id,
            }),
          );
        }),
      );
      (review as any).images = imgs;
    }
    return review;
  }

  // NUEVO: agregar imágenes a una reseña existente
  async addImages(reviewId: number, files: Express.Multer.File[]) {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Reseña no encontrada');

    const imgs = await Promise.all(
      files.map(async (file, idx) => {
        const url = await this.uploadImageService.uploadFileImage(file);
        return this.reviewImageRepo.save(
          this.reviewImageRepo.create({ url, orden: idx, reviewId }),
        );
      }),
    );
    return imgs;
  }

  async findByProduct(productId: number) {
    return this.reviewRepo.find({
      where: { productId },
      relations: { profile: true, images: true }, // 👈 incluye imágenes
      order: { createdAt: 'DESC' as any },
    });
  }

  async remove(id: number) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Reseña no encontrada');
    return this.reviewRepo.remove(review);
  }

  // NUEVO: borrar una imagen específica
  async removeImage(reviewId: number, imageId: number) {
    const img = await this.reviewImageRepo.findOne({
      where: { id: imageId, reviewId },
    });
    if (!img) throw new NotFoundException('Imagen de reseña no encontrada');
    await this.reviewImageRepo.remove(img);
    return 'Imagen eliminada';
  }
}
