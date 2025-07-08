import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { ConductorResponseDto } from './dto/conductor-response.dto';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

@Injectable()
export class ConductoresService {
  constructor(
    @InjectRepository(Conductor)
    private conductorRepository: Repository<Conductor>,
  ) {}

  private mapToResponseDto(conductor: Conductor): ConductorResponseDto {
    return {
      nombreCompleto: conductor.nombreCompleto,
      CURP: conductor.curp,
      RFC: conductor.rfc,
      licencia: conductor.licencia,
      telefono: conductor.telefono,
      correo: conductor.correo,
      sucursal: conductor.oficina?.clave_cuo,
    };
  }

  async findAllDisponibles(): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      where: {
        disponibilidad: true,
        licenciaVigente: true,
      },
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findBySucursal(claveOficina: string): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      where: { oficina: { clave_cuo: claveOficina } },
      relations: ['oficina'],
      order: { disponibilidad: 'DESC' },
    });

    return conductores.map(this.mapToResponseDto);
  }


  async create(createConductorDto: CreateConductorDto): Promise<Conductor> {
    const conductor = this.conductorRepository.create({
      ...createConductorDto,
      fechaAlta: new Date(),
      disponibilidad: true, // Por defecto disponible al crear
    });
    return this.conductorRepository.save(conductor);
  }

  async updateDisponibilidad(
    id: number,
    updateDisponibilidadDto: UpdateDisponibilidadDto,
  ): Promise<Conductor> {
    const conductor = await this.conductorRepository.findOne({ where: { id } });
    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    conductor.disponibilidad = updateDisponibilidadDto.disponibilidad;
    return this.conductorRepository.save(conductor);
  }
}