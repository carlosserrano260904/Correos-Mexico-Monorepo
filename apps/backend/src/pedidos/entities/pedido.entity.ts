import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Product } from 'src/products/entities/product.entity';
import { Misdireccione } from 'src/misdirecciones/entities/misdireccione.entity';
@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal' })
  total: number;

  @Column()
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  fecha: Date;

  @ManyToOne(() => Profile, (profile) => profile.id, { nullable: false })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column()
  profileId: number;

  @OneToMany(() => PedidoProducto, (pp) => pp.pedido, { cascade: true, eager: true })
  productos: PedidoProducto[];

  @ManyToOne(() => Misdireccione, { nullable: true })
  @JoinColumn({ name: 'direccionId' })
  direccion: Misdireccione;

  @Column( { nullable: true })
  direccionId: number;
}

@Entity()
export class PedidoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidad: number;

  @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'productoId' })
  producto: Product;

  @Column()
  productoId: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @Column()
  pedidoId: number;
}
