import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { GuiaTypeormEntity } from 'src/guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { Unidad } from '../unidades/entities/unidad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Envio, GuiaTypeormEntity, Unidad])],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}
