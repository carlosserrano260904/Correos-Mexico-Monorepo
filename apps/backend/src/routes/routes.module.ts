import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';

@Module({
  providers: [RoutesService],
  controllers: [RoutesController],
})
export class RoutesModule {}
