// products.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In, DataSource } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "./entities/product-image.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UploadImageService } from '../upload-image/upload-image.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly uploadImageService: UploadImageService,
    private readonly dataSource: DataSource,
  ) { }

  // Crear producto + subir imágenes (multipart/form-data)
  async createWithImages(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[]
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Con un DTO y un ValidationPipe bien configurados, las conversiones de tipo son automáticas.
      // El código del servicio se vuelve más limpio y se enfoca en la lógica de negocio.
      const { inventario, ...productData } = createProductDto;
      const productToCreate = {
        ...productData,
      };
      const product = this.productRepository.create(productToCreate);
      await queryRunner.manager.save(product);

      if (files?.length) {
        const uploads = await Promise.all(
          files.map(async (file, idx) => {
            const url = await this.uploadImageService.uploadFileImage(file);
            const img = this.productImageRepository.create({
              url,
              orden: idx,
              productId: product.id,
            });
            return queryRunner.manager.save(img);
          }),
        );
        product.images = uploads;
      } else {
        product.images = [];
      }

      await queryRunner.commitTransaction();
      return product;
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addImages(
    productId: number,
    files: Express.Multer.File[],
    ordenes?: number[]
  ): Promise<ProductImage[]> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    const maxOrderResult = await this.productImageRepository
      .createQueryBuilder("img")
      .select("MAX(img.orden)", "max_orden")
      .where("img.productId = :productId", { productId })
      .getRawOne();
    const startOrder = (maxOrderResult?.max_orden ?? -1) + 1;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const imgs = await Promise.all(
        files.map(async (file, i) => {
          const url = await this.uploadImageService.uploadFileImage(file);
          const img = this.productImageRepository.create({
            url,
            orden: ordenes?.[i] ?? startOrder + i,
            productId: productId,
          });
          return queryRunner.manager.save(img);
        }),
      );
      await queryRunner.commitTransaction();
      return imgs;
    } catch (error) {
      this.logger.error(
        `Error al agregar imágenes al producto ${productId}: ${error.message}`,
        error.stack,
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: { images: true, reviews: { profile: true, images: true } },
    });
  }


  async findAllActive(): Promise<Product[]> {
    return this.productRepository.find({
      where: { estado: true },
      relations: { images: true, reviews: { profile: true, images: true } },
    });
  }

  async findOne(id: number): Promise<Product> {
    const producto = await this.productRepository.findOne({
      where: { id },
      relations: { images: true, reviews: { profile: true, images: true } },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const producto = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.productRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }

  async softRemove(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Cambiamos el estado en lugar de borrarlo (soft delete)
    product.estado = false;
    return this.productRepository.save(product);
  }

  async removeImage(imageId: number, productId: number): Promise<void> {
    // Nota: Esto no elimina el archivo de imagen del almacenamiento (ej. S3).
    // Se necesitaría una lógica adicional para eso.
    const result = await this.productImageRepository.delete({
      id: imageId,
      productId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        "Imagen no encontrada o no pertenece al producto.",
      );
    }
  }

  async updateWithImages(
    id: number,
    dto: UpdateProductDto,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // NOTA: Al usar multipart/form-data, los tipos numéricos pueden llegar como strings.
      // Un ValidationPipe con `transform: true` es un mejor lugar para manejar esta conversión.
      // Al habilitar la transformación en el ValidationPipe global y usar @Type(() => Number) en el DTO,
      // esta conversión manual ya no es necesaria.

      const producto = await queryRunner.manager.preload(Product, {
        id,
        ...dto,
      });

      if (!producto) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      await queryRunner.manager.save(producto);

      if (files?.length) {
        const maxOrderResult = await queryRunner.manager
          .createQueryBuilder(ProductImage, "img")
          .select("MAX(img.orden)", "max_orden")
          .where("img.productId = :productId", { productId: id })
          .getRawOne();
        const startOrder = (maxOrderResult?.max_orden ?? -1) + 1;

        await Promise.all(
          files.map(async (file, idx) => {
            const url = await this.uploadImageService.uploadFileImage(file);
            const img = this.productImageRepository.create({
              url,
              orden: startOrder + idx,
              productId: id,
            });
            return queryRunner.manager.save(img);
          }),
        );
      }

      await queryRunner.commitTransaction();
      // Recargar la entidad para devolverla con todas las relaciones actualizadas
      return this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Error al actualizar el producto ${id}: ${error.message}`,
        error.stack,
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Tu método optimizado, agregando relations para imágenes
  async get18RandomByCategoryOptimized(categoria: string): Promise<Product[]> {
    if (!categoria) return [];

    const idsResult = await this.productRepository
      .createQueryBuilder("p")
      .select("p.id", "id")
      .where("LOWER(p.categoria) = LOWER(:categoria)", { categoria })
      .orderBy("RANDOM()")
      .limit(18)
      .getRawMany<{ id: number }>();

    const ids = idsResult.map((r) => r.id).filter(Boolean);
    if (ids.length === 0) return [];

    const productsUnordered = await this.productRepository.find({
      where: { id: In(ids) },
      relations: { images: true },
    });

    const map = new Map<number, Product>();
    productsUnordered.forEach((p) => map.set(p.id, p));
    return ids.map((id) => map.get(id)).filter(Boolean) as Product[];
  }

  async findSome(): Promise<any[]> {
    const products = await this.productRepository.find({
      where: { estado: true }, // Filtrar solo productos activos
      relations: { images: true },
    });

    // Retornamos solo la primera imagen de cada producto
    return products.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      categoria: p.categoria,
      estado: p.estado,
      image: p.images?.length ? p.images[0] : null,
    }));
  }
}
