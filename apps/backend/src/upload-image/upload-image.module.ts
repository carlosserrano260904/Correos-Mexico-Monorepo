import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadImageService } from './upload-image.service';
import { S3Provider } from './s3.provider';
import { UploadImageController } from './upload-image.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UploadImageController],
  providers: [UploadImageService, S3Provider],
  exports: [UploadImageService],
})
export class UploadImageModule {}
