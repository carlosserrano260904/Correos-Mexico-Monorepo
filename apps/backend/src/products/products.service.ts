// src/products/products.service.ts
import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm'; 
import { Product, productStatus } from './entities/product.entity'; 
import { ProductImage } from './entities/productImage.entity';
import { ProductVariant } from './entities/productVariant.entity';
import { ProductAttributeValue } from './entities/productAttributeValue.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { AddImageToVariantDto } from './dto/add-images.dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    private readonly uploadImageService: UploadImageService,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductAttributeValue)
    private readonly attributeValueRepository: Repository<ProductAttributeValue>,
    // private readonly uploadImageService: UploadImageService
    private readonly dataSource: DataSource,
  ) {}

  //  MÉTODO CREATE (CON TRANSACCIONES)
  // El DTO ya tiene las URLs.
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Separamos las variantes del DTO principal
      const { variants: variantsDto, ...productData } = createProductDto;

      //Creamos el Producto (aún no se guarda)
      const product = this.productRepository.create({
        ...productData,
      });

      //Guardamos el producto DENTRO de la transacción
      await queryRunner.manager.save(product);

      //Recorremos las variantes del DTO
      for (const variantDto of variantsDto) {
        const { images: imagesDto, attributes: attributesDto, ...variantData } =
          variantDto;

        //Creamos la Variante, conectada al producto
        const variant = this.variantRepository.create({
          ...variantData,
          product: product, // Conectamos al producto
        });

        //Guardamos la Variante DENTRO de la transacción
        await queryRunner.manager.save(variant);

        //Recorremos las imágenes de esta variante
        for (const imageDto of imagesDto) {
          const image = this.imageRepository.create({
            ...imageDto,
            variant: variant, // Conectamos la imagen a la VARIANTE
          });
          //Guardamos la Imagen DENTRO de la transacción
          await queryRunner.manager.save(image);
        }

        //Recorremos los atributos de esta variante
        for (const attrDto of attributesDto) {
          const attrValue = this.attributeValueRepository.create({
            ...attrDto,
            product: product, // Conectado al producto
            variant: variant, // Conectado a esta variante
          });
          //Guardamos el Atributo DENTRO de la transacción
          await queryRunner.manager.save(attrValue);
        }
      }

      //Si todo salió bien, confirmamos la transacción
      await queryRunner.commitTransaction();

      //Devolvemos el producto completo
      //Es mejor recargarlo para obtener todas las relaciones
      return this.findOne(product.id);
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`, error.stack);
      //Si algo falló, revertimos
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Error al crear el producto, la operación fue revertida.',
      );
    } finally {
      //Liberamos el queryRunner
      await queryRunner.release();
    }
  }

  //MÉTODOS DE LECTURA

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: {
        category: true,
        reviews: { profile: true }, //reviews
        variants: {
          images: true,
          attributeValues: {
            attributeDefinition: true, //Para saber el "nombre" del atributo
          },
        },
      },
    });
  }

  //Nota: 'estado: true' ya no existe, ahora es 'status: productStatus.PUBLISHED'
  async findAllActive(): Promise<Product[]> {
    return this.productRepository.find({
      where: { status: productStatus.PUBLISHED }, //CAMBIO DE LÓGICA
      relations: {
        category: true,
        variants: {
          images: true,
          attributeValues: { attributeDefinition: true },
        },
        reviews: { profile: true },
      },
    });
  }

  //El ID ahora es 'string' (UUID)
  async findOne(id: string): Promise<Product> {
    const producto = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        variants: {
          images: true,
          attributeValues: { attributeDefinition: true },
        },
        reviews: { profile: true, images: true }, //reviews
      },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  //MÉTODOS DE ESCRITURA

  //El ID ahora es 'string' (UUID)
  //El 'Update' anidado es MUY complejo (requiere comparar arrays), 
  // esta es una versión simple que solo actualiza el producto principal
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    //Este DTO no puede actualizar variantes, solo los campos del producto principal (title, description, status, etc.)
    const producto = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.productRepository.save(producto);
  }

  //El ID ahora es 'string' (UUID)
  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }

  //El ID ahora es 'string' (UUID)
  async softRemove(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    //Cambiamos el estado en lugar de borrarlo
    product.status = productStatus.ARCHIVED; // <--- CAMBIO DE LÓGICA
    return this.productRepository.save(product);
  }

  //Actualiza los campos de una variante específica.
  async updateVariant(
    variantId: string,
    updateDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.variantRepository.preload({
      id: variantId,
      ...updateDto,
    });

    if (!variant) {
      throw new NotFoundException(`Variante con ID ${variantId} no encontrada`)
    }

    return this.variantRepository.save(variant);
  }
  
  //Agrega nuevas imágenes (URLs) a una variante existente.
  async addImagesToVariant(
    variantId: string,
    dto: AddImageToVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOneBy({id : variantId});
    if (!variant) {
      throw new NotFoundException(`Variante con ID ${variantId} no encontrada.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const imageDto of dto.images) {
        const image = this.imageRepository.create({
          ...imageDto,
          variant: variant,
        });
        await queryRunner.manager.save(image);
      }
      await queryRunner.commitTransaction();
    } catch(error){
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error al agregar imágenes a la variante ${variantId}`, error.stack,);
      throw new InternalServerErrorException('No se pudieron agregar las imágenes.')
    } finally {
      await queryRunner.release();
    }

    return this.variantRepository.findOneOrFail({where: {id: variantId}, relations: ['images']});
  }

  //Elimina una ProductImage específica por su ID
  async deleteVariantImage(imageId : string): Promise<void>{
    const image = await this.imageRepository.findOneBy({id : imageId});

    if(!image){
      throw new NotFoundException(`Imagen con ID ${imageId} no encontrada.`)
    }

    await this.imageRepository.remove(image);

    try{
      this.logger.log(`Archivo ${image.url} marcado para eliminación de la nube.`);
    }catch (error){
      this.logger.error(`Error al eliminar el archivo ${image.url} de la nube,`);
    }

  }
  // MÉTODOS OBSOLETOS
  // Los métodos 'createWithImages', 'addImages', 'removeImage', 'updateWithImages' ya no son válidos.
  // La manipulación de imágenes ahora está
  // ligada a las VARIANTES, y las URLs se proveen en el DTO anidado, borrarlos o reescribirlos para que acepten un 
  // 'variantId' es necesario.

  async get18RandomByCategoryOptimized(categoriaId: string): Promise<Product[]> {
    if (!categoriaId) return [];

    const idsResult = await this.productRepository
      .createQueryBuilder('p')
      .select('p.id', 'id')
      .where('p.categoryId = :categoriaId', { categoriaId }) // <--- CAMBIO
      .andWhere('p.status = :status', { status: productStatus.PUBLISHED })
      .orderBy('RANDOM()')
      .limit(18)
      .getRawMany<{ id: string }>(); 

    const ids = idsResult.map((r) => r.id).filter(Boolean);
    if (ids.length === 0) return [];

    const productsUnordered = await this.productRepository.find({
      where: { id: In(ids) },
      relations: {
        variants: { images: true }, // Cargar variantes e imágenes
      },
    });

    const map = new Map<string, Product>(); 
    productsUnordered.forEach((p) => map.set(p.id, p));
    return ids.map((id) => map.get(id)).filter(Boolean) as Product[];
  }

  async findSome(): Promise<any[]> {
    const products = await this.productRepository.find({
      where: { status: productStatus.PUBLISHED }, 
      relations: {
        variants: { images: true }, // Cargar lo mínimo necesario
      },
    });

    //Retornamos una vista simplificada
    return products.map((p) => {
      //Tratar de obtener la primera variante y su primera imagen
      const firstVariant = p.variants?.[0];
      const firstImage = firstVariant?.images?.[0];

      return {
        id: p.id,
        title: p.title,
        price: firstVariant?.price ?? null,
        categoryId: p.categoryId,
        status: p.status,
        image: firstImage ?? null,
      };
    });
  }
}