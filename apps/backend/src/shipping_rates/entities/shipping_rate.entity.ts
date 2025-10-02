import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Zone } from '../entities/zone.entity';
import { Service } from '../entities/service.entity';

@Entity('shipping_rates')
export class ShippingRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'kg_min', type: 'decimal', precision: 5, scale: 2 })
  kgMin: number;

  @Column({ name: 'kg_max', type: 'decimal', precision: 5, scale: 2 })
  kgMax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Zone, (zone) => zone.shippingRates, { eager: true })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @ManyToOne(() => Service, (service) => service.shippingRates, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
