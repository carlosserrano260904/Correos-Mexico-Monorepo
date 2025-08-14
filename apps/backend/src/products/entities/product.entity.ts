import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Favorito } from "../../favoritos/entities/favorito.entity";
import { Carrito } from "../../carrito/entities/carrito.entity";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Review } from "src/review/entities/review.entity";

@Entity("productos")
export class Product {
  @ApiProperty({ example: 12 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Tenis Runner" })
  @Column({ type: "varchar", length: 60 })
  nombre: string;

  @ApiProperty({ example: "Tenis deportivos para correr" })
  @Column({ type: "varchar", length: 120 })
  descripcion: string;

  @ApiProperty({ example: 1299.9 })
  @Column({ type: "decimal", precision: 10, scale: 2 })
  precio: number;

  @ApiProperty({ example: "Calzado", nullable: true })
  @Column({ type: "varchar", nullable: true })
  categoria: string | null;

  @ApiProperty({ example: 25, description: "Unidades disponibles en inventario" })
  @Column({ type: "int", default: 0 })
  inventario:number

  @ApiProperty({ example: "Negro", description: "Color principal del producto" })
  @Column({ type: "varchar", length: 40 })
  color:string

  @ApiProperty({ example: "Nike" })
  @Column({ type: "varchar", length: 60 })
  marca:string

  @ApiProperty({ example: "tenis-runner-negro", description: "Identificador legible en URL, único" })
  @Column({ type: "varchar", length: 120 })
  slug:string

  @ApiProperty({ example: "SportCenter MX", description: "Nombre del vendedor" })
  @Column({ type: "varchar", length: 80 })
  vendedor:string

  @ApiProperty({ example: true, description: "Si el producto está activo/publicado" })
  @Column({ type: "boolean", default: true })
  estado:boolean

  @ApiProperty({ example: 132, description: "Unidades vendidas acumuladas" })
  @Column({ type: "int", default: 0 })
  vendidos:number

  @ApiProperty({ example: "SKU-ABC-001", description: "Código de inventario único" })
  @Column({ type: "varchar", length: 60 })
  sku:string

  @ApiProperty({ type: () => [ProductImage] })
  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  // Estas dos propiedades son las que necesitan tus otras entidades
  @OneToMany(() => Favorito, (favorito) => favorito.producto)
  favoritos: Favorito[];

  @OneToMany(() => Carrito, (carrito) => carrito.producto)
  carrito: Carrito[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}

/*
📝 CAMPOS FALTANTES EN LA BASE DE DATOS:

🔴 CAMPOS OBLIGATORIOS:
- inventario: number (stock/cantidad disponible)
- color: string | null (color del producto)
- imagen: string | null (URL de imagen principal)

🟡 CAMPOS OPCIONALES PARA FRONTEND:
- slug: string (URL amigable para SEO)
- marca: string (brand/marca del producto)
- vendedor: string (seller name)
- estado: boolean (activo/inactivo)
- vendidos: number (cantidad vendida)
- sku: string (código único del producto)

💡 MIGRATION SUGERIDA:
ALTER TABLE productos ADD COLUMN inventario INT DEFAULT 0;
ALTER TABLE productos ADD COLUMN color VARCHAR(7) DEFAULT NULL;
ALTER TABLE productos ADD COLUMN imagen TEXT DEFAULT NULL;
ALTER TABLE productos ADD COLUMN slug VARCHAR(100) DEFAULT NULL;
ALTER TABLE productos ADD COLUMN marca VARCHAR(50) DEFAULT NULL;
ALTER TABLE productos ADD COLUMN vendedor VARCHAR(60) DEFAULT NULL;
ALTER TABLE productos ADD COLUMN estado BOOLEAN DEFAULT TRUE;
ALTER TABLE productos ADD COLUMN vendidos INT DEFAULT 0;
ALTER TABLE productos ADD COLUMN sku VARCHAR(20) DEFAULT NULL;

🎯 PRIORIDAD: Los campos inventario, color e imagen son los MÁS URGENTES
   porque ya están siendo usados en el frontend según tu schema de Zod.
*/