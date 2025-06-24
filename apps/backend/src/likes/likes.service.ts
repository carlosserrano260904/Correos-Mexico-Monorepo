// src/likes/likes.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Like } from './entities/like.entity';
import { User } from '../usuarios/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private readonly likeRepo: Repository<Like>,
    @InjectRepository(User) private readonly usuarioRepo: Repository<User>,
    @InjectRepository(Product) private readonly productoRepo: Repository<Product>,
  ) {}

  async likeProduct(usuarioId: number, productoId: number): Promise<Like> {
    const usuario = await this.usuarioRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const producto = await this.productoRepo.findOne({ where: { id: productoId } });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const existingLike = await this.likeRepo.findOne({
      where: {
        usuario: { id: usuarioId },
        producto: { id: productoId },
      },
    });

    if (existingLike) {
      throw new ConflictException('El usuario ya ha dado like a este producto');
    }

    const like = this.likeRepo.create({ usuario, producto });
    return this.likeRepo.save(like);
  }

  async unlikeProduct(usuarioId: number, productoId: number): Promise<Like> {
    const like = await this.likeRepo.findOne({
      where: {
        usuario: { id: usuarioId },
        producto: { id: productoId },
      },
    });

    if (!like) {
      throw new NotFoundException('Like no encontrado');
    }

    return this.likeRepo.remove(like);
  }

  async getAllLikes(): Promise<Like[]> {
    return this.likeRepo.find({
      relations: ['usuario', 'producto'],
    });
  }

  async getLikesByUsuario(usuarioId: number): Promise<Like[]> {
    return this.likeRepo.find({
      where: { usuario: { id: usuarioId } },
      relations: ['producto'],
    });
  }

  async getLikesByProducto(productoId: number): Promise<Like[]> {
    return this.likeRepo.find({
      where: { producto: { id: productoId } },
      relations: ['usuario'],
    });
  }
}

