import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Options } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from './upload-image.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Upload Image')
@Controller('upload-image')
export class UploadImageController {
  constructor(private readonly uploadService: UploadImageService) {}

  @Options('image')
  @ApiOperation({ summary: 'Handle CORS preflight for image upload' })
  async handleOptions() {
    return { message: 'CORS preflight handled' };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check for upload service' })
  @ApiResponse({ status: 200, description: 'Upload service is running' })
  async healthCheck() {
    return { status: 'ok', message: 'Upload service is running', timestamp: new Date().toISOString() };
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log('📤 Upload request received:', {
      originalname: file?.originalname,
      mimetype: file?.mimetype,
      size: file?.size,
      hasBuffer: !!file?.buffer
    });

    if (!file) {
      console.error('❌ No file uploaded');
      throw new BadRequestException('No file uploaded');
    }

    if (!file.buffer || file.buffer.length === 0) {
      console.error('❌ File buffer is empty');
      throw new BadRequestException('File is empty');
    }

    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.mimetype);
      throw new BadRequestException('Only image files are allowed');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', file.size);
      throw new BadRequestException('File size must be less than 10MB');
    }

    try {
      const url = await this.uploadService.uploadFileImage(file);
      console.log('✅ Upload successful, returning URL:', url);
      return { url };
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }
}