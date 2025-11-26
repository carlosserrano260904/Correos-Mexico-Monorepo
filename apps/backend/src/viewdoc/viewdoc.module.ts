import { Module } from '@nestjs/common';
import { ViewdocController } from './viewdoc.controller';
import { ViewdocService } from './viewdoc.service';

@Module({
  controllers: [ViewdocController],
  providers: [ViewdocService],
})
export class ViewdocModule {}
