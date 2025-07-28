import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Oficina } from './entities/oficina.entity';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { AgregarClaveZonaDto } from './dto/agregar-clave-zona.dto';
import { EliminarClaveZonaDto } from './dto/eliminar-clave-zona.dto';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private oficinaRepo: Repository<Oficina>,
  ) {}

  async create(dto: CreateOficinaDto) {
    if (dto.clave_oficina_postal !== null) {
      const existe = await this.oficinaRepo.findOneBy({ clave_oficina_postal: dto.clave_oficina_postal.toString() });
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

  findClave( clave_oficina_postal: string) {
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

  findClaveUnicaZona( clave_oficina_postal: string) {
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

  async agregarClaveZona(cuo: string, dto: AgregarClaveZonaDto) {
    const oficina = await this.oficinaRepo.findOneBy({ clave_cuo: cuo });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');

    if (dto.claveZona === cuo) {
      throw new BadRequestException('No puedes asignar la misma clave CUO como clave de zona');
    }

    const clavesActuales = oficina.clave_unica_zona ? oficina.clave_unica_zona.split(',') : [];

    if (clavesActuales.includes(dto.claveZona)) {
      throw new BadRequestException('La clave ya existe en esta oficina');
    }

    clavesActuales.push(dto.claveZona);
    oficina.clave_unica_zona = clavesActuales.join(',');
    return this.oficinaRepo.save(oficina);
  }


  async eliminarClaveZona(cuo: string, dto: EliminarClaveZonaDto) {
    const oficina = await this.oficinaRepo.findOneBy({ clave_cuo: cuo });
    if (!oficina) throw new NotFoundException('Oficina no encontrada');

    const clavesActuales = oficina.clave_unica_zona ? oficina.clave_unica_zona.split(',') : [];
    const nuevasClaves = clavesActuales.filter(c => c !== dto.claveZona);

    if (clavesActuales.length === nuevasClaves.length) {
      throw new BadRequestException('La clave no existe en esta oficina');
    }

    oficina.clave_unica_zona = nuevasClaves.length > 0 ? nuevasClaves.join(',') : '';
    return this.oficinaRepo.save(oficina);
  }

}
