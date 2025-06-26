import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Paquete } from '../../paquete/entities/paquete.entity';
import { Transporte } from '../../transportes/entities/transporte.entity';
import { Ruta } from '../../rutas/entities/ruta.entity';

@Entity('asignacion_paquetes')
export class AsignacionPaquetes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'fecha_asignacion' })
  fecha_asignacion: Date;

  @ManyToOne(() => Paquete, { nullable: true })
  @JoinColumn({ name: 'idPaqueteId' })
  idPaquete: Paquete;

  @ManyToOne(() => Transporte, { nullable: true })
  @JoinColumn({ name: 'idTransporteId' })
  idTransporte: Transporte;

  @ManyToOne(() => Ruta, { nullable: true })
  @JoinColumn({ name: 'idRutaId' })
  idRuta: Ruta;
}
