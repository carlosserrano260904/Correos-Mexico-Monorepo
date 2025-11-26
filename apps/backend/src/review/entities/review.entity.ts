// src/reviews/entities/review.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ReviewImage } from './review-image.entity';

@Entity('reviews')
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

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  // --- PRODUCT
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' }) // <- enlaza FK
  product: Product;

  @ApiProperty({ example: 1 })
  @Column()
  productId: number;

  // --- PROFILE
  @ApiProperty({
    type: () => Profile,
    example: { id: 7, nombre: 'Ana', apellido: 'López', imagen: 'https://...' },
  })
  @ManyToOne(() => Profile, (profile) => profile.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' }) // <- enlaza FK
  profile: Profile;

  @ApiProperty({ example: 7 })
  @Column()
  profileId: number;

  @ApiProperty({ type: () => [ReviewImage] })
  @OneToMany(() => ReviewImage, (img) => img.review, { cascade: true })
  images: ReviewImage[];
}
