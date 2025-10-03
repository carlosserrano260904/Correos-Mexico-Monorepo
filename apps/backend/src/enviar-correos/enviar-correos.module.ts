import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnviarCorreosService } from './enviar-correos.service';

@Module({
  imports: [ConfigModule],
  providers: [EnviarCorreosService],
  exports: [EnviarCorreosService],
})
export class EmailModule {}
