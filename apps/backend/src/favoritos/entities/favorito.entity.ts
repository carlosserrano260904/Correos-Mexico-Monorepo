import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Product } from 'src/products/entities/product.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';

@Entity('favorito')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_agregado' })
  fechaAgregado: Date;

  @ManyToOne(() => CreateAccount, (account) => account.favoritos, { onDelete: 'CASCADE' })
  usuario: CreateAccount;

  @ManyToOne(() => Product, producto => producto.favoritos, { onDelete: 'CASCADE' })
  producto: Product;
}

