import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Unidad } from './entities/unidad.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { TipoVehiculoOficina } from './entities/tipo-vehiculo-oficina.entity';
import { Oficina } from '../oficinas/entities/oficina.entity';
import { Conductor } from '../conductores/entities/conductor.entity';

import { CreateUnidadDto } from './dto/create-unidad.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { OficinaTipoVehiculoDto } from './dto/oficina-tipo-vehiculo.dto';
import { AssignZonaDto } from './dto/assign-zona.dto';

import { HistorialAsignacionesService } from '../historial-asignaciones/historial-asignaciones.service';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private unidadRepo: Repository<Unidad>,

    @InjectRepository(TipoVehiculo)
    private tipoVehiculoRepo: Repository<TipoVehiculo>,

    @InjectRepository(Oficina)
    private oficinaRepo: Repository<Oficina>,

    @InjectRepository(TipoVehiculoOficina)
    private tipoOficinaRepo: Repository<TipoVehiculoOficina>,

    @InjectRepository(Conductor)
    private conductorRepo: Repository<Conductor>,

    private historialSvc: HistorialAsignacionesService,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<UnidadResponseDto[]> {
    const all = await this.unidadRepo.find({
      relations: ['tipoVehiculo', 'oficina', 'conductor'],
    });
    return all.map(u => this.mapToResponse(u));
  }

  async findByOficina(
    claveOficina: number,
  ): Promise<Omit<UnidadResponseDto, 'claveOficina' | 'estado'>[]> {
    const list = await this.unidadRepo.find({
      where: { oficina: { clave_oficina_postal: claveOficina }, estado: 'disponible' },
      relations: ['tipoVehiculo', 'oficina', 'conductor'],
    });
    return list.map(u => {
      const { estado, claveOficina, ...rest } = this.mapToResponse(u);
      return rest;
    });
  }

  async create(dto: CreateUnidadDto): Promise<UnidadResponseDto> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const oficina = await this.oficinaRepo.findOne({
        where: { clave_oficina_postal: dto.claveOficina },
      });
      if (!oficina) {
        throw new NotFoundException(
          `Oficina con clave ${dto.claveOficina} no encontrada`,
        );
      }

      // Permiso de tipo: usar relaciones en where
      const permiso = await this.tipoOficinaRepo.findOne({
        where: {
          tipoOficina: oficina.tipo_cuo,
          tipoVehiculo: {
            tipoVehiculo: dto.tipoVehiculo,
          },
        },
        relations: ['tipoVehiculo'],
      });
      if (!permiso) {
        throw new ConflictException(
          `Tipo de vehículo no permitido para oficina tipo ${oficina.tipo_cuo}`,
        );
      }

      const tv = await this.tipoVehiculoRepo.findOne({
        where: { tipoVehiculo: dto.tipoVehiculo },
      });
      if (!tv) {
        throw new NotFoundException(
          `Tipo de vehículo ${dto.tipoVehiculo} no encontrado`,
        );
      }

      // Crear unidad: omitir conductor para usar default 'S/C'
      const nueva = this.unidadRepo.create({
        tipoVehiculo: tv,
        placas: dto.placas,
        volumenCarga: dto.volumenCarga,
        numEjes: dto.numEjes,
        numLlantas: dto.numLlantas,
        tarjetaCirculacion: dto.tarjetaCirculacion,
        fechaAlta: new Date(),
        estado: 'disponible',
        oficina: oficina,
      });

      const saved = (await qr.manager.save(nueva)) as Unidad;
      await qr.commitTransaction();
      return this.mapToResponse(saved);
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async assignConductor(
    placas: string,
    dto: AssignConductorDto,
  ): Promise<UnidadResponseDto> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const unidad = await this.unidadRepo.findOne({
        where: { placas },
        relations: ['oficina', 'conductor', 'tipoVehiculo'],
      });
      if (!unidad) {
        throw new NotFoundException(
          `Unidad con placas ${placas} no encontrada`,
        );
      }

      // Desasignar
      if (dto.curpConductor === 'S/C') {
        if (unidad.conductor) {
          await this.historialSvc.finalizarAsignacion(
            unidad.conductor.curp,
            placas,
          );
          unidad.conductor.disponibilidad = true;
          await qr.manager.save(unidad.conductor);
        }
        // dejar curp 'S/C' por defecto
        (unidad as any).conductor = undefined;
        unidad.estado = 'disponible';
        const upd = (await qr.manager.save(unidad)) as Unidad;
        await qr.commitTransaction();
        return this.mapToResponse(upd);
      }

      const conductor = await this.conductorRepo.findOne({
        where: {
          curp: dto.curpConductor,
          oficina: { clave_oficina_postal: unidad.oficina.clave_oficina_postal },
        },
        relations: ['oficina'],
      });
      if (!conductor) {
        throw new NotFoundException(
          `Conductor ${dto.curpConductor} no encontrado en oficina ${unidad.oficina.clave_oficina_postal}`,
        );
      }
      if (!conductor.disponibilidad || !conductor.licenciaVigente) {
        throw new ConflictException(
          `Conductor no disponible o licencia no vigente`,
        );
      }

      if (unidad.conductor) {
        await this.historialSvc.finalizarAsignacion(
          unidad.conductor.curp,
          placas,
        );
        unidad.conductor.disponibilidad = true;
        await qr.manager.save(unidad.conductor);
      }

        await this.historialSvc.registrarAsignacion(
            conductor.nombreCompleto,
            conductor.curp,
            placas,
            unidad.oficina.clave_cuo,
            unidad.zonaAsignada // Ahora ya es la clave CUO
        );
      conductor.disponibilidad = false;
      await qr.manager.save(conductor);

      unidad.conductor = conductor;
      unidad.estado = 'no disponible';
      const upd = (await qr.manager.save(unidad)) as Unidad;

      await qr.commitTransaction();
      return this.mapToResponse(upd);
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async getTiposVehiculoPorOficina(
    claveOficina: number,
  ): Promise<OficinaTipoVehiculoDto> {
    const oficina = await this.oficinaRepo.findOne({
      where: { clave_oficina_postal: claveOficina },
    });
    if (!oficina) {
      throw new NotFoundException(
        `Oficina con clave ${claveOficina} no encontrada`,
      );
    }

    const list = await this.tipoOficinaRepo.find({
      where: { tipoOficina: oficina.tipo_cuo },
      relations: ['tipoVehiculo'],
    });


    if (list.length === 0) {
      return {
        claveOficina,
        nombreOficina: oficina.nombre_cuo,
        tipo: oficina.tipo_cuo,
        tiposVehiculo: [],
        mensaje: 'Esta oficina no tiene tipos de vehículo asignados',
      };
    }

    return {
      claveOficina,
      nombreOficina: oficina.nombre_cuo,
      tipo: oficina.tipo_cuo,
      tiposVehiculo: list.map(t => t.tipoVehiculo.tipoVehiculo),
    };
  }

  private mapToResponse(u: Unidad): UnidadResponseDto {
    return {
      tipoVehiculo: u.tipoVehiculo.tipoVehiculo,
      placas: u.placas,
      volumenCarga: u.volumenCarga,
      numEjes: u.numEjes,
      numLlantas: u.numLlantas,
      fechaAlta: u.fechaAlta,
      tarjetaCirculacion: u.tarjetaCirculacion,
      conductor: u.conductor ? u.conductor.curp : 'S/C',
      claveOficina: u.oficina.clave_oficina_postal,
      estado: u.estado,
      zonaAsignada: u.zonaAsignada,
    };
  }

  async assignZona(placas: string, dto: AssignZonaDto): Promise<UnidadResponseDto> {
      const unidad = await this.unidadRepo.findOne({
          where: { placas },
          relations: ['tipoVehiculo', 'oficina', 'conductor'],
      });

      if (!unidad) throw new NotFoundException(`Unidad con placas ${placas} no encontrada`);

      const oficinaOrigen = unidad.oficina;
      if (!oficinaOrigen) throw new NotFoundException(`Oficina no asignada a la unidad`);

      // Validar no asignación a sí misma
      if (dto.claveCuoDestino === oficinaOrigen.clave_cuo) {
          throw new BadRequestException(`No puedes asignar la unidad a su misma oficina de origen`);
      }

      const oficinaDestino = await this.oficinaRepo.findOne({
          where: { clave_cuo: dto.claveCuoDestino }
      });
      if (!oficinaDestino) throw new NotFoundException(`Oficina con clave ${dto.claveCuoDestino} no encontrada`);

      // Nueva lógica de validación:
      const esValida = await this.validarRutaValida(oficinaOrigen.clave_cuo, oficinaDestino.clave_cuo);
      if (!esValida) {
          throw new BadRequestException(
              `La ruta desde ${oficinaOrigen.clave_cuo} a ${oficinaDestino.clave_cuo} no está permitida`
          );
      }

      unidad.zonaAsignada = oficinaDestino.clave_cuo;
      const updatedUnidad = await this.unidadRepo.save(unidad);
      return this.mapToResponse(updatedUnidad);
  }

  private async validarRutaValida(claveOrigen: string, claveDestino: string): Promise<boolean> {
      // 1. Obtener todas las oficinas que tienen como origen a la oficina actual
      const oficinasHijas = await this.oficinaRepo.find({
          where: { codigo_postal_zona: claveOrigen }
      });

      // 2. Verificar si el destino está en la lista de hijas
      return oficinasHijas.some(oficina => oficina.clave_cuo === claveDestino);
  }
}
