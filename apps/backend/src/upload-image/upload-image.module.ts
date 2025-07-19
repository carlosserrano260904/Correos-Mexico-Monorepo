// src/upload-image/upload-image.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadImageService } from './upload-image.service';
import { S3Provider } from './s3.provider'; 

@Module({
  imports: [ConfigModule],
  providers: [UploadImageService, S3Provider],
  exports: [UploadImageService],
})
export class UploadImageModule {}
