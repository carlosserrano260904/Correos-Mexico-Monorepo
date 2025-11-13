// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe, // Importamos ParseUUIDPipe
} from '@nestjs/common';
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

import { Profile } from './../profile/entities/profile.entity';
import { ReviewImage } from './../review/entities/review-image.entity';
import { Review } from './../review/entities/review.entity';
import { CreateProductDto } from './dto/create-product.dto'; // <--- El DTO anidado
import { UpdateProductDto } from './dto/update-product.dto'; // <--- El DTO parcial
import { ProductImage } from './entities/productImage.entity';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { AddImageToVariantDto } from './dto/add-images.dto';
import { ProductVariant } from './entities/productVariant.entity';

@ApiTags('products')
@ApiExtraModels(Product, ProductImage, Review, ReviewImage, Profile, ProductVariant)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Crea un nuevo producto con sus variantes, imágenes y atributos.
   * Espera un JSON anidado, las imágenes deben ser subidas
   * previamente para obtener sus URLs.
   */
  @Post()
  @ApiConsumes('application/json') //Ya no es multipart
  @ApiBody({ type: CreateProductDto }) //Usamos el DTO anidado
  @ApiCreatedResponse({description: 'Producto creado', type: Product })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto); //Llama al nuevo servicio
  }

  /**
   * Obtiene todos los productos activos (status: PUBLISHED).
   */
  @Get('active')
  @ApiOkResponse({ description: 'Lista de productos activos', type: [Product] })
  findAllActive(): Promise<Product[]> {
    return this.productsService.findAllActive();
  }

  /**
   * Obtiene una vista simplificada de los productos.
   */
  @Get('some')
  @ApiOkResponse({description: 'Vista simplificada de productos'})
  findSome(): Promise<any[]> {
    return this.productsService.findSome();
  }

  /**
   * Obtiene todos los productos con sus relaciones.
   */
  @Get()
  @ApiOkResponse({
    description: 'Lista de todos los productos',
    type: [Product],
  })
  findAll() {
    return this.productsService.findAll();
  }

  /**
   * Obtiene un producto por su UUID.
   */
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({
    description: 'Detalle de producto',
    type: Product,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * Actualiza los campos principales de un producto (no sus variantes).
   */
  @Patch(':id')
  @ApiConsumes('application/json')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateProductDto }) // Usamos el DTO parcial
  @ApiOkResponse({ type: Product })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Desactiva un producto (soft delete) cambiando su estado a 'ARCHIVED'.
   */
  @Patch(':id/delete')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ description: 'Producto desactivado correctamente.' })
  async softRemove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.productsService.softRemove(id);
    return { message: 'Producto desactivado' };
  }

  /**
   * Elimina un producto de la base de datos (hard delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  //Actualiza una variante específica (precio, SKU, inventario, etc)
  @Patch('variants/:id')
  @ApiConsumes('application/json')
  @ApiParam({
    name : 'id',
    type: 'string',
    format: 'uuid',
    description: 'El Id de la ProductVariant a actualizar',
  })
  @ApiBody({ type: UpdateProductVariantDto})
  @ApiOkResponse({
    description: 'Variante actualizada',
    type: ProductVariant,
  })
  updateVariant(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateProductVariantDto,
  ){return this.productsService.updateVariant(id,updateDto)};

  //Agrega una o más imágenes (con URLs) a una variante específica
  @Post('variants/:id/images')
  @ApiConsumes('application/json')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'El ID de la ProductVariant a la que se agregarán imágenes',
  })
  @ApiBody({type: AddImageToVariantDto})
  @ApiOkResponse({
    description: 'Imágenes agregadas a la variante',
    type: ProductVariant,
  })
  addImagesToVariant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddImageToVariantDto,
  ){
    return this.productsService.addImagesToVariant(id,dto);
  }

  //Elimina una imagen de producto específica por su ID
  @Delete('images/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'El ID de la ProductImage a eliminar',
  })
  @ApiOkResponse({description: 'Imagen eliminada'})
  deleteImage(@Param('id', ParseUUIDPipe) id: string): Promise<void>{
    return this.productsService.deleteVariantImage(id);
  }

  // --- ENDPOINTS OBSOLETOS ---
  //
  // @Post(':id/images') ...
  // @Delete(':id/images/:imageId') ...
  //
  // Estos endpoints fueron eliminados porque la lógica de imágenes
  // ahora está ligada a las VARIANTES, no al producto.

}