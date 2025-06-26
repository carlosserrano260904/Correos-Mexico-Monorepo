import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transporte } from './entities/transporte.entity';

@Injectable()
export class TransportesService {
  constructor(
    @InjectRepository(Transporte)
    private readonly transporteRepo: Repository<Transporte>,
  ) { }

  findAll() {
    return this.transporteRepo.find();
  }

  async findOne(id: string): Promise<Transporte | null> {
    return this.transporteRepo.findOne({ where: { id } });
  }

  create(data: Partial<Transporte>) {
    const nuevo = this.transporteRepo.create(data);
    return this.transporteRepo.save(nuevo);
  }

  async update(id: string, data: Partial<Transporte>): Promise<Transporte | null> {
    await this.transporteRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.transporteRepo.delete(id);
  }
}
