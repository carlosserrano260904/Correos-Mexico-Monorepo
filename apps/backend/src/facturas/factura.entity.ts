import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.facturas, { eager: true })
  @JoinColumn({ name: 'profileId' }) // ⬅️ Esto crea la columna "profileId"
  profile: Profile;

  @Column({ unique: true, comment: 'Número de factura, ej: F-2024-021' })
  numero_factura: string;

  @Column({ name: 'precio', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  precio: number;

  @Column({ comment: 'Nombre del cliente o sucursal' })
  sucursal: string;

  @Column({ comment: "Estado de la factura: 'paid', 'pending', 'overdue'" })
  status: string;

  @Column('simple-array', { comment: 'Lista de servicios o productos incluidos' })
  productos: string[];

  @Column({ name: 'fecha_creacion', type: 'date', default: () => 'CURRENT_DATE' })
  fecha_creacion: Date;

  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fecha_vencimiento: Date;
}
