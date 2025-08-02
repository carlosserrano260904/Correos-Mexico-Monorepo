import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import Stripe from 'stripe';
import { CreateCardDto } from './dto/create-card.dto';

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
    apiVersion: '2025-06-30.basil',
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

  async deleteCard(id: number) {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) return;

    const stripeCustomerId = (await this.cardRepository.manager.findOne('Profile', { where: { id: card.profileId } }))?.['stripeCustomerId'];

    if (stripeCustomerId) {
      await this.stripe.customers.deleteSource(stripeCustomerId, card.stripeCardId);
    }

    return this.cardRepository.delete(id);
  }
}