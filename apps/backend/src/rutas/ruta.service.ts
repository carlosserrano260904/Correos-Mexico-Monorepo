import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ruta } from './entities/ruta.entity';

@Injectable()
export class RutaService {
  constructor(
    @InjectRepository(Ruta)
    private readonly rutaRepo: Repository<Ruta>,
  ) {}

  findAll() {
    return this.rutaRepo.find();
  }

  async findOne(id: string): Promise<Ruta> {
    const ruta = await this.rutaRepo.findOne({ where: { id } });
    if (!ruta) {
      throw new NotFoundException(`Ruta con ID ${id} no encontrada`);
    }
    return ruta;
  }

  create(data: Partial<Ruta>) {
    const nuevaRuta = this.rutaRepo.create(data);
    return this.rutaRepo.save(nuevaRuta);
  }

  async update(id: string, data: Partial<Ruta>): Promise<Ruta> {
    await this.rutaRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.rutaRepo.delete(id);
  }
}
