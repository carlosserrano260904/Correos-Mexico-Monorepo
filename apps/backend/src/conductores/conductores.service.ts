import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conductor } from './entities/conductor.entity';
import { ConductorResponseDto } from './dto/conductor-response.dto';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { UpdateLicenciaVigenteDto } from './dto/update-licencia-vigente.dto';

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

  async findAll(): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      relations: ['oficina'],
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findAllDisponibles(): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      where: {
        disponibilidad: true,
        licenciaVigente: true,
      },
      relations: ['oficina'],
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findAllNoDisponibles(): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      where: {
        disponibilidad: false,
      },
      relations: ['oficina'],
    });
    return conductores.map(this.mapToResponseDto);
  }

  async findBySucursal(claveUnicaOficina: string): Promise<ConductorResponseDto[]> {
    const conductores = await this.conductorRepository.find({
      where: { oficina: { clave_cuo: claveUnicaOficina } },
      relations: ['oficina'],
      order: { disponibilidad: 'DESC' },
    });

    return conductores.map(this.mapToResponseDto);
  }

  async create(createConductorDto: CreateConductorDto): Promise<Conductor> {
    const conductor = this.conductorRepository.create({
      ...createConductorDto,
      fechaAlta: new Date(),
      disponibilidad: true,
    });
    return this.conductorRepository.save(conductor);
  }

  async updateDisponibilidad(
    curp: string,
    updateDisponibilidadDto: UpdateDisponibilidadDto,
  ): Promise<Conductor> {
    const conductor = await this.conductorRepository.findOne({ where: { curp } });
    if (!conductor) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }

    conductor.disponibilidad = updateDisponibilidadDto.disponibilidad;
    return this.conductorRepository.save(conductor);
  }

  async updateLicenciaVigente(
    curp: string,
    dto: UpdateLicenciaVigenteDto,
  ): Promise<Conductor> {
    const conductor = await this.conductorRepository.findOne({ where: { curp } });
    if (!conductor) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }

    conductor.licenciaVigente = dto.licenciaVigente;
    return this.conductorRepository.save(conductor);
  }

  async deleteByCurp(curp: string): Promise<void> {
    const result = await this.conductorRepository.delete({ curp });
    if (result.affected === 0) {
      throw new NotFoundException(`Conductor con CURP ${curp} no encontrado`);
    }
  }
}