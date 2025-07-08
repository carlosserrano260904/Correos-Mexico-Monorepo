import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Unidad } from '../../unidades/entities/unidad.entity';
import { Oficina } from '../../oficinas/entities/oficina.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';

@Entity('unidad_sucursal')
export class UnidadSucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_unidad', type: 'int' })
  idUnidad: number;

  @ManyToOne(() => Unidad)
  @JoinColumn({ name: 'id_unidad', referencedColumnName: 'id' })
  unidad: Unidad;

  @Column({ name: 'clave_sucursal', length: 5 })
  claveSucursal: string;

  @ManyToOne(() => Oficina)
  @JoinColumn({ name: 'clave_sucursal', referencedColumnName: 'clave_cuo' })
  sucursal: Oficina;

  @Column({ name: 'estado_unidad' })
  estadoUnidad: 'transito' | 'disponible' | 'mantenimiento' | 'no disponible';

  @Column({ name: 'conductor_unidad' })
  conductorUnidad: string;
}