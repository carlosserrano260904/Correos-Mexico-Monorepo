import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { Card } from './entities/card.entity';
import { ConfigService } from '@nestjs/config';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);
  private readonly stripe: Stripe;

  async getCardsByUser(userId: number) {
    // Buscar el perfil asociado al userId
    const profile = await this.cardRepository.manager.findOne('Profile', { where: { usuario: userId } });
    if (!profile || !('id' in profile)) {
      return [];
    }
    // Buscar las tarjetas por profileId
    return this.cardRepository.find({ where: { profileId: (profile as any).id } });
  }
  
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async addCard(profile: Profile, dto: CreateCardDto) {
  try {
    const { token, cardholderName } = dto;

    if (!profile.stripeCustomerId) {
      throw new NotFoundException('Stripe Customer ID no encontrado para este perfil');
    }

    this.logger.debug(`Agregando tarjeta para Stripe Customer: ${profile.stripeCustomerId}`);

    // Crear la fuente en Stripe
    const card = await this.stripe.customers.createSource(
      profile.stripeCustomerId,
      {
        source: token,
        // Opcional: incluir cardholderName
        // metadata: { cardholderName }
      }
    ) as Stripe.Card;

    this.logger.debug(
      `Tarjeta creada en Stripe: ${card.id} (${card.brand}) ****${card.last4}`
    );

    const newCard = this.cardRepository.create({
      stripeCardId: card.id,
      last4: card.last4!,
      brand: card.brand,
      profileId: profile.id,
      // name: cardholderName,   // <- si tu entidad tiene este campo
    });

    const savedCard = await this.cardRepository.save(newCard);

    this.logger.debug(`Tarjeta guardada en DB con ID: ${savedCard.id}`);

    return savedCard;

  } catch (error) {
    this.logger.error('Error al agregar tarjeta:', error);
    throw new InternalServerErrorException('No se pudo agregar la tarjeta');
  }
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