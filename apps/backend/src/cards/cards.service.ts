import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  async getCardsByUser(userId: number) {
    // Buscar el perfil asociado al userId
    const profile = await this.cardRepository.manager.findOne('Profile', { where: { usuario: userId } });
    if (!profile || !('id' in profile)) {
      return [];
    }
    // Buscar las tarjetas por profileId
    return this.cardRepository.find({ where: { profileId: (profile as any).id } });
  }
  private stripe = new Stripe('sk_test_51RdK19DfrKDC0J17G3kjTeavUjKqNy3ZHw8vKL90zUMVBawHey65e7bLpJWg5TeGcuDKVG9nRjfdiEbZk71pETiF00hAPYbMLI', {
    apiVersion: '2025-08-27.basil',
  });

  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async addCard(dto: CreateCardDto) {
    const card = await this.stripe.customers.createSource(dto.stripeCustomerId, {
      source: dto.token,
    }) as Stripe.Card;

    const newCard = this.cardRepository.create({
      stripeCardId: card.id,
      last4: card.last4!,
      brand: card.brand,
      profileId: dto.profileId,
    });

    return this.cardRepository.save(newCard);
  }

  async getCards(profileId: number) {
    return this.cardRepository.find({ where: { profileId } });
  }
  async findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  async deleteCardByStripeId(stripeCardId: string, profileId: number) {
    console.log('deleteCardByStripeId:', { stripeCardId, profileId });
    const card = await this.cardRepository.findOne({ where: { stripeCardId, profileId } });
    console.log('Card encontrada:', card);
    if (!card) return;

    const stripeCustomerId = (await this.cardRepository.manager.findOne('Profile', { where: { id: profileId } }))?.['stripeCustomerId'];
    console.log('stripeCustomerId:', stripeCustomerId);
    if (stripeCustomerId) {
      let stripeResult;
      if (stripeCardId.startsWith('pm_')) {
        // Es un PaymentMethod
        stripeResult = await this.stripe.paymentMethods.detach(stripeCardId);
        console.log('Detach PaymentMethod:', stripeResult);
      } else {
        // Es un Source (legacy)
        stripeResult = await this.stripe.customers.deleteSource(stripeCustomerId, stripeCardId);
        console.log('Delete Source:', stripeResult);
      }
    }
    const dbResult = await this.cardRepository.delete(card.id);
    console.log('Resultado BD:', dbResult);
    return dbResult;
}
}