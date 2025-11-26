import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3Provider: Provider = {
  provide: S3Client,
  useFactory: (config: ConfigService) => {
    const region = config.get<string>('AWS_REGION');
    const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = config.get<string>('AWS_S3_ENDPOINT');

    const missing = [
      !region && 'AWS_REGION',
      !accessKeyId && 'AWS_ACCESS_KEY_ID',
      !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
      !endpoint && 'AWS_S3_ENDPOINT',
    ].filter(Boolean);

    if (missing.length > 0) {
      throw new Error(`Faltan variables de entorno: ${missing.join(', ')}`);
    }

    return new S3Client({
      region: region!,
      endpoint: endpoint!,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
      forcePathStyle: true,
    });
  },
  inject: [ConfigService],
};
