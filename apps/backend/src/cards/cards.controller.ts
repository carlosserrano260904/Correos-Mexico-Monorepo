import { Controller, Post, Body, Get, Param, Delete, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addCard(@Req() req, @Body() dto: CreateCardDto) {
    const profile = await this.profileRepository.findOne({
      where: { id: req.user.id },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return this.cardsService.addCard(
      profile,
      dto.token,
    );
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