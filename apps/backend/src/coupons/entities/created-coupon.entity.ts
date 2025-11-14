import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('created_coupons')
export class CreatedCouponEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Product, (product) => product.createdCoupons)
  @JoinColumn({ name: 'product_id' })
  product: Product;
  @Column()
  product_id: number;
}
