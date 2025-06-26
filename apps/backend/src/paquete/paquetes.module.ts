import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaquetesService } from './paquetes.service';
import { PaquetesController } from './paquetes.controller';
import { Paquete } from './entities/paquete.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paquete])],
  controllers: [PaquetesController],
  providers: [PaquetesService],
})
export class PaquetesModule {}
