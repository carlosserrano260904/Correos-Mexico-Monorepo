// apps/backend/src/carrito/carrito.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepo: Repository<Carrito>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}
  
  async obtenerCarrito(profileId: number) {
    const productos = await this.carritoRepo.find({
      where: { usuario: { id: profileId }, activo: true },
      relations: ['producto','producto.images'],
    });

    if (!productos.length) {
      throw new NotFoundException('El usuario no tiene productos en el carrito');
    }

    return productos;
  }

  async agregarProducto(profileId: number, productId: number, cantidad: number) {
    const usuario = await this.profileRepo.findOneBy({ id: profileId });
    const producto = await this.productRepo.findOneBy({ id: productId });

    if (!usuario || !producto) {
      throw new NotFoundException('Usuario o producto no encontrado');
    }

    const existente = await this.carritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        producto: { id: productId },
      },
    });

    if (existente) {
      existente.cantidad += cantidad;
      return this.carritoRepo.save(existente);
    }

    const item = this.carritoRepo.create({
      usuario,
      producto,
      cantidad,
      precio_unitario: producto.precio,
      activo: true,
    });

    return this.carritoRepo.save(item);
  }

  async editarCantidad(id: number, nuevaCantidad: number) {
    if (nuevaCantidad < 1) {
      throw new BadRequestException('La cantidad mínima debe ser 1');
    }

    const item = await this.carritoRepo.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Producto en carrito no encontrado');
    }

    item.cantidad = nuevaCantidad;
    return this.carritoRepo.save(item);
  }

  async eliminarDelCarrito(id: number) {
    const item = await this.carritoRepo.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Producto en carrito no encontrado');
    }

    return this.carritoRepo.remove(item);
  }

  async subtotal(profileId: number) {
    const productos = await this.carritoRepo.find({
      where: { usuario: { id: profileId }, activo: true },
    });

    const subtotal = productos.reduce((acc, item) => {
      return acc + item.cantidad * Number(item.precio_unitario);
    }, 0);

    return { subtotal };
  }

  async procederAlPago(profileId: number) {
    const productos = await this.obtenerCarrito(profileId);
    if (!productos.length) throw new NotFoundException('El carrito está vacío');

    return {
      message: 'Redirigiendo a detalles de compra...',
      productos,
    };
  }
}
