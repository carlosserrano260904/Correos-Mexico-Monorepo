import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Pagos (Stripe)¿')
@Controller('pagos')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('crear-cliente')
  @ApiOperation({ summary: 'Crear un cliente en Stripe' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'cliente@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 201, description: 'Cliente creado en Stripe' })
  createCustomer(@Body() body: { email: string }) {
    return this.stripeService.createCustomer(body.email);
  }

  @Post('asociar-tarjeta')
  @ApiOperation({ summary: 'Asociar tarjeta a cliente y guardarla en BD' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'string', example: 'cus_123abc' },
        paymentMethodId: { type: 'string', example: 'pm_456xyz' },
        profileId: { type: 'number', example: 1 },
      },
      required: ['customerId', 'paymentMethodId', 'profileId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Tarjeta asociada correctamente' })
  async associateCard(
    @Body()
    body: {
      customerId: string;
      paymentMethodId: string;
      profileId: number;
    },
  ) {
    return this.stripeService.associateCardAndSave(
      body.customerId,
      body.paymentMethodId,
      body.profileId,
    );
  }

  @Post('realizar')
  @ApiOperation({ summary: 'Crear un pago usando un método de pago' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          example: 1500,
          description: 'Monto en centavos',
        },
        customerId: { type: 'string', example: 'cus_123abc' },
        paymentMethodId: { type: 'string', example: 'pm_456xyz' },
      },
      required: ['amount', 'customerId', 'paymentMethodId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Pago procesado correctamente' })
  createPaymentIntent(
    @Body()
    body: {
      amount: number;
      customerId: string;
      paymentMethodId: string;
    },
  ) {
    return this.stripeService.createPaymentIntent(
      body.amount,
      body.customerId,
      body.paymentMethodId,
    );
  }

  @Get('mis-tarjetas/:profileId')
  @ApiOperation({ summary: 'Obtener tarjetas guardadas de un perfil' })
  @ApiParam({
    name: 'profileId',
    type: Number,
    example: 1,
    description: 'ID del perfil',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarjetas guardadas',
    schema: {
      example: [
        {
          id: 1,
          stripeCardId: 'card_abc123',
          brand: 'Visa',
          last4: '4242',
        },
      ],
    },
  })
  async getTarjetas(@Param('profileId') profileId: number) {
    // Consulta real a la tabla `card`
    const tarjetas = await this.stripeService['cardRepo'].find({
      where: { profileId },
      select: ['id', 'stripeCardId', 'brand', 'last4'],
    });
    return tarjetas;
  }
}
