import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GuiaTypeormEntity } from '../../guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { Unidad } from '../../unidades/entities/unidad.entity';

export enum EstadoEnvio {
  PENDIENTE = 'pendiente',
  EN_RUTA = 'en_ruta',
  ENTREGADO = 'entregado',
  FALLIDO = 'fallido',
  REPROGRAMADO = 'reprogramado',
  RETIRAR_SUCURSAL = 'retirar_sucursal',
}

@Entity({ name: 'envios' })
export class Envio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GuiaTypeormEntity, (guia) => guia.envios, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_guia' })
  guia: GuiaTypeormEntity;

  @ManyToOne(() => Unidad, (unidad) => unidad.envios, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_unidad' })
  unidad?: Unidad;

  @Column({
    type: 'enum',
    enum: EstadoEnvio,
    default: EstadoEnvio.PENDIENTE,
  })
  estado_envio: EstadoEnvio;

  @Column({
    type: 'timestamp',
    name: 'fecha_asignacion',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_asignacion: Date;

  @Column({ type: 'date', name: 'fecha_entrega_programada' })
  fecha_entrega_programada: Date;

  // Campos para entrega exitosa
  @Column({ type: 'varchar', name: 'nombre_receptor', nullable: true })
  nombre_receptor?: string;

  @Column({ type: 'varchar', name: 'evidencia_entrega', nullable: true })
  evidencia_entrega?: string;

  // Campos para fallo
  @Column({ type: 'varchar', name: 'motivo_fallo', nullable: true })
  motivo_fallo?: string;

  @Column({ type: 'date', name: 'fecha_entregado', nullable: true })
  fecha_entregado?: Date;

  @Column({ type: 'date', name: 'fecha_fallido', nullable: true })
  fecha_fallido?: Date;
}
