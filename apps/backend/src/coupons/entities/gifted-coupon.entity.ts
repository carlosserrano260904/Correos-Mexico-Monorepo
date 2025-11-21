import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../usuarios/entities/user.entity';

@Entity('gifted_coupons')
export class GiftedCouponEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.giftedCoupons)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

}
