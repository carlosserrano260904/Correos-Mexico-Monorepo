// src/reviews/entities/review-image.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './review.entity';

@Entity('review_images')
export class ReviewImage {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../default.jpg' })
  @Column({ type: 'text' })
  url: string;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @ManyToOne(() => Review, (review) => review.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewId' })
  review: Review;

  @ApiProperty({ example: 12 })
  @Column()
  reviewId: number;
}
