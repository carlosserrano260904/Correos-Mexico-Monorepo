import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'contactos_guias' })
export class ContactosTypeormEntity {
  @PrimaryColumn('uuid')
  id_contacto: string;

  @Column({ type: 'varchar', nullable: true })
  id_usuario?: string | null;

  @Column({ type: 'varchar', nullable: false })
  nombres: string;

  @Column({ type: 'varchar', nullable: false })
  apellidos: string;

  @Column({ type: 'varchar', nullable: false })
  telefono: string;

  @Column({ type: 'varchar', nullable: false })
  calle: string;

  @Column({ type: 'varchar', nullable: false })
  numero: string;

  @Column({ type: 'varchar', nullable: true })
  numero_interior?: string | null;

  @Column({ type: 'varchar', nullable: false })
  asentamiento: string;

  @Column({ type: 'varchar', nullable: false })
  codigo_postal: string;

  @Column({ type: 'varchar', nullable: false })
  localidad: string;

  @Column({ type: 'varchar', nullable: false })
  estado: string;

  @Column({ type: 'varchar', nullable: true })
  pais: string;

  @Column({ type: 'numeric', nullable: true })
  lat?: number | null;

  @Column({ type: 'numeric', nullable: true })
  lng?: number | null;

  @Column({ type: 'text', nullable: true })
  referencia?: string | null;
}
