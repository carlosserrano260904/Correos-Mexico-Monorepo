import { Module } from '@nestjs/common'; // Importa el decorador Module para definir módulos en NestJS
import { ShippingRateService } from './shipping_rates.service'; // Importa el servicio con la lógica de negocio
import { ShippingRateController } from './shipping_rates.controller'; // Importa el controlador que maneja las rutas HTTP
import { HttpModule } from '@nestjs/axios'; // Permite hacer peticiones HTTP externas
import { TypeOrmModule } from '@nestjs/typeorm'; // Permite usar TypeORM para acceso a base de datos
import { ShippingRate } from './entities/shipping_rate.entity'; // Entidad de tarifas de envío
import { Zone } from './entities/zone.entity'; // Entidad de zonas de envío
import { Service } from './entities/service.entity'; // Entidad de servicios de envío
import { InternationalCountry } from './entities/international-country.entity'; // Entidad de países internacionales
import { InternationalTariff } from './entities/international-tariff.entity'; // Entidad de tarifas internacionales
import { InternationalZone } from './entities/international-zone.entity'; // Entidad de zonas internacionales

// Define el módulo ShippingRateModule, que agrupa controlador, servicio y entidades relacionadas
@Module({
  imports: [
    // Importa las entidades para que TypeORM pueda usarlas en el repositorio
    TypeOrmModule.forFeature([
      ShippingRate,
      Zone,
      Service,
      InternationalCountry,
      InternationalTariff,
      InternationalZone,
    ]),
    HttpModule, // Importa el módulo HTTP para peticiones externas
  ],
  controllers: [ShippingRateController], // Declara el controlador que maneja las rutas
  providers: [ShippingRateService], // Declara el servicio que contiene la lógica de negocio
})
export class ShippingRateModule {} // Exporta el módulo para que pueda ser usado en la aplicación