// products.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddImagesDto } from './dto/add-images.dto';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Crear producto + imágenes
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Crear producto con imágenes',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Tenis Runner' },
        descripcion: { type: 'string', example: 'Tenis deportivos para correr' },
        precio: { type: 'number', example: 1299.9 },
        categoria: { type: 'string', example: 'Calzado', nullable: true },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' }, // múltiples archivos
        },
      },
      required: ['nombre', 'descripcion', 'precio'],
    },
  })
  @ApiCreatedResponse({ description: 'Producto creado', type: Product })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.createWithImages(dto, files);
  }

  // Agregar imágenes a un producto existente
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
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Imágenes agregadas' })
  addImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() _dto: AddImagesDto, // Solo para documentar "ordenes" en Swagger
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const ordenes = (_dto as any)?.ordenes;
    return this.productsService.addImages(id, files, ordenes);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de productos', type: [Product] })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Detalle de producto', type: Product })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Producto actualizado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Producto eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
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
