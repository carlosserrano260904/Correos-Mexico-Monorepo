// Archivo: apps/backend/src/usuarios/entities/deletion-reason.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('deletion_reasons')
export class DeletionReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  selected_option: string;

  @Column('text', { nullable: true })
  other_text: string | null;

  @CreateDateColumn()
  created_at: Date;
}
