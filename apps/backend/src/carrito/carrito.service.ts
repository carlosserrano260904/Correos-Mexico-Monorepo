// apps/backend/src/carrito/carrito.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProductVariant } from 'src/products/entities/productVariant.entity';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepo: Repository<Carrito>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,

    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>
  ) {}
  
  async obtenerCarrito(profileId: number) {
    const productos = await this.carritoRepo.find({
      where: { usuario: { id: profileId }, activo: true },
      relations: ['productVariant','productVariant.images','productvariant.product'],
    });

    if (!productos.length) {
      throw new NotFoundException('El usuario no tiene productos en el carrito');
    }

    return productos;
  }

  async agregarVariante(profileId: number, productVariantId: string, cantidad: number) {
    const usuario = await this.profileRepo.findOneBy({ id: profileId });
    if(!usuario){
      throw new NotFoundException('Usuario no encontrado');
    }
    const variante = await this.productVariantRepo.findOneBy({ id: productVariantId });

    if (!variante) {
      throw new NotFoundException('Variante de producto no encontrada');
    }

    if(variante.inventoryQuantity < cantidad){
      throw new BadRequestException('No hay suficiente stock para esta variante.')
    }

    const existente = await this.carritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        productVariant: { id: productVariantId },
      },
    });

    if (existente) {
      const nuevaCantidadTotal = existente.cantidad + cantidad;
      if(variante.inventoryQuantity < nuevaCantidadTotal){
        throw new BadRequestException('No hay suficiente stock para la cantidad total.');
      }
      existente.cantidad = nuevaCantidadTotal;
      return this.carritoRepo.save(existente);
    }

    const item = this.carritoRepo.create({
      usuario,
      productVariant: variante,
      productVariantId: variante.id,
      cantidad,
      precio_unitario: variante.price,
      activo: true,
    });

    return this.carritoRepo.save(item);
  }

  async editarCantidad(id: number, nuevaCantidad: number) {
    if (nuevaCantidad < 1) {
      throw new BadRequestException('La cantidad mínima debe ser 1');
    }

    const item = await this.carritoRepo.findOne({ where: {id}, relations: ['productVariant']});
    if (!item) {
      throw new NotFoundException('Producto en carrito no encontrado');
    }

    if(item.productVariant.inventoryQuantity <nuevaCantidad ){
      throw new BadRequestException('No hay suficiente stock para la cantidad solicitada');
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

    return { subtotal: parseFloat(subtotal.toFixed(2)) };
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
