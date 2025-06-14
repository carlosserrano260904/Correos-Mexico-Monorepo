import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({summary:'Creacion de un nuevo producto'})
  @ApiResponse({status:201,description:'Producto creado correctamente'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({summary:'Lista de todos los productos'})
  @ApiOkResponse({
    description:'Arreglo de todos los productos',
    type:CreateProductDto,
    isArray:true
  })
  @ApiInternalServerErrorResponse({description:'Error interno del servidor'})
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary:'Obtener un producto por su perfil'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del producto',
    example:2
  })
  @ApiOkResponse({
    description:'Producto encontrado',
    type:CreateProductDto
  })
  @ApiResponse({status:200,description:'Producto encontrado'})
  @ApiResponse({status:404,description:'Producto no encontrado'})
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary:'Actualizar un producto por su ID'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del producto',
    example:2
  })
  @ApiResponse({
    status:200,
    description:'Producto actualizado correctamente',
    type:UpdateProductDto
  })
  @ApiResponse({status:404,description:'Producto no encontrado'})
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
   @ApiOperation({summary:'Eliminar un producto por su ID'})
  @ApiParam({
    name:'id',
    type:Number,
    description:'Identificador unico del producto',
    example:2
  })
  @ApiResponse({
    status:204,
    description:'Producto eliminado correctamente'
  })
  @ApiResponse({status:404,description:'Producto no encontrado'})
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
