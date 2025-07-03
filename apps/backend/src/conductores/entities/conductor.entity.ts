import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ name: 'fecha_alta' })
  fechaAlta: Date;

  @Column({ name: 'clave_oficina' })
  claveOficina: number;

  @Column({ name: 'disponibilidad' }) // ← Nombre exacto en BD
  disponibilidad: boolean;
}