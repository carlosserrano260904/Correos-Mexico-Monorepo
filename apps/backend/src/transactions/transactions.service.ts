import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Profile } from '../profile/entities/profile.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = new Transaction();
        const profile = await transactionEntityManager.findOne(Profile, {
          where: { id: createTransactionDto.profileId },
        });
        if (!profile) {
          throw new NotFoundException(
            `El perfil con el ID: ${createTransactionDto.profileId} no existe`,
          );
        }
        transaction.profile = profile;

        const total = createTransactionDto.contenidos.reduce(
          (sum, item) => sum + item.cantidad * item.precio,
          0,
        );
        transaction.total = total;

        await transactionEntityManager.save(transaction);

        for (const contentItem of createTransactionDto.contenidos) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: contentItem.productId,
          });
          if (!product) {
            throw new NotFoundException(
              `El producto con el ID: ${contentItem.productId} no existe`,
            );
          }
          await transactionEntityManager.save(product);

          const transactionContent = new TransactionContents();
          transactionContent.precio = contentItem.precio;
          transactionContent.cantidad = contentItem.cantidad;
          transactionContent.producto = product;
          transactionContent.transaction = transaction;
          await transactionEntityManager.save(transactionContent);
        }
      },
    );

    return { message: 'Venta almacenada correctamente' };
  }

  // Devuelve todas las transacciones (con detalles)
  async findAll() {
    return this.transactionRepository.find({
      relations: ['contenidos', 'contenidos.producto'],
      order: { diaTransaccion: 'DESC' },
    });
  }

  // Nuevo método para todas las compras de un usuario
  async findByProfile(profileId: number) {
    return this.transactionRepository.find({
      where: { profileId },
      relations: ['contenidos', 'contenidos.producto'],
      order: { diaTransaccion: 'DESC' },
    });
  }

  // Obtener una única transacción por su ID
  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['contenidos', 'contenidos.producto'],
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transacción con ID: ${id} no encontrada`,
      );
    }
    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
} 