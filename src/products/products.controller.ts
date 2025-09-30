// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,

} from "@nestjs/common";
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Profile } from '../profile/entities/profile.entity';
import { ReviewImage } from '../review/entities/review-image.entity';
import { Review } from '../review/entities/review.entity';
import { AddImagesDto } from './dto/add-images.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@ApiExtraModels(Product, ProductImage, Review, ReviewImage, Profile)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Crear producto con imágenes',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Tenis Runner', description: 'Nombre del producto' },
        descripcion: { type: 'string', example: 'Tenis deportivos para correr', description: 'Descripción del producto' },
        precio: { type: 'number', example: 1299.9, description: 'Precio del producto' },
        categoria: { type: 'string', example: 'Calzado', nullable: true, description: 'Categoría del producto' },
        altura: { type: 'float', example: 120.0, nullable: true, description: 'Altura del producto' },
        ancho: { type: 'float', example: 5.0, nullable: true, description: 'Ancho del producto' },
        largo: { type: 'float', example: 120.0, nullable: true, description: 'Largo del producto' },
        peso: { type: 'float', example: 5.5, nullable: true, description: 'Peso del producto' },
        inventario: { type: 'number', example: 25, description: 'Stock disponible del producto' },
        color: { type: 'string', example: 'Negro', description: 'Color del producto' },
        marca: { type: 'string', example: 'Nike', description: 'Marca del producto' },
        slug: { type: 'string', example: 'tenis-runner-negro', description: 'Slug único del producto' },
        vendedor: { type: 'string', example: 'SportCenter MX', description: 'Nombre del vendedor' },
        estado: { type: 'boolean', example: true, description: 'Estado del producto (activo/inactivo)' },
        vendidos: { type: 'number', example: 0, description: 'Cantidad de productos vendidos' },
        sku: { type: 'string', example: 'SKU-ABC-001', description: 'Código SKU del producto' },
        idPerfil: { type: 'number', example: 1, nullable: true, description: 'ID del perfil del vendedor' },
        images: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Imágenes del producto' },
      },
      required: ['nombre', 'descripcion', 'precio'],
    },
  })
  @ApiCreatedResponse({ description: 'Producto creado', schema: { $ref: getSchemaPath(Product) } })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.createWithImages(dto, files);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number, description: 'ID del producto' })
  @ApiBody({
    description: 'Agregar imágenes a un producto existente',
    schema: {
      type: 'object',
      properties: {
        ordenes: { type: 'array', items: { type: 'number' }, example: [0, 1] },
        images: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @ApiOkResponse({
    description: 'Imágenes agregadas',
    schema: { type: 'array', items: { $ref: getSchemaPath(ProductImage) } }
  })
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() _dto: AddImagesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const ordenes = (_dto as any)?.ordenes;
    return this.productsService.addImages(id, files, ordenes);
  }

  /**
   * Obtiene todos los productos activos (estado: true).
   * @returns Un arreglo de productos activos.
   */
  @Get("active")
  findAllActive(): Promise<Product[]> {
    return this.productsService.findAllActive();
  }

  @Get("some")
  findSome(): Promise<any[]> {
    return this.productsService.findSome();
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de productos',
    schema: { type: 'array', items: { $ref: getSchemaPath(Product) } },
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    description: 'Detalle de producto',
    schema: { $ref: getSchemaPath(Product) },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Subir imagenes a producto existente',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          example: []
        },
      },
    },
  })

  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.productsService.updateWithImages(id, updateProductDto, files);
  }


  @Patch(":id/delete")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Producto desactivado correctamente.', schema: { type: 'object', properties: { message: { type: 'string', example: 'Producto desactivado' } } } })
  async softRemove(@Param("id", ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.productsService.softRemove(id);
    return { message: 'Producto desactivado' };
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }

  @Delete(':id/images/:imageId')
  @ApiParam({ name: 'id', type: Number, description: 'ID del producto' })
  @ApiParam({ name: 'imageId', type: Number, description: 'ID de la imagen' })
  @ApiOkResponse({ description: 'Imagen eliminada' })
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.productsService.removeImage(imageId, id);
  }
}
