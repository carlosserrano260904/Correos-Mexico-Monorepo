import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadGcsService } from './upload-gcs.service';
import { memoryStorage } from 'multer';

@Controller('upload-gcs')
export class UploadGcsController {
  constructor(private readonly uploadGcsService: UploadGcsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadGcsService.uploadFile(file);
    return { url };
  }

  @Post('evidenciaPaquete/image')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadEvidenceDistributor(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadGcsService.uploadFile(file);
    return { url };
  }
}