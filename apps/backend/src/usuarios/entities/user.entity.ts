import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('usuarios')
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  nombre: string;

   @Column({ nullable: true})
   apellido: string;

  @Column({ unique: false, nullable: false })
  correo: string;

  @Column({ type: 'varchar', nullable: true })
  contrasena: string | null;

  @Column ({ type: 'boolean', default: false, nullable: false })
  confirmado: boolean;

  @Column({ type: 'varchar', nullable: true})
  token: string | null;

  @Column({ type: 'timestamp', nullable: true, default: () => 'now()' })
  token_created_at: Date;

  @Column({ type: 'varchar', default: 'usuario', nullable: false })
  rol: string;

  @Column({ type: 'int4', name: 'profileId', nullable: true })
  profileId: number | null;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

}
