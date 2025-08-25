// apps/backend/src/carrito/carrito.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Product } from 'src/products/entities/product.entity';

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
    console.log('🛒 DEBUG CARRITO - obtenerCarrito para profileId:', profileId);
    
    // Verify profile exists
    const profile = await this.profileRepo.findOneBy({ id: profileId });
    if (!profile) {
      console.log('❌ DEBUG CARRITO - Perfil no encontrado:', profileId);
      throw new NotFoundException('Perfil no encontrado');
    }

    const productos = await this.carritoRepo.find({
      where: { usuario: { id: profileId }, activo: true },
      relations: ['producto', 'producto.images'],
    });

    console.log('🛒 DEBUG CARRITO - productos encontrados:', productos.length);
    productos.forEach((item, index) => {
      console.log(`🛒 DEBUG CARRITO - item ${index}:`, {
        id: item.id,
        productId: item.producto?.id,
        productName: item.producto?.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        activo: item.activo
      });
    });

    // Return empty array if no products, don't throw error
    const result = {
      items: productos,
      subtotal: productos.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0),
      total: productos.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0),
    };
    
    console.log('🛒 DEBUG CARRITO - resultado final:', { itemsCount: result.items.length, subtotal: result.subtotal, total: result.total });
    return result;
  }

  async agregarProducto(profileId: number, productId: number, cantidad: number) {
    console.log('🛒 DEBUG CARRITO - agregarProducto:', { profileId, productId, cantidad });
    
    const usuario = await this.profileRepo.findOneBy({ id: profileId });
    const producto = await this.productRepo.findOneBy({ id: productId });

    console.log('🛒 DEBUG CARRITO - usuario encontrado:', !!usuario);
    console.log('🛒 DEBUG CARRITO - producto encontrado:', !!producto);

    if (!usuario || !producto) {
      console.log('❌ DEBUG CARRITO - Usuario o producto no encontrado');
      throw new NotFoundException('Usuario o producto no encontrado');
    }

    const existente = await this.carritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        producto: { id: productId },
      },
    });

    console.log('🛒 DEBUG CARRITO - item existente:', !!existente);

    if (existente) {
      console.log('🛒 DEBUG CARRITO - actualizando cantidad existente:', existente.cantidad, '->', existente.cantidad + cantidad);
      existente.cantidad += cantidad;
      const saved = await this.carritoRepo.save(existente);
      console.log('✅ DEBUG CARRITO - item actualizado guardado:', saved.id);
      return saved;
    }

    const item = this.carritoRepo.create({
      usuario,
      producto,
      cantidad,
      precio_unitario: producto.precio,
      activo: true,
    });

    console.log('🛒 DEBUG CARRITO - creando nuevo item:', { cantidad, precio_unitario: producto.precio, activo: true });
    const saved = await this.carritoRepo.save(item);
    console.log('✅ DEBUG CARRITO - nuevo item guardado:', saved.id);
    return saved;
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
    if (!productos.items.length) throw new NotFoundException('El carrito está vacío');

    return {
      message: 'Redirigiendo a detalles de compra...',
      productos,
    };
  }
}
