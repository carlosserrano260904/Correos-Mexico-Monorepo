import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EjemploUsarGuiasController } from './ejemploUsarGuias.controller';
import { EjemploUsarGuiasService } from './ejemploUsarGuias.service';

@Module({
  imports: [CqrsModule],
  controllers: [EjemploUsarGuiasController],
  providers: [EjemploUsarGuiasService],
  exports: [],
})
export class EjemploUsarGuiasModule {}
