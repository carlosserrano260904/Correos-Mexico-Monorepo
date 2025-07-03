import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Unidad } from './entities/unidad.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { Sucursal } from '../sucursalesdummy/entities/sucursal.entity';
import { TipoVehiculoSucursal } from '../sucursalesdummy/entities/tipo-vehiculo-sucursal.entity';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { Conductor } from '../conductores/entities/conductor.entity';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { SucursalTiposVehiculoDto } from './dto/sucursal-tipos-vehiculo.dto';
import { HistorialAsignacionesService } from '../historial-asignaciones/historial-asignaciones.service';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidad)
    private unidadRepository: Repository<Unidad>,
    @InjectRepository(TipoVehiculo)
    private tipoVehiculoRepository: Repository<TipoVehiculo>,
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>,
    @InjectRepository(TipoVehiculoSucursal)
    private tipoVehiculoSucursalRepository: Repository<TipoVehiculoSucursal>,
    @InjectRepository(Conductor)
    private conductorRepository: Repository<Conductor>,
    private dataSource: DataSource,
    private historialAsignacionesService: HistorialAsignacionesService,
  ) {}

  async findAll(): Promise<UnidadResponseDto[]> {
    const unidades = await this.unidadRepository.find();
    return unidades.map(unidad => this.mapToResponseDto(unidad));
  }

  async findBySucursal(claveOficina: number): Promise<Omit<UnidadResponseDto, 'claveOficina' | 'estado'>[]> {
    const unidades = await this.unidadRepository.find({
      where: { 
        claveOficina,
        estado: 'disponible' 
      }
    });

    return unidades.map(unidad => this.mapToSimpleDto(unidad));
  }

  async create(createUnidadDto: CreateUnidadDto): Promise<UnidadResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sucursal = await this.sucursalRepository.findOne({ 
        where: { claveOficina: createUnidadDto.claveOficina } 
      });
      
      if (!sucursal) {
        throw new NotFoundException(
          `Sucursal con clave ${createUnidadDto.claveOficina} no encontrada`
        );
      }

      const tipoPermitido = await this.tipoVehiculoSucursalRepository.findOne({
        where: {
          tipoOficina: sucursal.tipo,
          tipoVehiculo: createUnidadDto.tipoVehiculo,
        },
      });

      if (!tipoPermitido) {
        throw new ConflictException(
          `Tipo de vehículo no permitido para sucursal tipo ${sucursal.tipo}`
        );
      }

      const tipoVehiculo = await this.tipoVehiculoRepository.findOne({
        where: { tipoVehiculo: createUnidadDto.tipoVehiculo },
      });

      if (!tipoVehiculo) {
        throw new NotFoundException(
          `Tipo de vehículo ${createUnidadDto.tipoVehiculo} no encontrado`
        );
      }

      const nuevaUnidad = this.unidadRepository.create({
        tipoVehiculo: tipoVehiculo.tipoVehiculo,
        placas: createUnidadDto.placas,
        volumenCarga: createUnidadDto.volumenCarga,
        numEjes: createUnidadDto.numEjes,
        numLlantas: createUnidadDto.numLlantas,
        claveOficina: createUnidadDto.claveOficina,
        tarjetaCirculacion: createUnidadDto.tarjetaCirculacion,
        curpConductor: 'S/C',
        estado: 'disponible',
        fechaAlta: new Date(),
      });

      const unidadGuardada = await queryRunner.manager.save(nuevaUnidad);
      await queryRunner.commitTransaction();

      return this.mapToResponseDto(unidadGuardada);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async assignConductor(
    placas: string,
    assignConductorDto: AssignConductorDto,
  ): Promise<UnidadResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscar unidad por placas
      const unidad = await this.unidadRepository.findOne({ 
        where: { placas },
      });

      if (!unidad) {
        throw new NotFoundException(`Unidad con placas ${placas} no encontrada`);
      }

      // 2. Manejo de desasignación (S/C)
      if (assignConductorDto.curpConductor === 'S/C') {
        // 2.1 Si tenía conductor asignado, finalizar en historial y marcar como disponible
        if (unidad.curpConductor !== 'S/C') {
          await this.historialAsignacionesService.finalizarAsignacion(
            unidad.curpConductor,
            unidad.placas
          );

          // 🔄 Actualizar disponibilidad del conductor anterior a TRUE
          const conductorAnterior = await this.conductorRepository.findOne({
            where: { curp: unidad.curpConductor },
          });
          if (conductorAnterior) {
            conductorAnterior.disponibilidad = true;
            await queryRunner.manager.save(conductorAnterior);
          }
        }
        
        // 2.2 Actualizar unidad
        unidad.curpConductor = 'S/C';
        unidad.estado = 'disponible';
        
        const unidadActualizada = await queryRunner.manager.save(unidad);
        await queryRunner.commitTransaction();
        return this.mapToResponseDto(unidadActualizada);
      }

      // 3. Validar conductor para asignación
      const conductor = await this.conductorRepository.findOne({
        where: { 
          curp: assignConductorDto.curpConductor,
          claveOficina: unidad.claveOficina,
        },
      });

      if (!conductor) {
        throw new NotFoundException(
          `Conductor con CURP ${assignConductorDto.curpConductor} no encontrado en la sucursal ${unidad.claveOficina}`
        );
      }

      if (conductor.disponibilidad === false || conductor.licenciaVigente === false) {
        throw new ConflictException(
          `Estado del conductor: ${conductor.disponibilidad ? 'Disponible' : 'No disponible'}, ` +
          `Licencia: ${conductor.licenciaVigente ? 'Vigente' : 'No vigente'}`
        );
      }

      // 4. Finalizar asignación anterior si existe y marcar como disponible
      if (unidad.curpConductor !== 'S/C') {
        await this.historialAsignacionesService.finalizarAsignacion(
          unidad.curpConductor,
          unidad.placas
        );

        // 🔄 Actualizar disponibilidad del conductor anterior a TRUE
        const conductorAnterior = await this.conductorRepository.findOne({
          where: { curp: unidad.curpConductor },
        });
        if (conductorAnterior) {
          conductorAnterior.disponibilidad = true;
          await queryRunner.manager.save(conductorAnterior);
        }
      }

      // 5. Registrar nueva asignación en historial
      await this.historialAsignacionesService.registrarAsignacion(
        conductor.nombreCompleto,
        conductor.curp,
        unidad.placas
      );

      // 6. Actualizar conductor (marcar como no disponible) y unidad
      conductor.disponibilidad = false;
      await queryRunner.manager.save(conductor);

      unidad.curpConductor = conductor.curp;
      unidad.estado = 'no disponible'; // Asegúrate de que coincida con tu CHECK constraint
      const unidadActualizada = await queryRunner.manager.save(unidad);

      await queryRunner.commitTransaction();
      return this.mapToResponseDto(unidadActualizada);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTiposVehiculoPorSucursal(
    claveSucursal: number,
  ): Promise<SucursalTiposVehiculoDto> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { claveOficina: claveSucursal },
    });

    if (!sucursal) {
      throw new NotFoundException(
        `Sucursal con clave ${claveSucursal} no encontrada`
      );
    }

    const tiposPermitidos = await this.tipoVehiculoSucursalRepository.find({
      where: { tipoOficina: sucursal.tipo },
    });

    if (tiposPermitidos.length === 0) {
      return {
        sucursal: sucursal.claveOficina,
        nombreOficina: sucursal.nombreOficina,
        tipoSucursal: sucursal.tipo,
        tiposVehiculo: [],
      };
    }

    return {
      sucursal: sucursal.claveOficina,
      nombreOficina: sucursal.nombreOficina,
      tipoSucursal: sucursal.tipo,
      tiposVehiculo: tiposPermitidos.map(t => t.tipoVehiculo),
    };
  }

  private mapToResponseDto(unidad: Unidad): UnidadResponseDto {
    return {
      tipoVehiculo: unidad.tipoVehiculo,
      placas: unidad.placas,
      volumenCarga: unidad.volumenCarga,
      numEjes: unidad.numEjes,
      numLlantas: unidad.numLlantas,
      fechaAlta: unidad.fechaAlta,
      tarjetaCirculacion: unidad.tarjetaCirculacion,
      conductor: unidad.curpConductor,
      claveOficina: unidad.claveOficina,
      estado: unidad.estado,
    };
  }

  private mapToSimpleDto(unidad: Unidad): Omit<UnidadResponseDto, 'claveOficina' | 'estado'> {
    const { claveOficina, estado, ...simpleDto } = this.mapToResponseDto(unidad);
    return simpleDto;
  }
}