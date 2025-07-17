import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asignaciones_historial')
export class HistorialAsignacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_conductor', length: 255 })
  nombreConductor: string;

  @Column({ length: 18 })
  curp: string;

  @Column({ name: 'placas_unidad', length: 20 })
  placasUnidad: string;

  @Column({ name: 'oficina_salida', length: 5})
  rutaSalida: string;

  @Column({ name: 'clave_cuo_destino', length: 10 }) // Longitud ajustada para CUO
  claveOficinaDestino: string

  @Column({ name: 'fecha_asignacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaAsignacion: Date;

  @Column({ name: 'fecha_finalizacion', type: 'timestamp', nullable: true })
  fechaFinalizacion: Date | null;
}