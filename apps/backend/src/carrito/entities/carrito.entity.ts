// apps/backend/src/carrito/carrito.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from 'src/products/entities/productVariant.entity';


@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, u => u.carrito, { onDelete: 'CASCADE' })
  usuario: Profile;

  @Column({ type: 'uuid', name: 'productVariantId' })
  productVariantId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.carritoItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productVariantId' })
  productVariant: ProductVariant;

  @Column({ type: 'int', nullable: false })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  precio_unitario: number;

  @Column({ type: 'boolean', nullable: false })
  activo: boolean;
}