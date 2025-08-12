// src/reviews/entities/review.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ReviewImage } from './review-image.entity';

@Entity()
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, description: 'Puntuación del producto (1-5)' })
  @Column({ type: 'int', default: 5 })
  rating: number;

  @ApiProperty({ example: 'Excelente producto, lo recomiendo mucho.' })
  @Column({ type: 'text' })
  comment: string;

  @ApiProperty({ example: '2025-08-09T12:00:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2025-08-09T12:00:00Z' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, product => product.reviews, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  productId: number;

  @ManyToOne(() => Profile, profile => profile.reviews, { onDelete: 'CASCADE' })
  profile: Profile;

  @Column()
  profileId: number;
  @OneToMany(() => ReviewImage, (img) => img.review, { cascade: true })
  images: ReviewImage[];
}
