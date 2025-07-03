import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sucursalesdummy')
export class Sucursal {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'clave_oficina' })
  claveOficina: number;

  @Column({ name: 'nombre_oficina' })
  nombreOficina: string;

  @Column()
  tipo: string;

  @Column()
  estado: string;

  @Column()
  colonia: string;

  @Column()
  municipio: string;

  @Column({ name: 'fecha_creacion' })
  fechaCreacion: Date;
}