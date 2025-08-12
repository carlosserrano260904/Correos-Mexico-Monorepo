import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMisdireccioneDto } from './dto/create-misdireccione.dto';
import { UpdateMisdireccioneDto } from './dto/update-misdireccione.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Misdireccione } from './entities/misdireccione.entity';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class MisdireccionesService {
  connection: any;
   constructor(
    @InjectRepository(Misdireccione)
    private readonly misdireccionesRepository: Repository<Misdireccione>,
  ) {}

async obtenerPorUsuario(usuarioId: number): Promise<Misdireccione[]> {
  return this.misdireccionesRepository.find({
    where: { usuario: { id: usuarioId } },
    relations: ['usuario'],
  });
}

async findOne(id: number): Promise<Misdireccione> {
  const direccion = await this.misdireccionesRepository.findOne({ where: { id } });

  if (!direccion) {
    throw new NotFoundException(`Dirección con id ${id} no encontrada`);
  }

  return direccion;
}

async create(createDto: CreateMisdireccioneDto): Promise<Misdireccione> {
  const direccion = this.misdireccionesRepository.create({
    ...createDto,
    usuario: { id: createDto.usuarioId }, 
  });

  return this.misdireccionesRepository.save(direccion);
}



  findAll() {
    return `This action returns all misdirecciones`;
  }


  async update(id: number, dto: UpdateMisdireccioneDto): Promise<Misdireccione> {
  const direccion = await this.misdireccionesRepository.findOne({ where: { id } });
  if (!direccion) {
    throw new NotFoundException(`Dirección con id ${id} no encontrada`);
  }

  Object.assign(direccion, dto);
  return this.misdireccionesRepository.save(direccion);
}

  async remove(id: number): Promise<void> {
  const direccion = await this.misdireccionesRepository.findOne({ where: { id } });
  if (!direccion) {
    throw new NotFoundException(`Dirección con id ${id} no encontrada`);
  }
  await this.misdireccionesRepository.remove(direccion);
}

}
