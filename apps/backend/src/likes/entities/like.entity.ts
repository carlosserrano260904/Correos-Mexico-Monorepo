// src/likes/like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { User } from '../../usuarios/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('likes')
@Unique(['usuario', 'producto'])
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, usuario => usuario.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: User;

    @ManyToOne(() => Product, producto => producto.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'producto_id' })
    producto: Product;


    @CreateDateColumn({ name: 'fecha_like' })
    fechaLike: Date;
}
