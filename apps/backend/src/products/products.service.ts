import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UploadImageService } from 'src/upload-image/upload-image.service';
import { In } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly uploadImageService: UploadImageService,
  ){

  }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
    });
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    // Las URLs de las imágenes ya están guardadas permanentemente en la base de datos.
    // Simplemente devolvemos los productos.
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const producto = await this.productRepository.findOne({
      where: {
        id,
      },
    });
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
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

  async get18RandomByCategoryOptimized(categoria: string): Promise<Product[]> {
  if (!categoria) return [];

  const idsResult = await this.productRepository
    .createQueryBuilder('p')
    .select('p.id', 'id') // alias para que el raw tenga { id: ... }
    .where('LOWER(p.categoria) = LOWER(:categoria)', { categoria })
    .orderBy('RANDOM()')
    .limit(18)
    .getRawMany<{ id: number }>();

  const ids = idsResult.map(r => r.id).filter(Boolean);
  if (ids.length === 0) {
    return [];
  }

  const productsUnordered = await this.productRepository.find({
    where: { id: In(ids) },
  });

  const productsById = new Map<number, Product>();
  productsUnordered.forEach(p => productsById.set(p.id, p));

  const ordered: Product[] = [];
  ids.forEach(id => {
    const prod = productsById.get(id);
    if (prod) ordered.push(prod);
  });

  return ordered;
}
}
