import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ruta')
export class Ruta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre_ruta: string;
}
