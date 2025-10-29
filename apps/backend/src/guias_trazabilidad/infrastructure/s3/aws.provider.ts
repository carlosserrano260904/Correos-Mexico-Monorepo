import { InternalServerErrorException, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

/**
 * Token para inyectar el S3Client en el AWSRepository
 */
export const AWS_S3_CLIENT = 'AWS_S3_CLIENT';

/**
 * Inyecta el S3Client en el AWSRepository sin decoradores como si los tuviera
 */
export const AWSProvider: Provider = {
  provide: AWS_S3_CLIENT,
  useFactory: (config: ConfigService) => {
    const region = config.get<string>('AWS_REGION');
    const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = config.get<string>('AWS_SECRET_ACCESS_KEY');
    const endpoint = config.get<string>('AWS_S3_ENDPOINT');

    if (!region || !accessKeyId || !secretAccessKey || !endpoint) {
      throw new InternalServerErrorException(
        'Env vars faltantes para S3: ' +
          [
            !region && 'AWS_REGION',
            !accessKeyId && 'AWS_ACCESS_KEY_ID',
            !secretAccessKey && 'AWS_SECRET_ACCESS_KEY',
            !endpoint && 'AWS_S3_ENDPOINT',
          ]
            .filter(Boolean)
            .join(', ')
      );
    }

    return new S3Client({
      region,
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  },
  inject: [ConfigService],
};