// src/transactions/transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsContentsDto } from './dto/transactions-contents.dto';

@ApiTags('Transacciones')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiCreatedResponse({
    description: 'Transacción creada correctamente',
    type: TransactionsContentsDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil o producto no encontrado' })
  @ApiBody({ type: CreateTransactionDto })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiOkResponse({
    description: 'Lista de transacciones',
    type: TransactionsContentsDto,
    isArray: true,
  })
  async findAll() {
    return await this.transactionsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener transacciones de un usuario por su ID' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'ID del perfil (usuario)',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Transacciones del usuario',
    type: TransactionsContentsDto,
    isArray: true,
  })
  async findByUser(@Param('userId') userId: string) {
    return await this.transactionsService.findByProfile(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Transacción encontrada',
    type: TransactionsContentsDto,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async findOne(@Param('id') id: string) {
    const tx = await this.transactionsService.findOne(+id);
    if (!tx) throw new NotFoundException('Transacción no encontrada');
    return tx;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una transacción por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Transacción actualizada',
    type: TransactionsContentsDto,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  @ApiBody({ type: UpdateTransactionDto })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción por ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la transacción',
    example: 1,
  })
  @ApiNoContentResponse({ description: 'Transacción eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async remove(@Param('id') id: string) {
    await this.transactionsService.remove(+id);
  }
}
