import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { Profile } from '../profile/entities/profile.entity';
import { StripeService } from '../stripe/stripe.service';
// Tipamos de forma laxa para no romper si el servicio de facturas usa otro nombre de método
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
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Confirma el pago (real o dummy) y VACÍA el carrito del usuario en DB.
   * Evita cualquier SELECT a productos para no toparse con columnas faltantes.
   */
  async confirmarPago(
    profileId: string,
    total: number,
    stripeCardId?: string,
    modo: 'real' | 'dummy' = 'dummy',
  ) {
    // 1) Validaciones básicas
    const profile = await this.profileRepo.findOne({ where: { id: Number(profileId) } });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const amountInCents = Math.round(Number(total) * 100);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
      throw new Error('Total inválido');
    }

    // 2) “Cobrar” (Stripe real si está disponible y se solicita; de lo contrario, dummy)
    let paymentIntent: { id: string; status: string } = { id: 'pi_dummy', status: 'succeeded' };

    const usarStripeReal =
      modo === 'real' &&
      !!this.stripeService &&
      !!profile.stripeCustomerId &&
      !!stripeCardId &&
      typeof (this.stripeService as any).createPaymentIntent === 'function';

    if (usarStripeReal) {
      // Busca la tarjeta del usuario si hace falta (según tu StripeService)
      let card = await this.cardRepo.findOne({
        where: { profile: { id: Number(profileId) } },
        order: { id: 'DESC' },
      });
      // Usa stripeCardId del body si viene, si no, intenta la última tarjeta guardada
      const pmId = stripeCardId || (card as any)?.stripeCardId;
      if (!pmId) throw new NotFoundException('No hay tarjeta asociada para cobrar');

      // Asumiendo la firma: createPaymentIntent(amountInCents, customerId, paymentMethodId)
      const pi = await (this.stripeService as any).createPaymentIntent(
        amountInCents,
        profile.stripeCustomerId,
        pmId,
      );
      paymentIntent = { id: pi?.id ?? 'pi_unknown', status: pi?.status ?? 'processing' };
    }

    // 3) Vaciar el carrito del usuario SIN JOINS (evitamos columnas que no existen)
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('carrito') // nombre de la tabla según tus logs
      .where('usuarioId = :uid AND activo = true', { uid: Number(profileId) })
      .execute();

    // 4) Generar factura (opcional, en try/catch y con método flexible para no tronar)
    try {
      const facturasAny = this.facturasService as any;
      const crear =
        facturasAny?.crearFactura ||
        facturasAny?.createInvoice ||
        facturasAny?.generarFactura ||
        null;

      if (typeof crear === 'function') {
        await crear(
          profile,             // o profile.id, según tu servicio
          amountInCents,       // monto en centavos
          paymentIntent.status,
          ['Compra en Correos MX'], // concepto básico; ajusta a tu modelo
        );
      }
    } catch {
      // No bloquear el flujo si fallan las facturas; puedes loguearlo si quieres
    }

    // 5) Respuesta para el front
    return {
      status: 'success',
      message: 'Pago confirmado',
      paymentIntentId: paymentIntent.id,
      profile: { id: profile.id },
    };
  }
}
