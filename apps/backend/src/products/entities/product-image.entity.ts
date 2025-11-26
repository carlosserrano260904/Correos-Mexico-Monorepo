// src/products/entities/product-image.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'https://bucket.s3.region.amazonaws.com/images/uuid.jpg',
  })
  @Column({ type: 'text' })
  url: string;

  @ApiProperty({ example: 0 })
  @Column({ type: 'int', default: 0 })
  orden: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ApiProperty({ example: 12 })
  @Column()
  productId: number;
}
