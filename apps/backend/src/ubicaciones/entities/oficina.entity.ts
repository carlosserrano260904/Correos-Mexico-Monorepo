import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oficinas')
export class Oficina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  horario: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitud: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitud: number;
}
