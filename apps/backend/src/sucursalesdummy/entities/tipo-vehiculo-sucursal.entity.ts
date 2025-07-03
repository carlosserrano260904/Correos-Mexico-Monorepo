import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_vehiculo_sucursal')
export class TipoVehiculoSucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_vehiculo' })
  tipoVehiculo: string;

  @Column({ name: 'tipo_oficina' })
  tipoOficina: string;
}