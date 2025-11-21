import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido, PedidoProducto } from './entities/pedido.entity';
import { Product } from '../products/entities/product.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Misdireccione } from '../misdirecciones/entities/misdireccione.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoProducto)
    private readonly pedidoProductoRepository: Repository<PedidoProducto>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) { }

  async create(createPedidoDto: CreatePedidoDto) {
    await this.pedidoRepository.manager.transaction(async (manager) => {
      const pedido = new Pedido();

      const profile = await manager.findOne(Profile, {
        where: { id: createPedidoDto.profileId },
      });
      if (!profile) {
        throw new NotFoundException(
          `El perfil con ID ${createPedidoDto.profileId} no existe`,
        );
      }

      pedido.profile = profile;

      const direccion = await manager.findOne(Misdireccione, {
        where: { id: createPedidoDto.direccionId },
      });
      if (!direccion) {
        throw new NotFoundException(
          `La dirección con ID ${createPedidoDto.direccionId} no existe`,
        );
      }

      pedido.direccion = direccion;

      // Asignar los nuevos campos del DTO
      pedido.estatus_pago = createPedidoDto.estatus_pago ?? '';
      pedido.calle = createPedidoDto.calle ?? '';
      pedido.numero_int = createPedidoDto.numero_int ?? '';
      pedido.numero_exterior = createPedidoDto.numero_exterior ?? '';
      pedido.cp = createPedidoDto.cp ?? '';
      pedido.ciudad = createPedidoDto.ciudad ?? '';
      pedido.nombre = createPedidoDto.nombre ?? '';
      pedido.last4 = createPedidoDto.last4 ?? '';
      pedido.brand = createPedidoDto.brand ?? '';

      let total = 0;
      const detalles: PedidoProducto[] = [];

      for (const item of createPedidoDto.productos) {
        const producto = await manager.findOne(Product, {
          where: { id: item.producto_id },
        });
        if (!producto) {
          throw new NotFoundException(
            `El producto con ID ${item.producto_id} no existe`,
          );
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        const detalle = new PedidoProducto();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.pedido = pedido;

        detalles.push(detalle);
      }

      pedido.total = total;
      pedido.status = createPedidoDto.status;

      await manager.save(pedido);

      for (const detalle of detalles) {
        await manager.save(detalle);
      }
    });

    return { message: 'Pedido creado correctamente' };
  }

  async findAll() {
  return this.pedidoRepository.find({
    relations: ['productos', 'productos.producto', 'productos.producto.images', 'direccion'],
    order: { fecha: 'DESC' },
  });
}

  async findByUser(profileId: number) {
  return this.pedidoRepository.find({
    where: { profile: { id: profileId } },
    relations: ['productos', 'productos.producto', 'productos.producto.images', 'direccion'],
    order: { fecha: 'DESC' },
  });
}

  async findOne(id: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['productos', 'productos.producto', 'productos.producto.images', 'direccion'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  //async update(id: number, updatePedidoDto: UpdatePedidoDto) {
  //  const pedido = await this.pedidoRepository.findOneBy({ id });
  //  if (!pedido) {
  //    throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
  //  }

  //  pedido.status = updatePedidoDto.status;
  //  return await this.pedidoRepository.save(pedido);
  //}

  async remove(id: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    await this.pedidoProductoRepository.remove(pedido.productos);
    await this.pedidoRepository.remove(pedido);

    return { message: 'Pedido eliminado correctamente' };
  }
}
