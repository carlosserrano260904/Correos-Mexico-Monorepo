import { Transaction } from 'src/transactions/entities/transaction.entity'
import {Column,Entity,OneToMany,PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id:number
    @Column({type:'varchar',length:30})
    nombre:string
//prueba 
    @Column({type:'varchar',length:30})
    apellido:string

    @Column({type:'varchar',length:10})
    numero:string

    @Column({type:'varchar'})
    estado:string

    @Column({type:'varchar'})
    ciudad:string

    @Column({type:'varchar'})
    fraccionamiento:string

    @Column({type:'varchar'})
    calle:string
    
    @Column({type:'varchar',length:5})
    codigoPostal:string

    @Column({type:'varchar',length:120,default:'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'})
    imagen:string

    @OneToMany(()=>Transaction,tx=>tx.profile)
    transactions:Transaction[];
}
