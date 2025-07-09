import { Module } from '@nestjs/common';
import { ShippingRateService } from './shipping_rates.service';
import { ShippingRateController } from './shipping_rates.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingRate } from './entities/shipping_rate.entity';
import { Zone } from './entities/zone.entity'; // Asegúrate de que la ruta es correcta
import { Service } from './entities/service.entity';
import { InternationalCountry } from './entities/international-country.entity';
import { InternationalTariff } from './entities/international-tariff.entity';
import { InternationalZone } from './entities/international-zone.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingRate, Zone, Service, InternationalCountry, InternationalTariff, InternationalZone,]),
    HttpModule, // Importa correctamente HttpModule
    
  ],
  controllers: [ShippingRateController],
  providers: [ShippingRateService],
})
export class ShippingRateModule {}
