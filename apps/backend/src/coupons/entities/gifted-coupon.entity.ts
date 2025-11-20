import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../usuarios/entities/user.entity';
import { CreatedCoupon } from './created-coupon.entity';

@Entity('gifted_coupons')
export class GiftedCoupon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  /** 1) Primero definimos la columna */
  @Column({ type: 'int' })
  coupon_id: number;

  /** 2) Luego la relación usando la columna anterior */
  @ManyToOne(() => CreatedCoupon, (coupon) => coupon.giftedCoupons, {
    eager: true, // RECOMENDADO por tu servicio
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon: CreatedCoupon;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => User, (user) => (user as any).giftedCoupons, {
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'varchar', nullable: true })
  product_id?: string;

  @CreateDateColumn({ type: 'timestamp' })
  used_at: Date;
}
