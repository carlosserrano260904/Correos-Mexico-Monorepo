import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { TipoVehiculoSucursal } from './entities/tipo-vehiculo-sucursal.entity';
import { SucursalTipoVehiculoDto } from './dto/sucursal-tipo-vehiculo.dto';

@Injectable()
export class SucursalesService {
  constructor(
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>,
    @InjectRepository(TipoVehiculoSucursal)
    private tipoVehiculoSucursalRepository: Repository<TipoVehiculoSucursal>,
  ) {}

  private async mapSucursalToDto(sucursal: Sucursal): Promise<SucursalTipoVehiculoDto> {
    const tiposVehiculo = await this.tipoVehiculoSucursalRepository.find({
      where: { tipoOficina: sucursal.tipo },
    });

    return {
      claveOficina: sucursal.claveOficina,
      nombreOficina: sucursal.nombreOficina,
      tipo: sucursal.tipo,
      estado: sucursal.estado,
      colonia: sucursal.colonia,
      municipio: sucursal.municipio,
      fechaCreacion: sucursal.fechaCreacion,
      tiposVehiculo: [...new Set(tiposVehiculo.map(t => t.tipoVehiculo))],
    };
  }

  async findOneById(id: number): Promise<SucursalTipoVehiculoDto> {
    const sucursal = await this.sucursalRepository.findOne({ where: { id } });
    if (!sucursal) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }
    return this.mapSucursalToDto(sucursal);
  }

  async findOneByClave(claveOficina: number): Promise<SucursalTipoVehiculoDto> {
    const sucursal = await this.sucursalRepository.findOne({ where: { claveOficina } });
    if (!sucursal) {
      throw new NotFoundException(`Sucursal con clave ${claveOficina} no encontrada`);
    }
    return this.mapSucursalToDto(sucursal);
  }

  async findAll(): Promise<SucursalTipoVehiculoDto[]> {
    const sucursales = await this.sucursalRepository.find();
    return Promise.all(sucursales.map(sucursal => this.mapSucursalToDto(sucursal)));
  }
}