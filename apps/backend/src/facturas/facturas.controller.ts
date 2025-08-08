import { Controller, Get } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { Factura } from './factura.entity';
import { Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Facturas')
@Controller('facturas')
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Obtener facturas de un perfil específico' })
  @ApiParam({ name: 'profileId', description: 'ID del perfil', example: '1' })
  @ApiResponse({ status: 200, description: 'Facturas encontradas', type: [Factura] })
  findByProfile(@Param('profileId') profileId: string): Promise<Factura[]> {
    return this.facturasService.findByProfile(profileId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las facturas' })
  @ApiResponse({ status: 200, description: 'Lista de facturas', type: [Factura] })
  findAll(): Promise<Factura[]> {
    return this.facturasService.findAll();
  }
}