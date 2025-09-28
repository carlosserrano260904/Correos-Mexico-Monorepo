import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("solicitud_vendedor")
export class Solicitud {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    nombre_tienda: string;

    @Column()
    @IsNotEmpty()
    categoria_tienda: string;

    @Column()
    @IsPhoneNumber()    
    @IsNotEmpty()
    telefono: string;

    @Column({ nullable: true, default: null })
    email: string;
    
    @Column()
    @IsNotEmpty()
    direccion_fiscal: string;

    @Column()
    @IsNotEmpty()
    rfc: string;

    @Column()
    @IsNotEmpty()
    curp: string;

    @Column({ nullable: true })
    img_uri: string;

    @Column()
    @IsNotEmpty()
    userId: number;
}