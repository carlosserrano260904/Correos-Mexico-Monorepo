import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as mammoth from 'mammoth';

@Injectable()
export class ViewdocService {
  private readonly logger = new Logger(ViewdocService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.get<string>('AWS_S3_BUCKET')!;
    const region = this.config.get<string>('AWS_REGION')!;
    const accessKeyId = this.config.get<string>('AWS_ACCESS_KEY_ID')!;
    const secretAccessKey = this.config.get<string>('AWS_SECRET_ACCESS_KEY')!;
    const endpoint = config.get<string>('AWS_S3_ENDPOINT');

    this.s3 = new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });

    this.logger.debug(`Cliente S3 configurado con bucket: ${this.bucket}`);
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (c) => chunks.push(c));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async getHtmlFromDocx(key: string): Promise<string> {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const { Body } = await this.s3.send(cmd);
    const buffer = await this.streamToBuffer(Body as Readable);
    const { value: html } = await mammoth.convertToHtml({ buffer });

    return html;
  }
}
