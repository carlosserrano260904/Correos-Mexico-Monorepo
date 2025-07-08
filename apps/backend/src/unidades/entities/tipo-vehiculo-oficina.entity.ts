import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { Oficina } from './../../oficinas/entities/oficina.entity';

@Entity('tipo_vehiculo_sucursal')
export class TipoVehiculoOficina {
  @PrimaryGeneratedColumn()
  id: number;

  // FK a tipos_vehiculos.id
  @Column({ name: 'tipo_vehiculo', type: 'int' })
  tipoVehiculoId: number;

  @ManyToOne(() => TipoVehiculo)
  @JoinColumn({ name: 'tipo_vehiculo', referencedColumnName: 'id' })
  tipoVehiculo: TipoVehiculo;

  // FK a oficinas.tipo_cuo (enum)
  @Column({ name: 'tipo_oficina' })
  tipoOficina: string;

}