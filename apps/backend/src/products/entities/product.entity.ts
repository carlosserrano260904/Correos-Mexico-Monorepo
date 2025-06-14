import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:60})
    nombre:string

    @Column({type:'varchar',length:120})
    descripcion:string

    @Column({type:'varchar',length:120,default:'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'})
    imagen:string

    @Column({type:'int'})
    inventario:number

    @Column({type:'decimal'})
    precio:number
}
