import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum TipoDescuento {
  PORCENTAJE = 'porcentaje',
  CANTIDAD_FIJA = 'cantidad_fija'
}

export enum TipoAplicacion {
  PRODUCTO = 'producto',
  CATEGORIA = 'categoria',
  MARCA = 'marca',
  COMPRA_MINIMA = 'compra_minima',
  PRIMERA_COMPRA = 'primera_compra',
  USUARIO_ESPECIFICO = 'usuario_especifico'
}

export enum EstadoDescuento {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  PROGRAMADO = 'programado',
  EXPIRADO = 'expirado'
}

@Entity("descuentos")
export class Descuento {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Black Friday 2024" })
  @Column({ type: "varchar", length: 100 })
  nombre: string;

  @ApiProperty({ example: "Descuento especial para Black Friday" })
  @Column({ type: "text", nullable: true })
  descripcion: string;

  @ApiProperty({ 
    example: "porcentaje",
    enum: TipoDescuento,
    description: "Tipo de descuento: porcentaje o cantidad_fija"
  })
  @Column({
    type: "enum",
    enum: TipoDescuento,
    default: TipoDescuento.PORCENTAJE
  })
  tipo: TipoDescuento;

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
    example: "categoria",
    enum: TipoAplicacion,
    description: "Tipo de aplicación del descuento"
  })
  @Column({
    type: "enum",
    enum: TipoAplicacion
  })
  tipo_aplicacion: TipoAplicacion;

  @ApiProperty({ 
    example: ["electronica", "ropa"],
    description: "Valores específicos según el tipo de aplicación"
  })
  @Column({ type: "json", nullable: true })
  valores_aplicacion: string[] | number[];

  @ApiProperty({ 
    example: 500,
    description: "Monto mínimo de compra para aplicar el descuento"
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
    description: "Descuento máximo que puede aplicar"
  })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  descuento_maximo: number;

  @ApiProperty({ example: "2024-11-25T00:00:00.000Z" })
  @Column({ type: "timestamp", nullable: true })
  fecha_inicio: Date;

  @ApiProperty({ example: "2024-11-30T23:59:59.000Z" })
  @Column({ type: "timestamp", nullable: true })
  fecha_fin: Date;

  @ApiProperty({ 
    example: "activo",
    enum: EstadoDescuento,
    description: "Estado del descuento"
  })
  @Column({
    type: "enum",
    enum: EstadoDescuento,
    default: EstadoDescuento.ACTIVO
  })
  estado: EstadoDescuento;

  @ApiProperty({ 
    example: 10,
    description: "Prioridad del descuento (1 = mayor prioridad)"
  })
  @Column({ type: "int", default: 10 })
  prioridad: number;

  @ApiProperty({ 
    example: false,
    description: "Si se puede combinar con otros descuentos"
  })
  @Column({ type: "boolean", default: true })
  combinable: boolean;

  @ApiProperty({ 
    example: false,
    description: "Si se puede combinar con cupones"
  })
  @Column({ type: "boolean", default: true })
  combinable_con_cupones: boolean;

  @ApiProperty({ 
    example: 100,
    description: "Número máximo de usos del descuento"
  })
  @Column({ type: "int", nullable: true })
  usos_maximos: number;

  @ApiProperty({ 
    example: 25,
    description: "Número actual de usos"
  })
  @Column({ type: "int", default: 0 })
  usos_actuales: number;

  @ApiProperty({ 
    example: false,
    description: "Si es aplicable automáticamente"
  })
  @Column({ type: "boolean", default: false })
  automatico: boolean;

  @ApiProperty({ example: "2024-08-23T10:30:00.000Z" })
  @CreateDateColumn()
  fecha_creacion: Date;

  @ApiProperty({ example: "2024-08-23T10:30:00.000Z" })
  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @ApiProperty({ example: 1 })
  @Column({ type: "int", nullable: true })
  usuario_creador_id: number;
}
