// src/review/review.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { ReviewController } from './review.controller'; // 👈 singular
import { ReviewService } from './review.service';       // 👈 singular
import { UploadImageService } from '../upload-image/upload-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewImage])],
  controllers: [ReviewController],
  providers: [ReviewService, UploadImageService],
  exports: [ReviewService],
})
export class ReviewModule {}
