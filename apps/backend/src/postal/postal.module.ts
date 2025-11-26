import { Module } from '@nestjs/common';
import { PostalController } from './postal.controller';
import { PostalService } from './postal.service';

@Module({
  controllers: [PostalController],
  providers: [PostalService],
})
export class PostalModule {}
