import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { InternationalZone } from './international-zone.entity';

@Entity('international_tariffs')
export class InternationalTariff {
@PrimaryGeneratedColumn()
id: number;

@ManyToOne(() => InternationalZone, zone => zone.tariffs)
@JoinColumn({ name: 'zone_id' })
zone: InternationalZone;

@Column({ type: 'float', nullable: true })
max_kg: number;

@Column({ type: 'float', nullable: false })
base_price: number;

@Column({ type: 'float', nullable: true })
iva_percent: number;

@Column({ type: 'float', nullable: true })
additional_per_kg:number;
}