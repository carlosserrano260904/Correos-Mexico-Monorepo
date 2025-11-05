import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Product } from './product.entity';
import { AttributeDefinition } from "./attributeDefinition.entity";
import { ProductVariant } from "./productVariant.entity";

@Entity("productAttributeValue")
export class ProductAttributeValue{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', name: 'productId' })
    productId: string;

    @Column({ type: 'varchar', name: 'attributeId' })
    attributeId: string;

    @Column({ type: 'varchar', nullable: true, name: 'variantId' })
    variantId: string;

    @ManyToOne(() => Product, (product) => product.attributeValues)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @ManyToOne(() => AttributeDefinition , (definition) => definition.values)    
    @JoinColumn({name: 'attributeId'})
    attributeDefinition: AttributeDefinition;

    @Column({type: "text", length: 120})
    value: string;

    @ManyToOne(() => ProductVariant, (variant) => variant.attributeValues, {nullable:true})
    @JoinColumn({name: "variantId"})
    variant: ProductVariant;

}