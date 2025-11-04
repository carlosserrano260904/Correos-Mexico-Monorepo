import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('deletion_reasons')
export class DeletionReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  selected_option: string; // Para guardar la opción (ej. 'No me gusta...')

  @Column('text', { nullable: true }) // Permite que sea nulo si no eligen "Otro"
  other_text: string;

  @CreateDateColumn()
  created_at: Date;
}