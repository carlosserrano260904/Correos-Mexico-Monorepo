import { Controller, Get } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Factura } from './factura.entity';
import { Param } from '@nestjs/common';

@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('profile/:profileId')
  findByProfile(@Param('profileId') profileId: string): Promise<Factura[]> {
    return this.facturasService.findByProfile(profileId);
  }

  @Get()
  findAll(): Promise<Factura[]> {
    return this.facturasService.findAll();
  }
}