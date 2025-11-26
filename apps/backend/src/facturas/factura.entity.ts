import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('facturas')
export class Factura {
  @ApiProperty({ example: 1, description: 'ID único de la factura' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: () => Profile,
    description: 'Perfil al que pertenece la factura',
  })
  @ManyToOne(() => Profile, (profile) => profile.facturas, { eager: true })
  @JoinColumn({ name: 'profileId' }) // ⬅️ Esto crea la columna "profileId"
  profile: Profile;

  @ApiProperty({
    example: 'F-2025-001',
    description: 'Número único de la factura',
  })
  @Column({ unique: true, comment: 'Número de factura, ej: F-2024-021' })
  numero_factura: string;

  @ApiProperty({
    example: 500.75,
    description: 'Monto total de la factura en MXN',
  })
  @Column({
    name: 'precio',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  precio: number;

  @ApiProperty({
    example: 'Sucursal Centro',
    description: 'Nombre del cliente o sucursal',
  })
  @Column({ comment: 'Nombre del cliente o sucursal' })
  sucursal: string;

  @ApiProperty({
    example: 'paid',
    description: "Estado de la factura: 'paid', 'pending', 'overdue'",
  })
  @Column({ comment: "Estado de la factura: 'paid', 'pending', 'overdue'" })
  status: string;

  @ApiProperty({
    example: ['Producto A', 'Producto B'],
    description: 'Lista de productos incluidos',
  })
  @Column('simple-array', {
    comment: 'Lista de servicios o productos incluidos',
  })
  productos: string[];

  @ApiProperty({
    example: '2025-08-06',
    description: 'Fecha de creación de la factura',
  })
  @Column({
    name: 'fecha_creacion',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  fecha_creacion: Date;

  @ApiProperty({
    example: '2025-09-06',
    description: 'Fecha de vencimiento de la factura',
  })
  @Column({ name: 'fecha_vencimiento', type: 'date' })
  fecha_vencimiento: Date;
}
