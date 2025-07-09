import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Favorito } from 'src/favoritos/entities/favorito.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';

@Entity()
export class CreateAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  apellido: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  confirmado: boolean;

  @Column({ type: 'varchar', nullable: true })
  token: string;

   @Column({ type: 'varchar', default: 'usuario' })
    rol: string;
  
  @OneToMany(() => Favorito, favorito => favorito.usuario )
    favoritos: Favorito[];
  
  @OneToMany(() => Carrito, carrito => carrito.usuario)
    carrito: Carrito[];
}
