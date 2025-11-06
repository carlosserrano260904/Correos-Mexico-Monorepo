// src/profile/entities/profile.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Favorito } from '../../favoritos/entities/favorito.entity';
import { Factura } from '../../facturas/factura.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Misdireccione } from '../../misdirecciones/entities/misdireccione.entity';
import { CreateAccount } from '../../create-account/entities/create-account.entity';
import { Card } from '../../cards/entities/card.entity';
import { Review } from '../../review/entities/review.entity';
@Entity()
export class Profile {
  @ApiProperty({ example: 7 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Ana' })
  @Column({ type: 'varchar', length: 30 })
  nombre: string;

  @ApiProperty({ example: 'López' })
  @Column({ type: 'varchar', length: 30 })
  apellido: string;

  @ApiProperty({ example: '6181234567' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  numero: string;

  @OneToMany(() => Factura, (factura) => factura.profile)
  facturas: Factura[];

  @ApiProperty({ example: 'Durango' })
  @Column({ type: 'varchar' })
  estado: string;

  @ApiProperty({ example: 'Durango' })
  @Column({ type: 'varchar' })
  ciudad: string;

  @ApiProperty({ example: 'Centro' })
  @Column({ type: 'varchar' })
  fraccionamiento: string;

  @ApiProperty({ example: 'Av. Principal 123' })
  @Column({ type: 'varchar' })
  calle: string;

  @ApiProperty({ example: '34000' })
  @Column({ type: 'varchar', length: 5 })
  codigoPostal: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
  })
  @Column({
    type: 'text',
    default:
      'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
  })
  imagen: string;

  @OneToMany(() => Transaction, (tx) => tx.profile)
  transactions: Transaction[];

  @OneToMany(() => Favorito, (favorito) => favorito.usuario)
  favoritos: Favorito[];

  @OneToMany(() => Carrito, (carrito) => carrito.usuario)
  carrito: Carrito[];

  @OneToMany(() => Misdireccione, (direccion) => direccion.usuario, { cascade: true })
  direcciones: Misdireccione[];

  @OneToOne(() => CreateAccount, (user) => user.profile)
  usuario: CreateAccount;

  @OneToMany(() => Card, (card) => card.profile)
  cards: Card[];

  @ApiProperty({ example: 'cus_abc123', nullable: true })
  @Column({ type: 'varchar', nullable: true })
  stripeCustomerId: string | null;

  @OneToMany(() => Review, (review) => review.profile)
  reviews: Review[];
}
