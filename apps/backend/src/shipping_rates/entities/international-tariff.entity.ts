import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InternationalZone } from './international-zone.entity';

@Entity('international_tariffs')
export class InternationalTariff {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InternationalZone, zone => zone.tariffs)
  @JoinColumn({ name: 'zone_id' })
  zone: InternationalZone;

  @Column('decimal', { precision: 10, scale: 2 })
  max_kg: number;

  @Column('decimal', { precision: 10, scale: 2 })
  base_price: number;

  @Column('decimal', { precision: 5, scale: 2 })
  iva_percent: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  additional_per_kg: number;
}
