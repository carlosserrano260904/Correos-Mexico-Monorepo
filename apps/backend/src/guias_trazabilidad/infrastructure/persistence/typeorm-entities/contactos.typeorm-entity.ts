import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: 'contactos' })
export class ContactosTypeormEntity {
    @PrimaryColumn('uuid')
    id_contacto: string;

    @Column({ type: 'varchar', nullable: true })
    id_usuario: string;

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

    @Column({ type: 'varchar', nullable: false })
    ciudad: string;

    @Column({ type: 'varchar', nullable: false })
    pais: string;

    @Column({ type: 'varchar', nullable: false })
    codigo_postal: string;

    @Column({ type: 'varchar', nullable: false })
    estado: string;

    @Column({ type: 'varchar', nullable: true })
    municipio?: string;

    @Column({ type: 'varchar', nullable: true })
    delegacion?: string;

    @Column({ type: 'varchar', nullable: true })
    colonia?: string;

    @Column({ type: 'varchar', nullable: true })
    fraccionamiento?: string;
}