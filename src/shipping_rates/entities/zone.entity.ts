import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShippingRate } from './shipping_rate.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'zone_name', type: 'varchar', length: 50 })
  zoneName: string;

  @Column({ name: 'min_distance', type: 'int' })
  minDistance: number;

  @Column({ name: 'max_distance', type: 'int', nullable: true })
  maxDistance: number | null;


  @OneToMany(() => ShippingRate, (rate) => rate.zone)
  shippingRates: ShippingRate[];

  
}
