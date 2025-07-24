import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'contactos' })
export class Contacto {
  @PrimaryColumn({ name: 'id_contacto', type: 'uuid' })
  id: string;

  @Column({ name: 'id_usuario', type: 'varchar', nullable: true })
  id_usuario: string;

  @Column({ type: 'varchar' })
  nombres: string;

  @Column({ type: 'varchar' })
  apellidos: string;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar' })
  calle: string;

  @Column({ type: 'varchar' })
  numero: string;

  @Column({ name: 'numero_interior', type: 'varchar', nullable: true })
  numero_interior: string;

  @Column({ type: 'varchar' })
  ciudad: string;

  @Column({ type: 'varchar' })
  pais: string;

  @Column({ name: 'codigo_postal', type: 'varchar' })
  codigo_postal: string;

  @Column({ type: 'varchar' })
  estado: string;

  @Column({ name: 'municipio_delegacion', type: 'varchar' })
  municipio_delegacion: string;

  @Column({ type: 'varchar', nullable: true })
  asentamiento: string;

  @Column({ type: 'varchar', nullable: true })
  referencia: string;
}