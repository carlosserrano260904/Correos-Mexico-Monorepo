import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagosService } from './pagos.service';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('confirmar')
  @ApiOperation({ summary: 'Confirmar un pago y crear factura' })
  @ApiResponse({ status: 201, description: 'Pago confirmado correctamente' })
  @ApiResponse({
    status: 400,
    description: 'Error en la confirmación del pago',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'string', example: '2' },
        total: { type: 'number', example: 6600 },
        stripeCardId: { type: 'string', example: 'pm_1Pxxxx', nullable: true },
        modo: {
          type: 'string',
          enum: ['real', 'dummy'],
          example: 'dummy',
          nullable: true,
        },
      },
      required: ['profileId', 'total'],
    },
  })
  async confirmar(
    @Body()
    body: {
      profileId: string;
      total: number;
      stripeCardId?: string;
      modo?: 'real' | 'dummy';
    },
  ) {
    try {
      return await this.pagosService.confirmarPago(
        body.profileId,
        body.total,
        body.stripeCardId,
        body.modo,
      );
    } catch (e: any) {
      throw new BadRequestException(
        e?.message || 'No se pudo procesar el pago',
      );
    }
  }
}
