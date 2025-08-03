import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadImageService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly s3: S3Client;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('AWS_S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = this.config.get<string>('AWS_S3_ENDPOINT');

    if (!bucket || !region || !accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error(
        'Faltan variables de entorno requeridas: ' +
          [
            !bucket && 'AWS_S3_BUCKET',
            !region && 'AWS_REGION',
            !accessKeyId && 'AWS_ACCESS_KEY_ID',
            !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
            !endpoint && 'AWS_S3_ENDPOINT',
          ]
            .filter(Boolean)
            .join(', ')
      );
    }

    this.bucket = bucket;
    this.region = region;
    this.s3 = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: `https://${endpoint}`,
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(cmd);

    return key;
  }

    async uploadFileImage(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3.send(cmd);

    const publicUrl = `https://${this.config.get<string>('AWS_S3_ENDPOINT')}/${this.bucket}/${key}`;
    return publicUrl;
  }

  async getSignedUrlForImage(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });
  }
}