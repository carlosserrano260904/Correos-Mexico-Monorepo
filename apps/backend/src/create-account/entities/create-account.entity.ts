import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Favorito } from '../../favoritos/entities/favorito.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('usuarios')
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
  password: string;

  @Column({ type: 'boolean', default: false })
  confirmado: boolean;

  @Column({ type: 'varchar', nullable: true })
  token: string | null;

  @Column({ 
    type: 'timestamp', 
    nullable: true, 
    name: 'token_created_at',
    default: () => 'CURRENT_TIMESTAMP' // Valor por defecto
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
}
