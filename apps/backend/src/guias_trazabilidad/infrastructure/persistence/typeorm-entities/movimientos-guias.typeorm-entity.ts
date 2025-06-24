import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { GuiaTypeormEntity } from "./guia.typeorm-entity";

@Entity({ name: 'movimientos_guias' })
export class MovimientoGuiasTypeormEntity {
    @PrimaryColumn('uuid')
    id_movimiento: string;

    @Column({ type: 'uuid', nullable: false })
    id_guia: string;
    @ManyToOne(() => GuiaTypeormEntity, { nullable: false })
    @JoinColumn({ name: 'id_guia' })
    guia: GuiaTypeormEntity;

    @Column({ type: 'varchar', nullable: false })
    id_sucursal: string; // pendiente tabla sucursales

    @Column({ type: 'varchar', nullable: false })
    id_ruta: string; // pendiente tabla rutas

    @Column({ type: 'varchar', nullable: false })
    estado: string;

    @Column({ type: 'varchar', nullable: false })
    localizacion: string;

    @Column({ type: 'timestamptz', nullable: false })
    fecha_movimiento: Date;
}