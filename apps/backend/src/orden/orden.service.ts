import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdenDetalleDto } from './dto/orden-detalle.dto';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class OrdenService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async obtenerDetalleOrden(id: number): Promise<OrdenDetalleDto> {
    const transaction = await this.transactionRepo.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!transaction) {
      throw new NotFoundException(`No se encontró la transacción con id ${id}`);
    }

    const profile = transaction.profile;

    const rawProductos = await this.dataSource
      .getRepository('transaction_contents')
      .createQueryBuilder('tc')
      .leftJoinAndSelect(Product, 'product', 'product.id = tc.productoId')
      .select([
        'product.nombre AS nombre',
        'tc.precio AS precio',
        'tc.cantidad AS cantidad',
      ])
      .where('tc.transactionId = :id', { id })
      .getRawMany();

    const productos = rawProductos.map((p) => ({
      nombre: p.nombre,
      precio: Number(p.precio),
      cantidad: Number(p.cantidad),
    }));

    return {
      id: transaction.id,
      total: transaction.total.toString(),
      fecha: transaction.diaTransaccion,
      usuario: {
        nombre: profile.nombre,
      },
      direccion: {
        estado: profile.estado,
        ciudad: profile.ciudad,
        codigoPostal: profile.codigoPostal,
        colonia: profile.fraccionamiento,
      },
      productos,
    };
  }
}
