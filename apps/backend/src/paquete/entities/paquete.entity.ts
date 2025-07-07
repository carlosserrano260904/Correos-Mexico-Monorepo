import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('paquetes')
export class Paquete {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'En proceso',
  })
  estatus: string;

  @Column({ length: 250 })
  calle: string;

  @Column({ length: 250 })
  colonia: string;

  @Column({ length: 5 })
  cp: string;

  @Column({ type: 'varchar', nullable: true })
  indicaciones?: string;

  @Column({ length: 100 })
  numero_guia: string;

  @Column({ length: 100 })
  sku: string;

  @Column('float8')
  longitud: number;

  @Column('float8')
  latitud: number;

  @Column({ type: 'varchar', nullable: true})
  evidencia: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;
}
