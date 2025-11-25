// src/products/entities/product.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Favorito } from "../../favoritos/entities/favorito.entity";
import { Carrito } from "../../carrito/entities/carrito.entity";
import { ProductImage } from "./product-image.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Review } from "../../review/entities/review.entity"; 
import { CreatedCouponEntity } from "../../coupons/entities/created-coupon.entity";

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

  @ApiProperty({example: "120 cm"})
  @Column({type: "float4", nullable: true})
  altura: number | null; 

  @ApiProperty({example: "120 cm"})
  @Column({type: "float4", nullable: true})
  largo: number | null; 

  @ApiProperty({example: "120 cm"})
  @Column({type: "float4", nullable: true})
  ancho: number | null; 

  @ApiProperty({example: "2kg"})
  @Column({type: "float4", nullable: true})
  peso: number | null; 

  @ApiProperty({ example: 1299.9, type: Number })
  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  })
  precio: number;

  @ApiProperty({ example: "Calzado", nullable: true })
  @Column({ type: "varchar", nullable: true })
  categoria: string | null;

  @ApiProperty({ example: 25 })
  @Column({ type: "int", default: 0 })
  inventario: number;

  @ApiProperty({ example: "Negro" })
  @Column({ type: "varchar", length: 40 })
  color: string;

  @ApiProperty({ example: "Nike" })
  @Column({ type: "varchar", length: 60 })
  marca: string;

  @ApiProperty({ example: "tenis-runner-negro" })
  @Column({ type: "varchar", length: 120 })
  slug: string;

  @ApiProperty({ example: "SportCenter MX" })
  @Column({ type: "varchar", length: 80 })
  vendedor: string;

  @ApiProperty({ example: true })
  @Column({ type: "boolean", default: true })
  estado: boolean;

  @ApiProperty({ example: 132 })
  @Column({ type: "int", default: 0 })
  vendidos: number;

  @ApiProperty({ example: "SKU-ABC-001" })
  @Column({ type: "varchar", length: 60 })
  sku: string;

  @ApiProperty({ example: 1})
  @Column({ type: "int", nullable: true })
  idPerfil: number | null;

  @ApiProperty({ type: () => [ProductImage] })
  @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Favorito, (favorito) => favorito.producto)
  favoritos: Favorito[];

  @OneToMany(() => Carrito, (carrito) => carrito.producto)
  carrito: Carrito[];

  @ApiProperty({
    type: () => [Review],
    example: [
      {
        id: 1,
        rating: 5,
        comment: "Excelente calidad",
        createdAt: "2025-08-09T12:00:00.000Z",
        updatedAt: "2025-08-09T12:00:00.000Z",
        productId: 1,
        profileId: 3,
        images: [
          { id: 10, url: "https://res.cloudinary.com/.../rev1.jpg", orden: 0, reviewId: 1 }
        ]
      }
    ]
  })
  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => CreatedCouponEntity, (coupon) => coupon.product)
  createdCoupons?: CreatedCouponEntity[];

}