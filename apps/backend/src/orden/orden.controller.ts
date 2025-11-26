import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenDetalleDto } from './dto/orden-detalle.dto';

@Controller('orden') // Endpoint base: /api/orden
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Get(':id') // Endpoint: /api/orden/:id
  async obtenerPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrdenDetalleDto> {
    return this.ordenService.obtenerDetalleOrden(id);
  }
}
