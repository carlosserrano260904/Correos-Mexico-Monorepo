import { Module } from '@nestjs/common';
import { PDFGeneratorCreateService } from './pdf-generator-create.service';
import { GuiaPdfController } from './pdf-generator.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [GuiaPdfController],
  providers: [PDFGeneratorCreateService],
  exports: [],
})
export class PDFGeneratorModule {}
