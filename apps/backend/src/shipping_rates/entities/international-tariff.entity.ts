import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InternationalZone } from './international-zone.entity';

@Entity('international_tariffs')
export class InternationalTariff {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InternationalZone, zone => zone.tariffs)
  @JoinColumn({ name: 'zone_id' })
  zone: InternationalZone;

  @Column({ name: 'max_kg', type: 'int', nullable: false, default: 0 })
  maxKg: number;



  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  base_price: number | null;


  @Column('decimal', { precision: 5, scale: 2, default: 4.00 })
  iva_percent: number;


  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  additional_per_kg: number;
}
