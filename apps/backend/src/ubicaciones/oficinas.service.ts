import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Oficina } from './entities/oficina.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private oficinaRepo: Repository<Oficina>,
  ) {}

  async findAll(): Promise<Oficina[]> {
    return this.oficinaRepo.find();
  }
}
