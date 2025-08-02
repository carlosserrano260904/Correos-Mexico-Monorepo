import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY ?? (() => { throw new Error('STRIPE_SECRET_KEY no definida'); })(),
    {
      apiVersion: '2025-07-30.basil',
    }
  );

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
      amount, // en centavos: 100 = 1.00 MXN
      currency: 'mxn',
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
    });
  }
}
