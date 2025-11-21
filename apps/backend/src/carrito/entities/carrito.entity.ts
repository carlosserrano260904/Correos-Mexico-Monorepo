// apps/backend/src/carrito/carrito.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Product } from '../../products/entities/product.entity';


@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, u => u.carrito, { onDelete: 'CASCADE' })
  usuario: Profile;

  @ManyToOne(() => Product, p => p.carrito, { onDelete: 'CASCADE' })
  producto: Product;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio_unitario: number;

  @Column({ type: 'boolean', nullable: false })
  activo: boolean;
}