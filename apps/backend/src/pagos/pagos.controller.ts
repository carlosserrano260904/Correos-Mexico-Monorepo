import { Controller, Post, Body } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('confirmar')
  @ApiOperation({ summary: 'Confirmar un pago' })
  @ApiResponse({ status: 201, description: 'Pago confirmado correctamente' })
  @ApiResponse({ status: 400, description: 'Error en la confirmación del pago' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'string', example: 'profile_123abc' },
        total: { type: 'number', example: 100.50 },
      },
      required: ['profileId', 'total'],
    },
  })
  async confirmarPago(@Body() body: { profileId: string; total: number }) {
    return this.pagosService.confirmarPago(body.profileId, body.total);
  }
}
