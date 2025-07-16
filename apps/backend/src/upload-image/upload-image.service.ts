// src/upload-image/upload-image.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadImageService {
  private readonly bucket: string;
  private readonly region: string;

  constructor(
    private readonly s3: S3Client,
    private readonly config: ConfigService,
  ) {
    const bucket = this.config.get<string>('AWS_S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION');
    if (!bucket || !region) {
      throw new Error(
        'Env vars faltantes en UploadImageService: ' +
          [!bucket && 'AWS_S3_BUCKET', !region && 'AWS_REGION']
            .filter(Boolean)
            .join(', ')
      );
    }
    this.bucket = bucket;
    this.region = region;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });
    await this.s3.send(cmd);
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
