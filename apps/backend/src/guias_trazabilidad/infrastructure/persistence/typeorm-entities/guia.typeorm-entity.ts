import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { ContactosTypeormEntity } from "./contactos.typeorm-entity";

@Entity({ name: 'guias' })
export class GuiaTypeormEntity {
    @PrimaryColumn('uuid')
    id_guia: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    numero_seguimiento: string;

    @Column({ type: 'varchar', nullable: false })
    situacion_actual: string; // cambiar a enum

    @Column({ type: 'varchar', nullable: true })
    id_remitente: string | null;

    @ManyToOne(() => ContactosTypeormEntity, { nullable: true })
    @JoinColumn({ name: 'id_remitente' })
    remitente: ContactosTypeormEntity;

    @Column({ type: 'varchar', nullable: true })
    id_destinatario: string | null;

    @ManyToOne(() => ContactosTypeormEntity, { nullable: true })
    @JoinColumn({ name: 'id_destinatario' })
    destinatario: ContactosTypeormEntity;

    @Column({ type: 'numeric', nullable: false, precision: 5, scale: 2 })
    alto_cm: number;

    @Column({ type: 'numeric', nullable: false, precision: 5, scale: 2 })
    largo_cm: number;

    @Column({ type: 'numeric', nullable: false, precision: 5, scale: 2 })
    ancho_cm: number;

    @Column({ type: 'numeric', nullable: false, precision: 4, scale: 2 })
    peso_kg: number;

    @Column({ type: 'numeric', nullable: false, precision: 10, scale: 2 })
    valor_declarado: number;

    @Column({ type: 'timestamptz', nullable: false })
    fecha_creacion: Date;

    @Column({ type: 'timestamptz', nullable: false })
    fecha_actualizacion: Date;

    @Column({ type: 'timestamptz', nullable: true })
    fecha_entrega_estimada: Date;
}