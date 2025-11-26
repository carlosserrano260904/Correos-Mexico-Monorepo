import { Product } from '../../products/entities/product.entity';
import { Profile } from '../../profile/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  diaTransaccion: Date;

  @ManyToOne(() => Profile, (profile) => profile.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column()
  profileId: number;

  @OneToMany(
    () => TransactionContents,
    (transaction) => transaction.transaction,
  )
  contenidos: TransactionContents[];
}

@Entity()
export class TransactionContents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  precio: number;

  @Column('int')
  cantidad: number;

  @ManyToOne(() => Product, (product) => product.id, {
    eager: true,
    cascade: true,
  })
  producto: Product;

  @ManyToOne(() => Transaction, (transaction) => transaction.contenidos, {
    cascade: true,
  })
  transaction: Transaction;
}
