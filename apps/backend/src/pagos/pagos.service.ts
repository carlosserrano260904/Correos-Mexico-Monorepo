import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { Profile } from '../profile/entities/profile.entity';
import { StripeService } from '../stripe/stripe.service';
import { FacturasService } from '../facturas/facturas.service';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    private readonly stripeService: StripeService,
    private readonly facturasService: FacturasService,
  ) {}

  async confirmarPago(profileId: string, total: number) {
    const profile = await this.profileRepo.findOne({ where: { id: Number(profileId) } });
    if (!profile || !profile.stripeCustomerId) {
      throw new NotFoundException('Perfil o stripeCustomerId no encontrado');
    }

    const card = await this.cardRepo.findOne({
      where: { profile: { id: Number(profileId) } },
      order: { id: 'DESC' },
    });

    if (!card) {
      throw new NotFoundException('No hay tarjeta asociada al usuario');
    }

    const amountInCents = Math.round(total * 100);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      amountInCents,
      profile.stripeCustomerId,
      card.stripeCardId,
    );

    // Guardar factura en DB
    const factura = await this.facturasService.crearFacturaConPago(
      profile,
      amountInCents,
      paymentIntent.status,
      ['Envío Estándar'], // ⚠️ Aquí puedes incluir productos reales si los tienes
    );

    return {
      status: 'success',
      message: 'Pago confirmado y factura generada',
      paymentIntentId: paymentIntent.id,
      profile: { id: profile.id },
    };
  }
}
