import {Column,Entity,PrimaryGeneratedColumn} from 'typeorm'
@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id:number
    @Column({type:'varchar',length:30})
    nombre:string

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
}
