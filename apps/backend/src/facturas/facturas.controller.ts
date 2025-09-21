import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FacturasService } from './facturas.service';
import { Factura } from './factura.entity';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Obtener facturas de un perfil específico' })
  @ApiParam({ name: 'profileId', description: 'ID del perfil', example: '1' })
  @ApiResponse({ status: 200, description: 'Facturas encontradas', type: [Factura] })
  findByProfile(@Param('profileId') profileId: string) {
    return this.facturasService.findByProfile(Number(profileId));
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ status: 200, description: 'Lista de facturas', type: [Factura] })
  findAll() {
    return this.facturasService.findAll();
  }
}
