import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Like } from '../../likes/entities/like.entity';
import { Favorito } from '../../favoritos/entities/favorito.entity';
import { Carrito } from '../../carrito/entities/carrito.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:60})
    nombre:string

    @Column({type:'varchar',length:120})
    descripcion:string

    @Column({type:'varchar',length:250,default:'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'})
    imagen:string

    @Column({type:'int'})
    inventario:number

    @Column({type:'decimal'})
    precio:number

    @Column({type:'varchar', nullable: true})
    categoria:string 

    @Column({type:'varchar', nullable: true})
    color:string

    @OneToMany(() => Favorito, favorito => favorito.producto )
    favoritos: Favorito[];

    @OneToMany(() => Carrito, carrito => carrito.producto)
    carrito: Carrito[];

    @OneToMany(() => Like, like => like.producto)
    likes: Like[];

    
}
