import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('favorito')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'fecha_agregado' })
  fechaAgregado: Date;

  @ManyToOne(() => Profile, usuario => usuario.favoritos, { onDelete: 'CASCADE' })
  usuario: Profile;

  @ManyToOne(() => Product, producto => producto.favoritos, { onDelete: 'CASCADE' })
  producto: Product;
}

