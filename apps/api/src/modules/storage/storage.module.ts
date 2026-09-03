import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { R2_S3_CLIENT, R2_STORAGE_CONFIG } from './consts/r2.const';
import { createR2S3Client, createR2StorageConfig } from './r2.factory';
import { StorageService } from './storage.service';

@Module({
  providers: [
    {
      provide: R2_S3_CLIENT,
      inject: [ConfigService],
      useFactory: createR2S3Client,
    },
    {
      provide: R2_STORAGE_CONFIG,
      inject: [ConfigService],
      useFactory: createR2StorageConfig,
    },
    StorageService,
  ],
  exports: [R2_S3_CLIENT, R2_STORAGE_CONFIG, StorageService],
})
export class StorageModule {}
