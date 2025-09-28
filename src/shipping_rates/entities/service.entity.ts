import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ShippingRate } from './shipping_rate.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'service_name', type: 'varchar', length: 100 })
  serviceName: string;

  @OneToMany(() => ShippingRate, (rate) => rate.service)
  shippingRates: ShippingRate[];
  
}
