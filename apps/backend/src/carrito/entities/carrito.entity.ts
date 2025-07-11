// apps/backend/src/carrito/carrito.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';


@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CreateAccount, (account) => account.carrito, { onDelete: 'CASCADE' })
  usuario: CreateAccount;

  @ManyToOne(() => Product, p => p.carrito, { onDelete: 'CASCADE' })
  producto: Product;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_unitario: number;

  @Column({ type: 'boolean', nullable: true })
  activo: boolean;
}