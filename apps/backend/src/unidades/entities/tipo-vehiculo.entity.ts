import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipos_vehiculos')
export class TipoVehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_vehiculo', unique: true })
  tipoVehiculo: string;

  @Column({ name: 'capacidad_kg', type: 'decimal', precision: 10, scale: 2 })
  capacidadKg: number;
}
