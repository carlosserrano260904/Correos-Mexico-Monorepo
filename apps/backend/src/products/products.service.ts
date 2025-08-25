// products.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductImage } from "./entities/product-image.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UploadImageService } from "src/upload-image/upload-image.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly uploadImageService: UploadImageService
  ) {}

  // Crear producto + subir imágenes (multipart/form-data)
  async createWithImages(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[]
  ): Promise<Product> {
    // Generate default values for missing fields
    const productData = {
      ...createProductDto,
      // Generate slug from name if not provided
      slug: createProductDto.nombre
        ? createProductDto.nombre
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : null,
      // Generate SKU if not provided
      sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // Set default values for other fields
      color: 'Sin especificar',
      marca: 'Sin marca',
      vendedor: 'Administrador',
    };

    console.log('🏗️ Creating product with data:', productData);
    
    const product = this.productRepository.create(productData);
    await this.productRepository.save(product);

    if (files?.length) {
      // sube cada archivo a S3 y guarda su fila en product_images
      const uploads = await Promise.all(
        files.map(async (file, idx) => {
          const url = await this.uploadImageService.uploadFileImage(file);
          const img = this.productImageRepository.create({
            url,
            orden: idx,
            productId: product.id,
          });
          return this.productImageRepository.save(img);
        })
      );
      product.images = uploads;
    } else {
      product.images = [];
    }

    return product;
  }

  async addImages(
    productId: number,
    files: Express.Multer.File[],
    ordenes?: number[]
  ) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException("Producto no encontrado");

    const imgs = await Promise.all(
      files.map(async (file, i) => {
        const url = await this.uploadImageService.uploadFileImage(file);
        return this.productImageRepository.save(
          this.productImageRepository.create({
            url,
            orden: ordenes?.[i] ?? 0,
            productId: productId,
          })
        );
      })
    );

    return imgs;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: { images: true,reviews: { profile: true, images: true } }
    });
  }

  async findOne(id: number): Promise<Product> {
    const producto = await this.productRepository.findOne({
      where: { id },
      relations: { images: true,reviews: { profile: true, images: true } }
    });
    if (!producto) throw new NotFoundException("Producto no encontrado");
    return producto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductDto);
    await this.productRepository.save(producto);
    return "Producto actualizado correctamente";
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    await this.productRepository.remove(producto);
    return "Producto eliminado correctamente";
  }

  async removeImage(imageId: number, productId: number) {
    const img = await this.productImageRepository.findOne({ where: { id: imageId, productId } });
    if (!img) throw new NotFoundException("Imagen no encontrada");
    await this.productImageRepository.remove(img);
    return "Imagen eliminada";
  }

  async updateWithImages(
  id: number,
  dto: UpdateProductDto,
  files?: Express.Multer.File[]
) {
  const producto = await this.findOne(id);

  // convierte precio si viene como string (multipart)
  if (dto?.precio != null) {
    (dto as any).precio = Number(dto.precio);
  }

  Object.assign(producto, dto);
  await this.productRepository.save(producto);

  if (files?.length) {
    const uploads = await Promise.all(
      files.map(async (file, idx) => {
        const url = await this.uploadImageService.uploadFileImage(file);
        return this.productImageRepository.save(
          this.productImageRepository.create({
            url,
            orden: idx,
            productId: producto.id,
          })
        );
      })
    );
    producto.images = [...(producto.images ?? []), ...uploads];
  }

  return producto; // devuelve el objeto guardado para verificar cambios
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
}
