import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TipoVehiculo } from '../entities/tipo-vehiculo.entity';
import { Conductor } from '../../conductores/entities/conductor.entity';
import { Oficina } from '../../oficinas/entities/oficina.entity';
import { Envio } from '../../envios/entities/envios.entity';

@Entity('unidades')
export class Unidad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tipo_vehiculo', type: 'int' })
  tipoVehiculoId: number;

  @ManyToOne(() => TipoVehiculo)
  @JoinColumn({ name: 'tipo_vehiculo', referencedColumnName: 'id' })
  tipoVehiculo: TipoVehiculo;

  @Column({ unique: true })
  placas: string;

  @Column({ name: 'volumen_carga', type: 'decimal', precision: 10, scale: 2 })
  volumenCarga: number;

  @Column({ name: 'num_ejes' })
  numEjes: number;

  @Column({ name: 'num_llantas' })
  numLlantas: number;

  @Column({ name: 'fecha_alta', type: 'timestamp' })
  fechaAlta: Date;

  @Column({ name: 'tarjeta_circulacion', unique: true })
  tarjetaCirculacion: string;

  @Column({ name: 'curp_conductor', nullable: true })
  curpConductor: string | null;

  @ManyToOne(() => Conductor, { nullable: true })
  @JoinColumn({ name: 'curp_conductor', referencedColumnName: 'curp' })
  conductor: Conductor | null;

  @Column({ name: 'clave_oficina', length: 5 })
  claveOficina: string;

  @ManyToOne(() => Oficina)
  @JoinColumn({ name: 'clave_oficina', referencedColumnName: 'clave_cuo' })
  oficina: Oficina;

  @Column({ name: 'zona_asignada', length: 5, nullable: true })
  zonaAsignada: string;

  @ManyToOne(() => Oficina)
  @JoinColumn({ name: 'zona_asignada', referencedColumnName: 'clave_cuo' })
  asignada: Oficina;

  @Column({
    type: 'enum',
    enum: ['disponible', 'no disponible'],
    default: 'disponible',
  })
  estado: 'disponible' | 'no disponible';

  @OneToMany(() => Envio, envio => envio.unidad)
  envios: Envio[];
}