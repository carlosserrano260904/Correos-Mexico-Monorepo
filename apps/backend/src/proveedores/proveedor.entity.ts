import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  proveedor: string;

  @Column()
  sub: string;

  @Column()
  id_usuario: number;

  @Column({ nullable: true })
  correo_asociado: string;
}
