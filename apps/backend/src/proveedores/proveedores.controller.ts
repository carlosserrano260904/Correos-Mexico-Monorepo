import { Controller, Body, Get } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Get('sub')
  findBySub(@Body('sub') sub: string) {
    return this.proveedoresService.findBySub(sub);
  }
}
