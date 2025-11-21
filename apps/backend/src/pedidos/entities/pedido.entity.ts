import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Product } from '../../products/entities/product.entity';
import { Misdireccione } from '../../misdirecciones/entities/misdireccione.entity';
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

  @Column({ nullable: true })
  estatus_pago: string; // estado del pago (ej. pagado, pendiente, fallido)

  @Column({ nullable: true })
  calle: string;

  @Column({ nullable: true })
  numero_int: string;

  @Column({ nullable: true })
  numero_exterior: string;

  @Column({ nullable: true })
  cp: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  nombre: string; // nombre del titular

  @Column({ nullable: true })
  last4: string; // últimos 4 dígitos de la tarjeta

  @Column({ nullable: true })
  brand: string; // marca de la tarjeta (VISA, MasterCard, etc.)
}

@Entity()
export class PedidoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  cantidad: number;

  @ManyToOne(() => Product, (productos) => productos.id, { eager: true, cascade: true })
  @JoinColumn({ name: 'productoId' })
  producto: Product;

  @Column()
  productoId: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedidoId' })
  pedido: Pedido;

  @Column()
  pedidoId: number;
  
  @Column({ nullable: true })
  n_guia: string;
}
