import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oficinas_mapa')
export class Oficina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Sin nombre' })
  nombre: string;


  @Column({ nullable: true })
  direccion: string;


  @Column({ default: 'Sin telefono' })
  telefono: string;

  @Column({ default: 'Sin horario' })
  horario: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitud: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitud: number;
}
