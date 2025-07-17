import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Oficina } from '../oficinas/entities/oficina.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private oficinaRepo: Repository<Oficina>,
  ) {}

  // oficinas.service.ts
  async findAll(): Promise<any[]> {
    const oficinas = await this.oficinaRepo.find();

    return oficinas.map((o) => ({
      id: o.id_oficina,
      nombre: o.nombre_cuo,
      direccion: o.domicilio,
      telefono: o.telefono,
      coordenadas: {
        latitude: Number(o.latitud),
        longitude: Number(o.longitud),
      },
      // Puedes dejar horario como null si no existe en la BD
      horario_atencion: null,
    }));
  }
}
