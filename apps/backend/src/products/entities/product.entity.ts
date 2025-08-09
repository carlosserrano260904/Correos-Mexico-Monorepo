import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Favorito } from "../../favoritos/entities/favorito.entity";
import { Carrito } from "../../carrito/entities/carrito.entity";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";

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

  @ApiProperty({ type: () => [ProductImage] })
  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  // Estas dos propiedades son las que necesitan tus otras entidades
  @OneToMany(() => Favorito, (favorito) => favorito.producto)
  favoritos: Favorito[];

  @OneToMany(() => Carrito, (carrito) => carrito.producto)
  carrito: Carrito[];
}
