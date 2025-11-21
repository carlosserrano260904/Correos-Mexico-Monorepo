// Archivo: apps/backend/src/create-account/entities/create-account.entity.ts

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Favorito } from '../../favoritos/entities/favorito.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('usuarios') // Mapea a la tabla 'usuarios'
export class CreateAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ type: 'varchar', nullable: true, name: 'contrasena' })
  password: string; // La clase usa 'password', la DB usa 'contrasena'

  @Column({ type: 'boolean', default: false })
  confirmado: boolean;

  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'token_created_at',
    default: () => 'CURRENT_TIMESTAMP'
  })
  tokenCreatedAt: Date | null;

  @Column({ type: 'varchar', default: 'usuario' })
  rol: string;

  @OneToMany(() => Favorito, favorito => favorito.usuario)
  favoritos: Favorito[];

  @OneToMany(() => Carrito, carrito => carrito.usuario)
  carrito: Carrito[];

  @OneToOne(() => Profile, { cascade: true })
  @JoinColumn()
  profile: Profile;
  
  // --- Columna añadida para el borrado lógico ---
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}