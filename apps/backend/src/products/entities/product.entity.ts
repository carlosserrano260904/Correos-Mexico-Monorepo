// src/products/entities/product.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Favorito } from "../../favoritos/entities/favorito.entity";
import { Carrito } from "../../carrito/entities/carrito.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Review } from "src/review/entities/review.entity"; 
import { ProductCategory } from "./productCategory.entity";
import { ProductVariant } from "./productVariant.entity";
import { ProductAttributeValue } from "./productAttributeValue.entity";
import { Category } from "src/categories/entities/category.entity";
import { CreatedCouponEntity } from "src/coupons/entities/created-coupon.entity";

export enum productStatus {
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT'
}

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type : "uuid", name: 'sellerId'})
  sellerId: string;

  @ApiProperty({ example: "Tenis Runner" })
  @Column({ type: "varchar", length: 60 })
  title: string;

  @ApiProperty({ example: "tenis-runner-negro" })
  @Column({ type: "varchar", length: 120 })
  slug: string;

  @ApiProperty({ example: "Tenis deportivos para correr" })
  @Column({ type: "text", length: 120, nullable:true })
  description: string;

  // @ApiProperty({example: "120 cm"})
  // @Column({type: "float4", nullable: true})
  // altura: number | null; 

  // @ApiProperty({example: "120 cm"})
  // @Column({type: "float4", nullable: true})
  // largo: number | null; 

  // @ApiProperty({example: "120 cm"})
  // @Column({type: "float4", nullable: true})
  // ancho: number | null; 

  // @ApiProperty({example: "2kg"})
  // @Column({type: "float4", nullable: true})
  // peso: number | null; 

  // @ApiProperty({ example: 1299.9, type: Number })
  // @Column({
  //   type: "decimal",
  //   precision: 10,
  //   scale: 2,
  //   transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
  // })
  // precio: number;

  @Column({type: 'uuid', nullable:true,name:'categoryId'})
  categoryId: string;
  
  @ManyToOne(() => ProductCategory, category => category.products)
  @JoinColumn({name : 'categoryId'})
  @ApiProperty({ example: "Calzado", nullable: true })
  category : ProductCategory ;

  // @ApiProperty({ example: 25 })
  // @Column({ type: "int", default: 0 })
  // inventario: number;

  // @ApiProperty({ example: "Negro" })
  // @Column({ type: "varchar", length: 40 })
  // color: string;

  // @ApiProperty({ example: "Nike" })
  // @Column({ type: "varchar", length: 60 })
  // marca: string;

  // @ApiProperty({ example: "SportCenter MX" })
  // @Column({ type: "varchar", length: 80 })
  // vendedor: string;

  @ApiProperty({ example: true })
  @Column({ type: "enum", enum: productStatus, default: productStatus.DRAFT })
  status: productStatus;

  @ApiProperty({ example: '2025-10-16T19:30:00.000Z'})
  @CreateDateColumn({ name: 'createdAt' })
  createdAt : Date;

  @OneToMany(()=> ProductVariant, (variant)=> variant.product)
  variants : ProductVariant[];

  @OneToMany(()=> ProductAttributeValue, (attributeValue) => attributeValue.product)
  attributeValues : ProductAttributeValue[];

  // @ApiProperty({ example: 132 })
  // @Column({ type: "int", default: 0 })
  // vendidos: number;

  // @ApiProperty({ example: "SKU-ABC-001" })
  // @Column({ type: "varchar", length: 60 })
  // sku: string;

  // @ApiProperty({ example: 1})
  // @Column({ type: "int", nullable: true })
  // idPerfil: number | null;

  @OneToMany(() => Favorito, (favorito) => favorito.producto)
  favoritos: Favorito[];

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