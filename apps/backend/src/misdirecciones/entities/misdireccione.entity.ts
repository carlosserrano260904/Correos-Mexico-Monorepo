import {Column,Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn} from 'typeorm'
import { Profile } from '../../profile/entities/profile.entity';
import { Pedido } from '../../pedidos/entities/pedido.entity';
@Entity()

export class Misdireccione {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100 })
    nombre: string

    @Column({ type: 'varchar', length: 100 })
    calle: string

    @Column({ type: 'varchar', length: 100 })
    colonia_fraccionamiento: string

    @Column({ type: 'int', nullable: true })
    numero_interior: number |   null;

    @Column({ type: 'int', nullable: true })
    numero_exterior: number |   null;

    @Column({ type: 'varchar', length: 100})
    numero_celular: string

    @Column({ type: 'varchar', length: 5 })
    codigo_postal: string

    @Column({ type: 'varchar', length: 50 })
    estado: string

    @Column({ type: 'varchar', length: 100 })
    municipio: string

    @Column({ type: 'varchar', length: 100,nullable:true })
    mas_info: string | null;

    @ManyToOne(() => Profile, usuario => usuario.direcciones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Profile;

    @OneToMany(() => Pedido, pedido => pedido.direccion, { onDelete: 'CASCADE' })
    pedidos: Pedido[];
}
