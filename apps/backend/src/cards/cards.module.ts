import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Profile])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
