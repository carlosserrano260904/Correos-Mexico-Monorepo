import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InternationalTariff } from './international-tariff.entity';
import { InternationalCountry } from './international-country.entity';


@Entity('international_zones')
export class InternationalZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // A, B o C

  @Column()
  description: string;

  @OneToMany(() => InternationalTariff, tariff => tariff.zone)
  tariffs: InternationalTariff[];

  @OneToMany(() => InternationalCountry, country => country.zone)
  countries: InternationalCountry[];
}
