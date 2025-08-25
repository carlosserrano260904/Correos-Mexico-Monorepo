import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum TipoCupon {
  PORCENTAJE = 'porcentaje',
  CANTIDAD_FIJA = 'cantidad_fija'
}

export enum EstadoCupon {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  EXPIRADO = 'expirado',
  AGOTADO = 'agotado'
}

@Entity("cupones")
export class Cupon {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "DESCUENTO20" })
  @Column({ type: "varchar", length: 50, unique: true })
  codigo: string;

  @ApiProperty({ example: "Descuento del 20% en toda la tienda" })
  @Column({ type: "varchar", length: 200 })
  descripcion: string;

  @ApiProperty({ 
    example: "porcentaje",
    enum: TipoCupon,
    description: "Tipo de descuento: porcentaje o cantidad_fija"
  })
  @Column({
    type: "enum",
    enum: TipoCupon,
    default: TipoCupon.PORCENTAJE
  })
  tipo: TipoCupon;

  @ApiProperty({ 
    example: 20,
    description: "Valor del descuento (20 para 20% o 100 para $100 MXN)"
  })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  valor: number;

  @ApiProperty({ 
    example: 500,
    description: "Monto mínimo de compra para aplicar el cupón"
  })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    default: 0,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  monto_minimo: number;

  @ApiProperty({ 
    example: 1000,
    description: "Descuento máximo que puede aplicar este cupón"
  })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  descuento_maximo: number;

  @ApiProperty({ example: 100 })
  @Column({ type: "int", default: 1 })
  usos_maximos: number;

  @ApiProperty({ example: 15 })
  @Column({ type: "int", default: 0 })
  usos_actuales: number;

  @ApiProperty({ example: "2024-12-31T23:59:59.000Z" })
  @Column({ type: "timestamp", nullable: true })
  fecha_expiracion: Date;

  @ApiProperty({ 
    example: "activo",
    enum: EstadoCupon,
    description: "Estado del cupón"
  })
  @Column({
    type: "enum",
    enum: EstadoCupon,
    default: EstadoCupon.ACTIVO
  })
  estado: EstadoCupon;

  @ApiProperty({ example: "2024-08-23T10:30:00.000Z" })
  @CreateDateColumn()
  fecha_creacion: Date;

  @ApiProperty({ example: "2024-08-23T10:30:00.000Z" })
  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ApiProperty({ example: 1 })
  @Column({ type: "int", nullable: true })
  usuario_creador_id: number;

  @ApiProperty({ 
    example: false,
    description: "Si es true, solo se puede usar una vez por usuario"
  })
  @Column({ type: "boolean", default: false })
  uso_unico_por_usuario: boolean;

  @ApiProperty({ 
    example: ["electronica", "ropa"],
    description: "Categorías de productos a las que aplica el cupón"
  })
  @Column({ type: "json", nullable: true })
  categorias_aplicables: string[];

  @ApiProperty({ 
    example: [1, 5, 10],
    description: "IDs de productos específicos a los que aplica el cupón"
  })
  @Column({ type: "json", nullable: true })
  productos_aplicables: number[];
}
