import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import type { R2StorageConfig } from './consts/r2.const';

export function createR2S3Client(configService: ConfigService): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: configService.getOrThrow<string>('CLOUDFLARE_S3_API_ENDPOINT'),
    credentials: {
      accessKeyId: configService.getOrThrow<string>(
        'CLOUDFLARE_R2_ACCESS_KEY_ID',
      ),
      secretAccessKey: configService.getOrThrow<string>(
        'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
      ),
    },
  });
}

export function createR2StorageConfig(
  configService: ConfigService,
): R2StorageConfig {
  const publicUrl = configService
    .getOrThrow<string>('CLOUDFLARE_R2_PUBLIC_URL')
    .replace(/\/$/, '');

  return {
    bucket: configService.getOrThrow<string>('CLOUDFLARE_R2_BUCKET'),
    endpoint: configService.getOrThrow<string>('CLOUDFLARE_S3_API_ENDPOINT'),
    publicUrl,
  };
}
