import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { ProductAttributeValue } from "./productAttributeValue.entity";
import { ProductCategory } from "./productCategory.entity";

@Entity("attributeDefinition")
export class AttributeDefinition{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 60 })
    name: string;

    @Column({ type: "varchar", length: 120 })
    type: string;

    @Column({ type: "boolean", default: false, name: 'isVarianOption' })
    isVariantOption: boolean;

    @OneToMany(()=> ProductAttributeValue, (value) => value.attributeDefinition)
    values: ProductAttributeValue;

    @ManyToMany(() => ProductCategory, (category) => category.attributes, )
    categories: ProductCategory[];
}
