import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transportes')
export class Transporte {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;
}
