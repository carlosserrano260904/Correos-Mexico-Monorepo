import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';

@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadService: UploadImageService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = await this.uploadService.uploadFileImage(file);
    return { url };
  }
}
