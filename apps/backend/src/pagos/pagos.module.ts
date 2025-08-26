import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Profile } from '../profile/entities/profile.entity';
import { Card } from '../cards/entities/card.entity';
import { FacturasModule } from '../facturas/facturas.module';
import { StripeModule } from '../stripe/stripe.module'; // si tienes stripe.module.ts

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Card]),
    forwardRef(() => FacturasModule),
    forwardRef(() => StripeModule),
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}