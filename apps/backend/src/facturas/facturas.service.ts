import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturasRepository: Repository<Factura>,
  ) {}

  findAll(): Promise<Factura[]> {
    return this.facturasRepository.find();
  }
}