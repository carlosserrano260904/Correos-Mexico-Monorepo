import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { SucursalTipoVehiculoDto } from './dto/sucursal-tipo-vehiculo.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Get()
  async getAll(): Promise<SucursalTipoVehiculoDto[]> {
    return this.sucursalesService.findAll();
  }

  @Get('id/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<SucursalTipoVehiculoDto> {
    return this.sucursalesService.findOneById(id);
  }

  @Get('clave/:clave')
  async getByClave(@Param('clave') clave: number): Promise<SucursalTipoVehiculoDto> {
    return this.sucursalesService.findOneByClave(clave);
  }

}