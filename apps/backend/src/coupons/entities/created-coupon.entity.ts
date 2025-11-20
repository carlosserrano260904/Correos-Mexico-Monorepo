import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../usuarios/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { GiftedCoupon } from './gifted-coupon.entity';

export enum CouponDiscountType {
  AMOUNT = 'AMOUNT',
  PERCENT = 'PERCENT',
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
}

@Entity('created_coupons')
export class CreatedCoupon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, unique: true })
  code: string;

  @Column({ type: 'enum', enum: CouponDiscountType })
  type_discount: CouponDiscountType;

  // If PERCENT -> store e.g., 10 for 10%
  // If AMOUNT -> store currency amount
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  start_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at?: Date;

  @Column({ type: 'varchar', length: 32, nullable: true })
  color?: string;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relations

  // Producto al que aplica (assumes Product entity uses UUID id)
  @ManyToOne(() => Product, (product) => (product as any).createdCoupons, { eager: false })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @Column({ type: 'varchar', nullable: true })
  product_id?: string;

  // Vendedor que creó el cupón
  @ManyToOne(() => User, (user) => (user as any).createdCoupons, { eager: false })
  @JoinColumn({ name: 'seller_id' })
  seller?: User;

  @Column({ type: 'int', nullable: true })
  seller_id?: number;

  @OneToMany(() => GiftedCoupon, (gift) => gift.coupon, { cascade: false })
  giftedCoupons?: GiftedCoupon[];
}
