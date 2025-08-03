import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import { join, resolve } from 'path';

@Injectable()
export class UploadGcsService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('GCS_BUCKET_NAME');
    const keyPath = this.config.get<string>('GOOGLE_APPLICATION_CREDENTIALS');

    if (!bucket) {
      throw new Error('GCS_BUCKET_NAME is not defined');
    }

    if (!keyPath) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not defined');
    }

    this.bucketName = bucket;

    this.storage = new Storage({
      keyFilename: resolve(keyPath),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuid()}-${file.originalname}`;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(key);

    await blob.save(file.buffer, {
      contentType: file.mimetype,
    });

    return key;
  }
}