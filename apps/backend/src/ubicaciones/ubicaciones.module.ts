import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Oficina } from './entities/oficina.entity';
import { OficinasService } from './ubicaciones.service';
import { OficinasController } from './ubicaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Oficina])],
  providers: [OficinasService],
  controllers: [OficinasController],
})
export class Ubicaciones {}
