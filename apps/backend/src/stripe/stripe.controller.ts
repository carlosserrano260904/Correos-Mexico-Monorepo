import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('pagos')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('crear-cliente')
  createCustomer(@Body() body: { email: string }) {
    return this.stripeService.createCustomer(body.email);
  }

  @Post('asociar-tarjeta')
  async associateCard(
    @Body() body: { customerId: string; paymentMethodId: string; profileId: number }
  ) {
    return this.stripeService.associateCardAndSave(
      body.customerId,
      body.paymentMethodId,
      body.profileId
    );
  }

  @Post('realizar')
  createPaymentIntent(
    @Body()
    body: {
      amount: number;
      customerId: string;
      paymentMethodId: string;
    }
  ) {
    return this.stripeService.createPaymentIntent(
      body.amount,
      body.customerId,
      body.paymentMethodId
    );
  }

  @Get('mis-tarjetas/:profileId')
  async getTarjetas(@Param('profileId') profileId: number) {
    // Consulta real a la tabla `card`
    const tarjetas = await this.stripeService['cardRepo'].find({
      where: { profileId },
      select: ['id', 'stripeCardId', 'brand', 'last4'],
    });
    return tarjetas;
  }
}
