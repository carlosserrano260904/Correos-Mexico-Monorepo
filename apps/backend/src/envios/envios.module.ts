import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnviosController } from './envios.controller';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { GuiaTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { Unidad } from '../unidades/entities/unidad.entity';
import { UploadImageModule } from '../upload-image/upload-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Envio, GuiaTypeormEntity, Unidad]),
    UploadImageModule,
  ],
  controllers: [EnviosController],
  providers: [EnviosService],
})
export class EnviosModule {}