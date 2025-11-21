import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Product } from '../products/entities/product.entity';
import { Carrito } from '../carrito/entities/carrito.entity';

@Injectable()
export class FavoritosService {
  constructor(
    @InjectRepository(Favorito)
    private favoritoRepo: Repository<Favorito>,

    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Carrito)
    private carritoRepo: Repository<Carrito>,
  ) {}

  async findByUsuario(profileId: number): Promise<Favorito[]> {
    const favoritos = await this.favoritoRepo.find({
      where: { usuario: { id: profileId } },
      relations: ['producto','producto.images'],
    });

    if (!favoritos.length) {
      throw new NotFoundException('Usuario no tiene favoritos');
    }

    return favoritos;
  }

  async addFavorito(profileId: number, productId: number) {
    const usuario = await this.profileRepo.findOneBy({ id: profileId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${profileId} no existe`);
    }

    const producto = await this.productRepo.findOneBy({ id: productId });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${productId} no existe`);
    }

    const yaExiste = await this.favoritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        producto: { id: productId },
      },
      relations: ['usuario', 'producto'], 
    });

    if (yaExiste) {
      throw new ConflictException('Ya está en favoritos');
    }

    const favorito = this.favoritoRepo.create({ usuario, producto });
    return this.favoritoRepo.save(favorito);
  }

  async removeFavorito(id: number) {
    const favorito = await this.favoritoRepo.findOneBy({ id });
    if (!favorito) {
      throw new NotFoundException('Favorito no encontrado');
    }
    await this.favoritoRepo.remove(favorito);
    return { message: 'Favorito eliminado correctamente' };
  }

  async addToCarritoDesdeFavorito(profileId: number, productId: number) {
    const usuario = await this.profileRepo.findOneBy({ id: profileId });
    const producto = await this.productRepo.findOneBy({ id: productId });

    if (!usuario || !producto) {
      throw new NotFoundException('Usuario o producto no existe');
    }

    const existente = await this.carritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        producto: { id: productId },
      },
      relations: ['usuario', 'producto'],
    });

    if (existente) {
      existente.cantidad += 1;
      return this.carritoRepo.save(existente);
    }

    const item = this.carritoRepo.create({
      usuario,
      producto,
      cantidad: 1,
      precio_unitario: producto.precio,
      activo: true,
    });

    return this.carritoRepo.save(item);
  }
}
