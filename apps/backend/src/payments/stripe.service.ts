import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from '../cards/entities/card.entity';
import { Profile } from '../profile/entities/profile.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class StripeService {
  private stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ?? (() => { throw new Error('STRIPE_SECRET_KEY no definida'); })(),
    {
      apiVersion: '2025-08-27.basil',
    }
  );

  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) { }

  async createCustomer(email: string) {
    return await this.stripe.customers.create({ email });
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string) {
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  async createPaymentIntent(amount: number, customerId: string, paymentMethodId: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: 'mxn',
      customer: customerId,
      payment_method: paymentMethodId,
      payment_method_types: ['card'],
      confirm: true,
    });
  }

  async saveCardToDatabase(paymentMethod: Stripe.PaymentMethod, profileId: number) {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });
    if (!profile) throw new Error('Perfil no encontrado');

    const card = this.cardRepo.create({
      stripeCardId: paymentMethod.id,
      last4: paymentMethod.card?.last4 ?? '',
      brand: paymentMethod.card?.brand ?? '',
      profile,
      profileId,
    });

    return await this.cardRepo.save(card);
  }

  async associateCardAndSave(customerId: string, paymentMethodId: string, profileId: number) {
    // 1. Asociar tarjeta al cliente en Stripe
    await this.attachPaymentMethod(customerId, paymentMethodId);

    // 2. Obtener los datos de la tarjeta desde Stripe
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

    // 3. Guardar en base de datos
    return await this.saveCardToDatabase(paymentMethod, profileId);
  }

}
