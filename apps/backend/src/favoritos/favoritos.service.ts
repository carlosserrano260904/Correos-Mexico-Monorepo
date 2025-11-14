import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
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
      // CORRECCIÓN: 'producto.images' ya no existe directo.
      // Cargamos variantes e imagenes de variantes para mostrar algo.
      relations: ['producto', 'producto.variants', 'producto.variants.images'],
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

    // CORRECCIÓN: Convertir ID a String
    const producto = await this.productRepo.findOneBy({
      id: String(productId),
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${productId} no existe`);
    }

    const yaExiste = await this.favoritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        // CORRECCIÓN: Convertir ID a String
        producto: { id: String(productId) },
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

    // CORRECCIÓN: Cargamos las variantes para poder meter una al carrito
    const producto = await this.productRepo.findOne({
      where: { id: String(productId) }, // ID a String
      relations: ['variants'],
    });

    if (!usuario || !producto) {
      throw new NotFoundException('Usuario o producto no existe');
    }

    // --- LÓGICA DE ADAPTACIÓN ---
    // El carrito necesita una VARIANTE, pero favoritos tiene PRODUCTO.
    // Tomamos la primera variante disponible.
    const variant = producto.variants?.[0];

    if (!variant) {
      throw new BadRequestException(
        'Este producto no tiene variantes disponibles para agregar al carrito.',
      );
    }

    // Buscamos si esa VARIANTE ya está en el carrito
    const existente = await this.carritoRepo.findOne({
      where: {
        usuario: { id: profileId },
        productVariant: { id: variant.id }, // Usamos la variante
      },
      relations: ['usuario', 'productVariant'],
    });

    if (existente) {
      existente.cantidad += 1;
      return this.carritoRepo.save(existente);
    }

    // Creamos el item usando la VARIANTE
    const item = this.carritoRepo.create({
      usuario,
      productVariant: variant, // <--- Conectamos la variante
      productVariantId: variant.id,
      cantidad: 1,
      precio_unitario: variant.price, // <--- Precio viene de la variante
      activo: true,
    });

    return this.carritoRepo.save(item);
  }
}