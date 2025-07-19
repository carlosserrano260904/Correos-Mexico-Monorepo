import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oficina } from './entities/oficina.entity';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private oficinaRepo: Repository<Oficina>,
  ) {}

  async create(dto: CreateOficinaDto) {
    if (dto.clave_oficina_postal !== 0) {
      const existe = await this.oficinaRepo.findOneBy({ clave_oficina_postal: dto.clave_oficina_postal });
      if (existe) {
        throw new BadRequestException(`Ya existe una oficina con la clave ${dto.clave_oficina_postal}`);
      }
    }

    const nuevaOficina = this.oficinaRepo.create(dto);
    return this.oficinaRepo.save(nuevaOficina);
  }
  
  active() {
    return this.oficinaRepo.find({
      where: { activo: true },
    });
  }

  inactive() {
    return this.oficinaRepo.find({
      where: { activo: false },
    });
  }

  findAll() {
    return this.oficinaRepo.find();
  }

  findClave( clave_oficina_postal: number) {
    return this.oficinaRepo.findOneBy({ 
      clave_oficina_postal: clave_oficina_postal,
      activo: true,
    });
  }

  async findOne(id: number) {
    const oficina = await this.oficinaRepo.findOneBy({ id_oficina: id });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');
    return oficina;
  }

  findClaveUnicaZona( clave_oficina_postal: number) {
    return this.oficinaRepo.find({
      where: { clave_oficina_postal: clave_oficina_postal },
      select: ['clave_unica_zona'],
    });
  }

  async update(id: number, data: UpdateOficinaDto) {
    const oficina = await this.findOne(id);
    this.oficinaRepo.merge(oficina, data);
    return this.oficinaRepo.save(oficina);
  }

  async deactivate(id: number) {
    await this.oficinaRepo.update(id, { activo: false });
    return { message: 'Oficina desactivada correctamente' };
  }

  async activate(id: number) {
    await this.oficinaRepo.update(id, { activo: true });
    return { message: 'Oficina activada correctamente' };
  }
}
