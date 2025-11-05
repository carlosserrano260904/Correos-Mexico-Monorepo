// src/products/entities/product-image.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './productVariant.entity';

@Entity('productImages')
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'variantId' })
  variantId: string;

  @ApiProperty({ example: 'https://bucket.s3.region.amazonaws.com/images/uuid.jpg' })
  @Column({ type: 'text' })
  url: string;

  // @ApiProperty({ example: 0 })
  // @Column({ type: 'int', default: 0 })
  // orden: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  @ApiProperty({ example: 12 })
  @Column()
  variants: string;

  @Column({ type: 'integer', nullable: true, name: 'sortOrder' })
  sortOrder: number;
}