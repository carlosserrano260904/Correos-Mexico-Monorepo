import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, ManyToMany,JoinTable } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Product } from './product.entity';
import { AttributeDefinition } from "./attributeDefinition.entity";
import { Category } from "src/categories/entities/category.entity";


@Entity("productCategory")
export class ProductCategory{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ example: "Tenis Runner" })
    @Column({ type: "varchar", length: 60 })
    name: string;

    @ApiProperty({ example: "tenis-runner-negro" })
    @Column({ type: "varchar", length: 120 })
    slug: string;    

    @Column({type: 'varchar', nullable: true})
    parentCategoryId:string;

    @ManyToOne(() => ProductCategory, (category) => category.children)
    @JoinColumn({name: 'parentCategoryId'})
    parent: ProductCategory;

    @OneToMany(()=> ProductCategory, (category) => category.parent)
    children :ProductCategory[];

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @OneToMany(()=> AttributeDefinition, (attribute) => attribute.categories)
    @JoinTable({name: 'categoryAttributeMap', joinColumn:{name:'categoryId', referencedColumnName:'id'},
    inverseJoinColumn:{name:'attributeId',referencedColumnName:'id'},})
    attributes: AttributeDefinition[];


}
