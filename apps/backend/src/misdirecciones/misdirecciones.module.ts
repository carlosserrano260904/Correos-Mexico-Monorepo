import { Module } from '@nestjs/common';
import { MisdireccionesService } from './misdirecciones.service';
import { MisdireccionesController } from './misdirecciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Misdireccione } from './entities/misdireccione.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Misdireccione])],
  controllers: [MisdireccionesController],
  providers: [MisdireccionesService],
})
export class MisdireccionesModule {}
