import { Controller, Get } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Factura } from './factura.entity';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get()
  findAll(): Promise<Factura[]> {
    return this.facturasService.findAll();
  }
}