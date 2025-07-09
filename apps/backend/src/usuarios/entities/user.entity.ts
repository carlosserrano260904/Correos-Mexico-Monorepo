import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Like } from '../../likes/entities/like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'juan@example.com' })
  correo: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'hashedPassword' })
  contrasena: string | null;

  @Column({ type: 'varchar', default: 'usuario' })
  @ApiProperty({ example: 'usuario' })
  rol: string;

  @OneToMany(() => Like, (like: Like) => like.usuario)
  likes: Like[];
}
