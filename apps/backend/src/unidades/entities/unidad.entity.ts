import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('unidades')
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tipo_vehiculo' })
  tipoVehiculo: string;

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

  @Column({ name: 'curp_conductor', default: 'S/C' })
  curpConductor: string;

  @Column({ name: 'clave_oficina', type: 'int' })
  claveOficina: number;

  @Column({
    type: 'varchar',
    default: 'disponible',
    enum: ['disponible', 'no disponible']
  })
  estado: string;
}