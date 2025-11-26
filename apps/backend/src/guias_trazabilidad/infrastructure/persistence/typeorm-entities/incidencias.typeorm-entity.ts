import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GuiaTypeormEntity } from './guia.typeorm-entity';

// tabla log, cada registro es inmutable
@Entity({ name: 'incidencias_guias' })
export class IncidenciasTypeormEntity {
  @PrimaryColumn('uuid')
  id_incidencia: string;

  @Column({ type: 'uuid', nullable: false })
  id_guia: string;
  @ManyToOne(() => GuiaTypeormEntity, { nullable: false })
  @JoinColumn({ name: 'id_guia' })
  guia: GuiaTypeormEntity;

  @Column({ type: 'varchar', nullable: false })
  tipo_incidencia: string;

  @Column({ type: 'varchar', nullable: true })
  descripcion?: string;

  @Column({ type: 'timestamptz', nullable: false })
  fecha_incidencia: Date;

  @Column({ type: 'varchar', nullable: false })
  id_usuario_responsable: string; // pendiente tabla usuarios
}
