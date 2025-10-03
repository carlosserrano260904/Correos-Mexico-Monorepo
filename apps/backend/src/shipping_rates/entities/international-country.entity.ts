import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InternationalZone } from './international-zone.entity';

@Entity('international_countries')
export class InternationalCountry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ length: 3, nullable: true })
  iso_code?: string; // ISO 3166-1 alpha-3 (opcional)

  @ManyToOne(() => InternationalZone, zone => zone.countries)
  @JoinColumn({ name: 'zone_id' })
  zone: InternationalZone;
}
