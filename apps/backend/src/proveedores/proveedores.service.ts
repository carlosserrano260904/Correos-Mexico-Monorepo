import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './proveedor.entity';

@Injectable()
export class ProveedoresService {
    constructor(
        @InjectRepository(Proveedor)
        private readonly repo: Repository<Proveedor>,
    ) { }

    create(data: Partial<Proveedor>) {
        const proveedor = this.repo.create(data);
        return this.repo.save(proveedor);
    }

    findBySub(sub: string) {
        return this.repo.findOne({ where: { sub } });
    }
}