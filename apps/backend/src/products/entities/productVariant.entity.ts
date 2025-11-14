import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Product } from "./product.entity";
import { ProductImage } from "./productImage.entity";
import { ProductAttributeValue } from "./productAttributeValue.entity";
import { Carrito } from "src/carrito/entities/carrito.entity";

@Entity("productVariant")
export class ProductVariant{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', name: 'productId' })
    productId: string;

    @ManyToOne(() => Product, (product) => product.variants,{
      onDelete: 'CASCADE'
    } )
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ type: "varchar", length: 60 })
    title: string | null;

    @ApiProperty({ example: "SKU-ABC-001" })
    @Column({ type: "varchar", length: 60, nullable: true })
    sku: string;

    @ApiProperty({ example: 1299.9, type: Number })
    @Column({
      type: "decimal",
      precision: 10,
      scale: 2,
      transformer: { to: (v: number) => v, from: (v: string) => parseFloat(v) },
    })
    price: number;

    @ApiProperty({ example: 25 })
    @Column({ type: "integer", default: 0 })
    inventoryQuantity: number;

    @ApiProperty({example: "120 cm"})
    @Column({type: "integer", nullable: true})
    weight: number | null; 

    @ApiProperty({ example: '2025-10-16T19:30:00.000Z'})
    @Column({type: "timestamp"})
    createdAt : Date;

    @OneToMany(()=> ProductImage, (image) => image.variant)
    images: ProductImage[];

    @OneToMany(() => ProductAttributeValue, (attrubutevalue) => attrubutevalue.variant ,)
    attributeValues: ProductAttributeValue;

    @OneToMany(() => Carrito, (carrito) => carrito.productVariant)
    carritoItems: Carrito[];
}