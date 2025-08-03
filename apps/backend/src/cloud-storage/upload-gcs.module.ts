import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadGcsController } from './upload-gcs.controller';
import { UploadGcsService } from './upload-gcs.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UploadGcsController],
  providers: [UploadGcsService],
  exports: [UploadGcsService],
})
export class UploadGcsModule {}