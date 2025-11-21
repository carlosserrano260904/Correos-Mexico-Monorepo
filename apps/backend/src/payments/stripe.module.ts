import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { Card } from '../cards/entities/card.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Profile])],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService], // ✅ ¡Esto es lo que faltaba!
})
export class StripeModule {}
