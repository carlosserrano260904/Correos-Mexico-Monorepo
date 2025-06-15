import { Module } from '@nestjs/common';
import { UploadImageProvider } from './upload-image';
import { UploadImageService } from './upload-image.service';
@Module({
  providers: [UploadImageService, UploadImageProvider],
  exports:[UploadImageService, UploadImageProvider],
})
export class UploadImageModule {}
