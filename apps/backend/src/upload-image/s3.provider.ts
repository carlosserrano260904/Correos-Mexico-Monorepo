// src/upload-image/s3.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3Provider: Provider = {
  provide: S3Client,
  useFactory: (config: ConfigService) => {
    const region = config.get<string>('AWS_REGION');
    const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');

    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error(
        'Env vars faltantes para S3: ' +
          [
            !region && 'AWS_REGION',
            !accessKeyId && 'AWS_ACCESS_KEY_ID',
            !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
          ]
            .filter(Boolean)
            .join(', ')
      );
    }

    return new S3Client({
      region,
      endpoint: config.get<string>('AWS_S3_ENDPOINT'), // 👈 necesario para Backblaze B2
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true, // 👈 recomendado para compatibilidad con B2
    });
  },
  inject: [ConfigService],
};
