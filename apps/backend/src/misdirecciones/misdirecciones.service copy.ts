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

/*
async create(dto: CreateMisdireccioneDto) {
  const usuario = await this.connection.getRepository(Profile).findOne({
    where: { id: dto.usuarioId },
  });

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const direccion = this.misdireccionesRepository.create({
    ...dto,
    usuario,
  });

  return this.misdireccionesRepository.save(direccion);
}*/

 // create(createMisdireccioneDto: CreateMisdireccioneDto) {
   // return 'This action adds a new misdireccione';
  //}



async create(createDto: CreateMisdireccioneDto): Promise<Misdireccione> {
  const direccion = this.misdireccionesRepository.create({
    ...createDto,
    usuario: { id: createDto.usuarioId }, // vincular con el usuario
  });

  return this.misdireccionesRepository.save(direccion);
}



  findAll() {
    return `This action returns all misdirecciones`;
  }

  //findOne(id: number) {
  //  return `This action returns a #${id} misdireccione`;
  //}

  update(id: number, updateMisdireccioneDto: UpdateMisdireccioneDto) {
    return `This action updates a #${id} misdireccione`;
  }

  remove(id: number) {
    return `This action removes a #${id} misdireccione`;
  }
}
