import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  addCard(@Body() dto: CreateCardDto) {
    return this.cardsService.addCard(dto);
  }

  @Get()
  findAll() {
    console.log('GET /cards llamado');
    return this.cardsService.findAll();
  }

  // Nuevo endpoint para buscar tarjetas por userId
  @Get('user/:userId')
  async getCardsByUser(@Param('userId') userId: number) {
    return this.cardsService.getCardsByUser(+userId);
  }

  @Get(':profileId')
  getCards(@Param('profileId') profileId: number) {
    return this.cardsService.getCards(+profileId);
  }

  @Delete()
  deleteCard(@Body() body: { paymentMethodId: string, profileId: number }) {
    console.log('Petición DELETE recibida:', body);
    // Buscar la tarjeta en la BD por stripeCardId y profileId
    return this.cardsService.deleteCardByStripeId(body.paymentMethodId, body.profileId);
  }
}