import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import { join } from 'path';

@Injectable()
export class UploadGcsService {
  private storage: Storage;
  private bucketName: string;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('GCS_BUCKET_NAME');

    if (!bucket) {
      throw new Error('GCS_BUCKET_NAME is not defined');
    }

    this.bucketName = bucket;

    this.storage = new Storage({
      keyFilename: join(__dirname, '../../keys/tactical-curve-461301-m9-b80678c35a6f.json'),
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