import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class  UploadImageService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly s3: S3Client;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('AWS_S3_BUCKET');
    const region = this.config.get<string>('AWS_REGION');
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = config.get<string>('AWS_S3_ENDPOINT');

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
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file?: Express.Multer.File): Promise<string> {
      // ✅ AGREGAR ESTA VERIFICACIÓN AL INICIO:
        if (!file) {
          console.log('⚠️ No file provided, using default image');
          return 'default'; // Devolver un key por defecto
        }
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

    return `https://correos-storage.emmanuelbayona.dev/${key}`;
  }

  async uploadEvidenceDistributor(file: Express.Multer.File): Promise<string> {
    const key = `evidenciasPaquetes/${uuid()}-${file.originalname}`;
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(cmd);

    return `https://correos-storage.emmanuelbayona.dev/${key}`;
  }
}