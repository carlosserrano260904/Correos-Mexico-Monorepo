import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository:Repository<Product>
  ){

  }
  create(createProductDto: CreateProductDto) {
    this.productRepository.save(createProductDto)
    return 'Producto creado correctamente';
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const producto = await this.productRepository.findOne({
      where:{
        id
      }
    })
    if(!producto){
      throw new NotFoundException('Producto no entontrado')
    }
    return producto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const producto = await this.findOne(id)
    producto.nombre = updateProductDto.nombre
    producto.descripcion = updateProductDto.descripcion
    producto.imagen = updateProductDto.imagen
    producto.inventario = updateProductDto.inventario
    producto.precio = updateProductDto.precio
    producto.categoria = updateProductDto.categoria;
    producto.color = updateProductDto.color;
    await this.productRepository.save(producto)
    return `Producto actualizado correctamente`;
  }

  async remove(id: number) {
    const producto = await this.findOne(id)
    await this.productRepository.remove(producto)
    return `Producto eliminado correctamente`;
  }
}
