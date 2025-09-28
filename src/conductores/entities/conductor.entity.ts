import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Oficina } from '../../oficinas/entities/oficina.entity';

@Entity('conductores')
export class Conductor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_completo' })
  nombreCompleto: string;

  @Column({ unique: true })
  curp: string;

  @Column({ unique: true })
  rfc: string;

  @Column()
  licencia: string;

  @Column({ name: 'licencia_vigente' })
  licenciaVigente: boolean;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @Column({ name: 'fecha_alta', type: 'timestamp' })
  fechaAlta: Date;

  @Column({ name: 'clave_oficina', length: 5 })
  claveOficina: string;

  @ManyToOne(() => Oficina)
  @JoinColumn({ name: 'clave_oficina', referencedColumnName: 'clave_cuo' })
  oficina: Oficina;

  @Column({ name: 'disponibilidad' })
  disponibilidad: boolean;
}