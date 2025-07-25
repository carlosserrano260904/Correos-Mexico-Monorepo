import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Unidad } from './entities/unidad.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { TipoVehiculoOficina } from './entities/tipo-vehiculo-oficina.entity';
import { Oficina } from '../oficinas/entities/oficina.entity';
import { Conductor } from '../conductores/entities/conductor.entity';

import { CreateUnidadDto } from './dto/create-unidad.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { AssignZonaDto } from './dto/assign-zona.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { OficinaTipoVehiculoDto } from './dto/oficina-tipo-vehiculo.dto';

import { HistorialAsignacionesService } from '../historial-asignaciones/historial-asignaciones.service';

import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

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

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<UnidadResponseDto[]> {
    const all = await this.unidadRepo.find({
      relations: ['tipoVehiculo', 'oficina', 'conductor'],
    });
    return all.map(u => this.mapToResponse(u));
  }

  async findByOficina(claveOficina: string): Promise<Omit<UnidadResponseDto, 'claveOficina' | 'estado'>[]> {
    const list = await this.unidadRepo.find({
      where: {
        oficina: { clave_cuo: claveOficina },
        estado: 'disponible',
      },
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
        where: { clave_cuo: dto.claveOficina },
      });
      if (!oficina) {
        throw new NotFoundException(`Oficina con clave ${dto.claveOficina} no encontrada`);
      }

      const permiso = await this.tipoOficinaRepo.findOne({
        where: {
          tipoOficina: oficina.tipo_cuo,
          tipoVehiculo: { tipoVehiculo: dto.tipoVehiculo },
        },
        relations: ['tipoVehiculo'],
      });
      if (!permiso) {
        throw new ConflictException(`Tipo de vehículo no permitido para oficina tipo ${oficina.tipo_cuo}`);
      }

      const tv = await this.tipoVehiculoRepo.findOne({
        where: { tipoVehiculo: dto.tipoVehiculo },
      });
      if (!tv) {
        throw new NotFoundException(`Tipo de vehículo ${dto.tipoVehiculo} no encontrado`);
      }

      const nueva = this.unidadRepo.create({
        tipoVehiculo: tv,
        placas: dto.placas,
        volumenCarga: dto.volumenCarga,
        numEjes: dto.numEjes,
        numLlantas: dto.numLlantas,
        tarjetaCirculacion: dto.tarjetaCirculacion,
        fechaAlta: new Date(),
        estado: 'disponible',
        oficina,
      });

      const saved = await qr.manager.save(nueva);
      await qr.commitTransaction();
      return this.mapToResponse(saved);
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async assignConductor(placas: string, dto: AssignConductorDto): Promise<UnidadResponseDto> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const unidad = await this.unidadRepo.findOne({
        where: { placas },
        relations: ['oficina', 'conductor', 'tipoVehiculo'],
      });
      if (!unidad) throw new NotFoundException(`Unidad con placas ${placas} no encontrada`);

      // Desasignar conductor
      if (dto.curpConductor === 'S/C') {
        if (unidad.conductor) {
          await this.historialSvc.finalizarAsignacion(unidad.conductor.curp, placas);
          unidad.conductor.disponibilidad = true;
          await qr.manager.save(unidad.conductor);
        }
        (unidad as any).conductor = undefined;
        unidad.estado = 'disponible';
        const upd = await qr.manager.save(unidad);
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
        throw new NotFoundException(`Conductor ${dto.curpConductor} no encontrado en oficina ${unidad.oficina.clave_oficina_postal}`);
      }
      if (!conductor.disponibilidad || !conductor.licenciaVigente) {
        throw new ConflictException('Conductor no disponible o licencia no vigente');
      }

      if (unidad.conductor) {
        await this.historialSvc.finalizarAsignacion(unidad.conductor.curp, placas);
        unidad.conductor.disponibilidad = true;
        await qr.manager.save(unidad.conductor);
      }

      await this.historialSvc.registrarAsignacion(
        conductor.nombreCompleto,
        conductor.curp,
        placas,
        unidad.oficina.clave_cuo,
        unidad.zonaAsignada,
      );
      conductor.disponibilidad = false;
      await qr.manager.save(conductor);

      unidad.conductor = conductor;
      unidad.estado = 'no disponible';
      const upd = await qr.manager.save(unidad);
      await qr.commitTransaction();
      return this.mapToResponse(upd);
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  async assignZona(placas: string, dto: AssignZonaDto): Promise<UnidadResponseDto> {
      // 1. Buscar unidad con todas las relaciones necesarias
      const unidad = await this.unidadRepo.findOne({
          where: { placas },
          relations: ['oficina', 'tipoVehiculo', 'conductor']
      });
      
      if (!unidad) throw new NotFoundException(`Unidad con placas ${placas} no encontrada`);
      if (!unidad.oficina) throw new BadRequestException(`La unidad no tiene oficina asignada`);

      const oficinaOrigen = unidad.oficina;

      // 2. Validar no auto-asignación
      if (dto.claveCuoDestino === oficinaOrigen.clave_cuo) {
          throw new BadRequestException(`No puedes asignar la unidad a su misma oficina de origen`);
      }

      // 3. Buscar oficina destino
      const oficinaDestino = await this.oficinaRepo.findOne({ 
          where: { clave_cuo: dto.claveCuoDestino } 
      });
      if (!oficinaDestino) throw new NotFoundException(`Oficina destino no encontrada`);

      // 4. Validación bidireccional
      const esRutaValida = await this.validarRutaBidireccional(
          oficinaOrigen.clave_cuo,
          oficinaDestino.clave_cuo
      );

      if (!esRutaValida) {
          const destinosPermitidos = await this.getOficinasDestinoValidas(placas);
          throw new BadRequestException(
              `Ruta no permitida. Destinos válidos para ${oficinaOrigen.clave_cuo}: ` +
              destinosPermitidos.map(o => o.clave_cuo).join(', ')
          );
      }

      // 5. Actualizar y devolver respuesta
      unidad.zonaAsignada = oficinaDestino.clave_cuo;
      await this.unidadRepo.save(unidad);
      return this.mapToResponse(unidad);
  }
    private async validarRutaBidireccional(claveOrigen: string, claveDestino: string): Promise<boolean> {
      // Caso 1: Relación directa (origen -> destino)
      const oficinaOrigen = await this.oficinaRepo.findOne({ where: { clave_cuo: claveOrigen } });
      const oficinaDestino = await this.oficinaRepo.findOne({ where: { clave_cuo: claveDestino } });

      if (!oficinaOrigen || !oficinaDestino) return false;

      // 1. Validar si el destino tiene como clave_unica_zona al origen
      const esDestinoValido = oficinaDestino.clave_unica_zona === claveOrigen;
      
      // 2. Validar si el origen tiene como clave_unica_zona al destino
      const esOrigenValido = oficinaOrigen.clave_unica_zona === claveDestino;

      // Ruta válida si cumple cualquiera de las dos condiciones
      return esDestinoValido || esOrigenValido;
  }
  
  async getTiposVehiculoPorOficina(claveOficina: string): Promise<OficinaTipoVehiculoDto> {
    const oficina = await this.oficinaRepo.findOne({ where: { clave_cuo: claveOficina } });
    if (!oficina) {
      throw new NotFoundException(`Oficina con clave ${claveOficina} no encontrada`);
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
async getOficinasDestinoValidas(placas: string) {
    const unidad = await this.unidadRepo.findOne({
        where: { placas },
        relations: ['oficina']
    });
    
    if (!unidad?.oficina) throw new NotFoundException('Unidad u oficina no encontrada');

    const oficinaOrigen = unidad.oficina;

    // Obtener todas las oficinas que:
    // 1. Tienen a la oficina origen como clave_unica_zona O
    // 2. Son el destino directo de la oficina origen
    const oficinasDestino = await this.oficinaRepo.find({
        where: [
            { clave_unica_zona: oficinaOrigen.clave_cuo }, // Caso 1
            { clave_cuo: oficinaOrigen.clave_unica_zona }  // Caso 2
        ],
        order: { nombre_cuo: 'ASC' }
    });
    return oficinasDestino.filter(
        oficina => oficina.clave_cuo !== oficinaOrigen.clave_cuo
    )
  }

  async generarQRsDeUnidades(): Promise<{ id: string; qr: string; filePath: string }[]> {
    const unidades = await this.unidadRepo.find();
    const outputDir = path.join(__dirname, 'qrs');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const resultados = await Promise.all(
      unidades.map(async (unidad) => {
        const placasSanitizado = unidad.placas.replace(/[^a-zA-Z0-9_-]/g, '_');
        const filePath = path.join(outputDir, `${placasSanitizado}.png`);
        
        await QRCode.toFile(filePath, unidad.id.toString());
        const qr = await QRCode.toDataURL(unidad.id.toString());

        return { id: unidad.id.toString(), qr, filePath };
      }),
    );

    return resultados;
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
      claveOficina: u.oficina.clave_cuo,
      estado: u.estado,
      zonaAsignada: u.zonaAsignada,
    };
  }

  async findOne(id: string): Promise<Unidad> {
    const unidad = await this.unidadRepo.findOne({ where: { id } });
    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }
    return unidad;
  }
}
