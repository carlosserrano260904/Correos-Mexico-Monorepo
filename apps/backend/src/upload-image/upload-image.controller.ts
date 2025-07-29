import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';

@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadService: UploadImageService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadFile(file);
    return { url };
  }

  @Get('signed-url')
  async getSignedUrl(@Query('key') key: string) {
    if (!key) {
      return { signedUrl: null, error: 'Missing key' };
    }

    const signedUrl = await this.uploadService.getSignedUrlForImage(key);
    return { signedUrl };
  }
}