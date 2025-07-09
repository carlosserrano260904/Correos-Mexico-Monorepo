import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RutaService } from './ruta.service';
import { RutaController } from './ruta.controller';
import { Ruta } from './entities/ruta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ruta])],
  controllers: [RutaController],
  providers: [RutaService],
})
export class RutaModule {}
