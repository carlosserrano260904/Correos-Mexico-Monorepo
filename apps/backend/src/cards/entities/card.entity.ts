import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stripeCardId: string;

  @Column()
  last4: string;

  @Column()
  brand: string;

  @ManyToOne(() => Profile, (profile) => profile.cards)
  profile: Profile;

  @Column()
  profileId: number;
}