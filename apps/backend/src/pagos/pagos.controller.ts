import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('confirmar')
  async confirmarPago(@Body() body: { profileId: string; total: number }) {
    return this.pagosService.confirmarPago(body.profileId, body.total);
  }
}
